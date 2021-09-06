<template>
  <div class="flex-1 flex-col">
    <page-header />
    <div
      v-if="user"
      class="flex-1 grid grid-cols-1 gap-14 py-10 container mx-auto px-5"
    >
      <div class="text-4xl font-bold">Welcome, {{ user.name }}.</div>

      <div class="flex-1 flex flex-col">
        <DashboardStats :workouts="workouts" />
      </div>

      <DashboardWorkouts />

      <DashboardTemplates />

      <div class="flex justify-center">
        <div class="grid grid-cols-2 gap-3">
          <button
            class="bg-primary-light text-primary rounded-lg px-4 py-2"
            @click="refreshWorkouts()"
          >
            Refresh
          </button>
          <button
            class="bg-primary-light text-primary rounded-lg px-4 py-2"
            @click="resetWorkouts()"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions } from "vuex"

export default Vue.extend({
  data() {
    return {
      exercises: [],
    }
  },
  computed: {
    user() {
      return this.$store.state.user?.user
    },
    workouts() {
      const completed = this.$store.state.workouts.workouts.filter(
        (w: any) => w.completionDate
      )

      return completed
    },
  },
  created() {
    this.initUser()
    this.refreshWorkouts()
  },
  methods: {
    ...mapActions({
      initUser: "user/init",
      refreshWorkouts: "workouts/refresh",
      resetWorkouts: "workouts/reset",
    }),
  },
})
</script>
