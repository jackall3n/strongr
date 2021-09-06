<template>
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
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  computed: {
    user() {
      return this.$store.state.user?.user
    },
  },
})
</script>
