<template>
  <AppNavbar />
  <Sidebar />
  <ShippingToForm @save="registerShipping" />
</template>

<script setup>
import { useRouter } from "vue-router";
import AppNavbar from "@/components/common/AppNavbar.vue";
import Sidebar from "@/components/common/Sidebar.vue";
import ShippingToForm from "@/components/shipping/ShippingToForm.vue";

const router = useRouter();

const registerShipping = (data) => {
  console.log("登録データ:", data);
  router.push("/shipping");
};
</script>
