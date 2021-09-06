<template>
  <div class="flex-1 flex flex-col">
    <h2 class="font-bold text-xl mb-3">Templates ({{ templates.length }})</h2>
    <div
      class="
        flex-1
        grid grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-5
        gap-4
      "
    >
      <div v-for="folder of folders" :key="folder.id" class="contents">
        <div
          class="
            flex
            font-semibold
            col-span-2
            md:col-span-3
            lg:col-span-4
            xl:col-span-5
            mt-3
          "
        >
          {{ folder.name }} ({{ folder.templates.length }})
        </div>

        <div
          v-for="workout in folder.templates"
          :key="workout.id"
          class="border border-gray-200 rounded-2xl flex flex-col px-5 py-4"
        >
          <div class="font-bold leading-tight">{{ workout.name }}</div>

          <div class="flex-1 mt-1.5">
            <div
              v-for="exercise in workout.exercises"
              :key="exercise.uid"
              class="
                text-light-grey
                mt-0.5
                text-sm
                overflow-ellipsis overflow-hidden
                whitespace-nowrap
              "
            >
              {{ exercise.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { differenceInDays, differenceInHours, format, parseISO } from "date-fns"
import { groupBy, orderBy, uniqBy } from "lodash"

export default Vue.extend({
  computed: {
    templates() {
      return this.$store.state.workouts.workouts.filter(
        (w: any) => w.isTemplate
      )
    },
    folders() {
      const that = this as any
      const folders = uniqBy(
        that.templates.map((w: any) => w.folder).filter(Boolean),
        "id"
      ) as any[]

      const ordered = orderBy(folders, "index")

      ordered.push({
        id: "-",
        name: "Other",
        index: 1000,
      })

      const grouped = groupBy(that.templates, (w) => w.folder?.id ?? "-")

      const mapped = ordered.map((folder: any) => ({
        ...folder,
        templates: orderBy(grouped[folder.id], "index"),
      }))

      return mapped.filter((w) => w.templates.length)
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
