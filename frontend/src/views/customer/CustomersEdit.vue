<template>
  <n-card>
    <CustomerForm :customer="customerData" isEdit @save="updateCustomer" @delete="deleteCustomer" @back="goBack" />
  </n-card>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import CustomerForm from "@/components/customer/CustomerForm.vue";

const router = useRouter();
const route = useRoute();
const customerData = { id: route.params.id, name: "テスト太郎", zipcode: "1000001", phone: "0312345678" };

const updateCustomer = (data) => {
  console.log("更新データ:", data);
  router.push("/customers");
};

const deleteCustomer = () => {
  console.log("削除:", customerData.id);
  router.push("/customers");
};

const goBack = () => {
  router.push("/customers");
};
</script>
