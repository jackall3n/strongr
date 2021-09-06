import { ActionTree, MutationTree } from "vuex"
import { orderBy, uniqBy } from "lodash"
import { differenceInSeconds, parseISO } from "date-fns"
import { createApi } from "~/api/createApi"

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
  async reset({ commit, rootState }) {
    const api = createApi(rootState)
    const { results } = await api.workouts("")

    const ordered = orderBy(results, "completionDate", "desc")

    const mapped = ordered.map((workout) => ({
      ...workout,
      duration: differenceInSeconds(
        parseISO(workout.completionDate),
        parseISO(workout.startDate)
      ),
    }))

    commit("workouts", mapped)
  },
  async refresh({ commit, state, rootState }) {
    if (typeof window === "undefined") {
      return
    }

    const current = state.workouts

    const [latest] = orderBy(current, "updatedAt", "desc")

    const api = createApi(rootState)

    const { results } = await api.workouts(latest?.updatedAt ?? "")

    const workouts = [...current, ...results]

    const orderByUpdated = orderBy(workouts, "updatedAt", "desc")
    const unique = uniqBy(orderByUpdated, "id")
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
