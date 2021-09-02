import { ActionTree, MutationTree } from "vuex"
import { orderBy, sortedUniqBy } from "lodash"
import { createApi } from "~/api/createApi"
import { differenceInSeconds, parseISO } from "date-fns"

type State = {
  workouts: any[]
}

export const state = (): State => ({
  workouts: [],
})

export const mutations: MutationTree<State> = {
  workouts(state, workouts) {
    state.workouts = workouts
  },
}

export const actions: ActionTree<State, any> = {
  async refresh({ commit, state, rootState }) {
    if (typeof window === "undefined") {
      return
    }

    const [latest] = orderBy(state.workouts, "updatedAt", "desc")

    const api = createApi(rootState)

    const { results } = await api.workouts(latest?.updatedAt ?? "")

    const workouts = [...state.workouts, ...results]

    const unique = sortedUniqBy(orderBy(workouts, "updatedAt", "desc"), "id")

    const ordered = orderBy(unique, "completionDate", "desc")

    const mapped = ordered.map((workout) => ({
      ...workout,
      duration: differenceInSeconds(
        parseISO(workout.completionDate),
        parseISO(workout.startDate)
      ),
    }))

    commit("workouts", mapped)
  },
}
