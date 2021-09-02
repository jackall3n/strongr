import createPersistedState from "vuex-persistedstate"

export default ({ store }) => {
  createPersistedState({
    paths: ["workouts", "exercises", "user.id", "user.user"],
  })(store)
}
