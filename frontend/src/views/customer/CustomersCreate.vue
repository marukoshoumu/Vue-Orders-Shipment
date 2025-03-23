<template>
  <n-card>
    <CustomerForm @save="saveCustomer" @back="goBack" />
  </n-card>
</template>

<script setup>
import { useRouter } from "vue-router";
import CustomerForm from "@/components/customer/CustomerForm.vue";

const router = useRouter();

const saveCustomer = (data) => {
  console.log("登録データ:", data);
  router.push("/customers");
};

const goBack = () => {
  router.push("/customers");
};
</script>
