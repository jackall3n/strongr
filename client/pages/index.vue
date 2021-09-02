<template>
  <div class="flex-1 flex-col">
    <header class="bg-dark h-14 flex-1 flex text-white">
      <div class="container mx-auto flex items-center justify-between px-5">
        <div
          class="
            h-8
            w-8
            bg-primary
            rounded-lg
            flex
            items-center
            justify-center
            font-bold
            text-lg
          "
        >
          S
        </div>

        <div v-if="user" class="text-sm tracking-wide text-right">
          <div class="font-medium">@{{ user.username }}</div>
          <div v-if="false" class="text-xs text-white text-opacity-60 mt-0.5">
            {{ user.email }}
          </div>
        </div>
      </div>
    </header>
    <div
      v-if="user"
      class="flex-1 grid grid-cols-1 gap-10 py-10 container mx-auto px-5"
    >
      <div class="text-3xl font-bold">Welcome, {{ user.name }}.</div>

      <div class="flex-1 flex flex-col">
        <DashboardStats :workouts="workouts" />
      </div>

      <div class="flex-1 flex flex-col">
        <h2 class="font-bold text-xl mb-3">
          Recent Workouts ({{ recentWorkouts.length }})
        </h2>
        <div
          class="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          <div
            v-for="workout in recentWorkouts"
            :key="workout.id"
            class="border border-gray-200 rounded-2xl flex flex-col px-5 py-4"
          >
            <div class="font-bold leading-tight">{{ workout.name }}</div>

            <div class="flex py-2 text-light-grey">
              <div class="flex items-center">
                <span class="mr-1"
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                    /></svg
                ></span>
                <span class="font-semibold text-sm">{{ workout.prs }}</span>
              </div>
            </div>

            <div class="flex-1 text-light-grey text-sm overflow-ellipsis mh">
              {{ workout.exercises.map((e) => e.name).join(", ") }}
            </div>

            <div class="flex pt-3 text-light-grey">
              <div class="flex items-center">
                <span class="mr-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
                <span class="font-semibold text-sm">{{
                  timeSince(workout)
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions } from "vuex"
import { take } from "lodash"
import { differenceInDays, differenceInHours, format, parseISO } from "date-fns"

export default Vue.extend({
  data() {
    return {
      exercises: [],
    }
  },
  computed: {
    recentWorkouts() {
      const workouts = (this as any) /* TODO FIX THIS */.workouts

      return take(workouts, 10)
    },
    user() {
      return this.$store.state.user?.user
    },
    workouts() {
      return this.$store.state.workouts.workouts
    },
  },
  created() {
    this.initUser()
    this.refreshWorkouts()
  },
  methods: {
    timeSince(workout: any) {
      if (!workout.completionDate) {
        return undefined
      }

      const now = new Date()
      const date = parseISO(workout.completionDate)
      const hours = differenceInHours(now, date)

      if (hours < 24) {
        if (hours === 0) {
          return `Just now`
        }

        if (hours === 1) {
          return `An hour ago`
        }

        return `${hours} hours ago`
      }

      const days = differenceInDays(now, date)

      if (days < 30) {
        if (days === 0) {
          return `Today`
        }

        if (days === 1) {
          return `A day ago`
        }

        return `${days} days ago`
      }

      return format(date, "do MMM")
    },
    ...mapActions({
      initUser: "user/init",
      refreshWorkouts: "workouts/refresh",
    }),
  },
})
</script>

<style>
.mh {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
