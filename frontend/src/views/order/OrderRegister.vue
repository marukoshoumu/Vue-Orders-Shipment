<template>
  <AppNavbar />
  <Sidebar />
  <n-card class="form-card">
    <!-- 顧客情報エリア -->
    <CustomerInfo @updateCustomer="setCustomerData" />

    <!-- 発送先情報エリア -->
    <ShippingToInfo @updateShippingTo="setShippingToData" />

    <!-- 発送元情報エリア -->
    <ShippingFromInfoArea :customerData="customerData" :shippingToData="shippingToData" />

    <!-- 受注基本情報エリア -->
    <OrderBasicInfoArea @updateDeliveryMethod="setDeliveryMethod" />

    <!-- 商品登録エリア -->
    <ProductInfoArea />

    <!-- 発送情報エリア (selectedDeliveryMethod を渡す) -->
    <ShippinInfoArea :selectedDeliveryMethod="selectedDeliveryMethod" />

    <n-space justify="end">
      <n-button type="primary" @click="submitOrder">登録</n-button>
      <n-button @click="goBack">戻る</n-button>
    </n-space>
  </n-card>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import AppNavbar from "@/components/common/AppNavbar.vue";
import Sidebar from "@/components/common/Sidebar.vue";
import CustomerInfo from "@/components/customer/CustomerInfoArea.vue";
import ShippingToInfo from "@/components/shipping/ShippingToInfoArea.vue";
import ShippingFromInfoArea from "@/components/shipping/ShippingFromInfoArea.vue";
import OrderBasicInfoArea from "@/components/order/OrderBasicInfoArea.vue";
import ProductInfoArea from "@/components/product/ProductInfoArea.vue";
import ShippinInfoArea from "@/components/shipping/ShippinInfoArea.vue";

const router = useRouter();
const customerData = ref(null);
const shippingToData = ref(null);
const selectedDeliveryMethod = ref(""); // 納品方法の状態管理

const setCustomerData = (data) => {
  customerData.value = data;
};

const setShippingToData = (data) => {
  shippingToData.value = data;
};

// 納品方法を更新
const setDeliveryMethod = (method) => {
  selectedDeliveryMethod.value = method;
};

const submitOrder = () => {
  console.log("受注データ:", {
    customer: customerData.value,
    shippingTo: shippingToData.value,
    deliveryMethod: selectedDeliveryMethod.value,
  });
};

const goBack = () => {
  router.push("/orders");
};
</script>

<style scoped>
.form-card {
  max-width: 900px;
  margin: 10px auto;
  padding: 10px;
  background-color: #f9fafb;
  border-radius: 10px;
}
</style>
