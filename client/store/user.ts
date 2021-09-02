import { ActionTree, MutationTree } from "vuex"
import { createApi } from "~/api/createApi"

type State = {
  id?: string
  user?: any
  lastSeen?: Date
  loading: boolean
}

export const state = () => ({
  id: "HlvTjDDwoy",
  user: undefined,
  loading: true,
  lastSeen: undefined,
})

export const mutations: MutationTree<State> = {
  updateLastSeen(state) {
    console.log({ state })
    state.lastSeen = new Date()
  },
  loading(state, loading) {
    state.loading = loading
  },
  user(state, user) {
    state.user = user
  },
}

export const actions: ActionTree<State, any> = {
  async init({ commit, state, rootState }) {
    if (!state.id) {
      commit("loading", false)
      return
    }

    const api = createApi(rootState)

    const user = await api.user()

    commit("user", user)
  },
}
