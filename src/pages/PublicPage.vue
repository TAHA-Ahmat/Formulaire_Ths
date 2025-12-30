<template>
  <div class="public-page">
    <PublicListComponent />
  </div>
</template>

<script>
import PublicListComponent from '@/components/PublicListComponent.vue'

export default {
  name: 'PublicPage',
  components: {
    PublicListComponent
  }
}
</script>

<style scoped>
.public-page {
  padding: 2rem 0;
}
</style>
