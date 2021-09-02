<template>
  <div>
    <div class="flex justify-between flex-col lg:flex-row lg:items-center">
      <h2 class="text-xl font-bold">Statistics</h2>

      <div
        class="
          bg-primary-light
          grid grid-cols-2
          sm:grid-cols-4
          justify-center
          rounded-lg
          text-primary text-sm
          font-semibold
          overflow-hidden
          my-2
          lg:mt-0
        "
      >
        <button
          v-for="p of periods"
          :key="p.value"
          class="
            px-3
            py-2
            whitespace-nowrap
            font-semibold
            transition-colors
            flex-1
          "
          :class="{ 'bg-primary text-white': period === p.value }"
          @click="period = p.value"
        >
          {{ p.description }}
        </button>
      </div>
    </div>

    <div class="grid mt-3 gap-5 grid-cols-2 lg:grid-cols-4">
      <div
        v-for="statistic of statistics"
        :key="statistic.description"
        class="
          border border-gray-200
          rounded-2xl
          flex flex-col
          items-center
          justify-center
          p-5
          sm:p-8
        "
      >
        <div class="text-4xl sm:text-5xl font-semibold whitespace-nowrap">
          {{ statistic.value }}
        </div>
        <div
          class="
            text-center
            tracking-wide
            pt-3
            sm:pt-5
            text-xs
            sm:text-base
            text-light-grey
            sm:whitespace-nowrap
          "
        >
          {{ statistic.description }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import {
  intervalToDuration,
  isAfter,
  parseISO,
  startOfWeek,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns"
import { groupBy, orderBy } from "lodash"

export default Vue.extend({
  props: {
    workouts: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      period: "week",
      periods: [
        {
          description: "Last 7 Days",
          value: "week",
        },
        {
          description: "Last 1 Month",
          value: "month",
        },
        {
          description: "Last 1 Year",
          value: "year",
        },
        {
          description: "All Time",
          value: "all",
        },
      ],
    }
  },
  computed: {
    statistics() {
      if (!this.workouts.length) {
        return []
      }

      const fromDate = this.fromDate

      const workouts = this.workouts.filter((w: any) =>
        isAfter(parseISO(w.createdAt), fromDate)
      )
      const dates = workouts.map(({ createdAt }: any) => parseISO(createdAt))

      const byWeek = groupBy(dates, startOfWeek)
      const weeks = Object.keys(byWeek)
      const averagePerWeek = dates.length / weeks.length
      const weeklyWorkouts = Object.values(byWeek).map((w) => w.length)
      const mostPerWeek = Math.max(...weeklyWorkouts)
      const [longestWorkout] = orderBy(workouts, "duration", "desc")

      const duration = intervalToDuration({
        start: parseISO(longestWorkout.startDate),
        end: parseISO(longestWorkout.completionDate),
      })

      console.log(longestWorkout, duration)

      const totalWorkouts = {
        description: "Total Workouts",
        value: workouts.length,
      }

      const workoutsPerWeek = {
        description: "Workouts Per Week",
        value: averagePerWeek.toFixed(1),
      }

      const mostWorkoutsPerWeek = {
        description: "Most Workouts Per Week",
        value: mostPerWeek,
      }

      function pad(number: number) {
        const s = `0${number}`
        return s.substr(s.length - 2)
      }

      const longestEverWorkout = {
        description: "Longest Workout",
        value: `${duration.hours}h ${duration.minutes}m`,
      }

      const averages = [
        totalWorkouts,
        workoutsPerWeek,
        mostWorkoutsPerWeek,
        longestEverWorkout,
      ]

      return averages
    },
    fromDate() {
      const now = new Date()

      switch (this.period) {
        case "week":
          return subWeeks(now, 1)
        case "month":
          return subMonths(now, 1)
        case "year":
          return subYears(now, 1)
        default:
          return subYears(now, 10)
      }
    },
  },
})
</script>
