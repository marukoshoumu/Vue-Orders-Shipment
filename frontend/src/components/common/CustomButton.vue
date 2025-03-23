<template>
  <n-button :class="buttonClass" strong secondary @click="onClick">
    <template #icon>
      <n-icon>
        <svg :viewBox="'0 0 24 24'" xmlns="http://www.w3.org/2000/svg">
          <path :d="icon" />
        </svg>
      </n-icon>
    </template>
    {{ label }}
  </n-button>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
  label: String,
  icon: String, // SVGパスを文字列として受け取る
  buttonClass: String,
  onClick: Function,
});
</script>

<style scoped>
/* カスタムボタンのスタイル */
.btn-register {
  background-color: #28a745;
  color: white;
}

.btn-search {
  background-color: #007bff;
  color: white;
}

.btn-copy {
  background-color: #ff9800;
  color: white;
}

.btn-history {
  background-color: #9c27b0;
  color: white;
}
</style>
