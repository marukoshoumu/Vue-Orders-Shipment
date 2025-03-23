<template>
  <AppNavbar />
  <Sidebar />
  <ShippingToForm :shipping="shippingData" :isEdit="true" @save="updateShipping" @delete="deleteShipping" />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import AppNavbar from "@/components/common/AppNavbar.vue";
import Sidebar from "@/components/common/Sidebar.vue";
import ShippingToForm from "@/components/shipping/ShippingToForm.vue";

const router = useRouter();
const route = useRoute();
const shippingId = route.params.id;

const shippingData = ref(null);

onMounted(() => {
  console.log(`発送先データ取得: ID = ${shippingId}`);
  shippingData.value = {
    company: "テスト株式会社",
    department: "営業部",
    name: "田中 太郎",
    zipcode: "1234567",
    address1: "東京都渋谷区",
    address2: "1丁目2番地3号",
    phone: "0312345678",
    email: "tanaka@example.com",
    note: "サンプルデータ",
  };
});

const updateShipping = () => router.push("/shipping");
const deleteShipping = () => router.push("/shipping");
</script>
