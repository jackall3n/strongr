<template>
  <div class="flex-1 flex flex-col">
    <h2 class="font-bold text-xl mb-3">
      Recent Workouts ({{ recent.length }})
    </h2>
    <div
      class="
        flex-1
        grid grid-cols-2
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-5
        gap-4
      "
    >
      <div
        v-for="workout in recent"
        :key="workout.id"
        class="border border-gray-200 rounded-2xl flex flex-col px-5 py-4"
      >
        <div class="font-bold leading-tight">{{ workout.name }}</div>

        <div class="flex justify-between py-2 text-light-grey">
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
            <span class="font-semibold text-sm whitespace-nowrap"
              >{{ workout.total.toFixed(0) }} kg</span
            >
          </div>
          <div v-if="workout.prs" class="flex items-center">
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
                  d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
                /></svg
            ></span>
            <span class="font-semibold text-sm">
              <span>{{ workout.prs }} </span>
              <span v-if="workout.prs !== 1">PRs</span>
              <span v-if="workout.prs === 1">PR</span>
            </span>
          </div>
        </div>

        <div class="flex-1 text-light-grey text-sm">
          <div class="grid grid-cols-5 gap-x-4 items-start justify-start">
            <div class="font-medium col-span-3">Exercise</div>
            <div class="font-medium col-span-2 mb-0.5">Best Set</div>
            <div
              v-for="exercise of workout.exercises"
              :key="exercise.id"
              class="contents"
            >
              <div
                class="
                  whitespace-nowrap
                  overflow-ellipsis overflow-hidden
                  col-span-3
                "
              >
                {{ exercise.sets.length }} x {{ exercise.name }}
              </div>
              <div
                class="
                  col-span-2
                  whitespace-nowrap
                  overflow-ellipsis overflow-hidden
                "
              >
                {{ bestSet(exercise) }}
              </div>
            </div>
          </div>
        </div>

        <div class="flex pt-3 text-light-grey">
          <div class="flex items-center">
            <span class="mr-1.5">
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
            <span class="font-semibold text-sm">{{ timeSince(workout) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { orderBy, take } from "lodash"
import { differenceInDays, differenceInHours, format, parseISO } from "date-fns"

export default Vue.extend({
  computed: {
    recent() {
      const completed = this.$store.state.workouts.workouts.filter(
        (w: any) => w.completionDate
      )

      return take(completed, 10)
    },
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
    bestSet(exercise: any) {
      if (!exercise.sets?.length) {
        return ""
      }

      const [{ reps, kilograms }] = orderBy(exercise.sets, "total", "desc")

      if (!kilograms) {
        return `${reps} reps`
      }

      return `${reps} x ${kilograms}kg`
    },
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
