<template>
  <div class="form-page">
    <FormComponent />
  </div>
</template>

<script>
import FormComponent from '@/components/FormComponent.vue'

export default {
  name: 'FormPage',
  components: {
    FormComponent
  }
}
</script>

<style scoped>
.form-page {
  padding: 2rem 0;
}
</style>
