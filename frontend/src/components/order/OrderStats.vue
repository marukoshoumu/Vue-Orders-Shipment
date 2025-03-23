<script setup>
import { ref } from "vue";

// ダミーデータ
const orders = ref([
  { id: 1, customer: "田中 太郎", total: 10000 },
  { id: 2, customer: "佐藤 花子", total: 5000 },
  { id: 3, customer: "鈴木 一郎", total: 15000 },
]);

const totalSales = orders.value.reduce((sum, order) => sum + order.total, 0);
const totalOrders = orders.value.length;
</script>

<template>
  <div class="p-4 bg-gray-100 rounded-md shadow">
    <p class="text-lg font-semibold">受注数: {{ totalOrders }} 件</p>
    <p class="text-lg font-semibold">売上合計: {{ totalSales }} 円</p>
  </div>
</template>
