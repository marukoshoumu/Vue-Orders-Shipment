<template>
  <div>
    <ShippingCount />
    <ShippingDetails />
  </div>
</template>

<script setup>
import ShippingCount from "@/components/shipping/ShippingCount.vue";
import ShippingDetails from "@/components/shipping/ShippingDetails.vue";
</script>

<script>
export default {
  name: "DashboardView",
};
</script>
