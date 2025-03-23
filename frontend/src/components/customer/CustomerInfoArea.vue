<template>
  <n-card title="顧客情報" class="customer-info-card" bordered size="large">
    <!-- 🔹 ボタンエリア -->
    <n-grid :cols="gridCols" :x-gap="10" :y-gap="10" class="button-container">
      <n-gi v-for="(button, index) in buttons" :key="index">
        <CustomButton :label="button.label" :icon="button.icon" :buttonClass="button.class" :onClick="button.action" />
      </n-gi>
    </n-grid>

    <!-- 🔹 顧客情報フォーム -->
    <n-form label-width="120px" class="customer-form">
      <n-space vertical size="large">
        <n-form-item label="顧客名" class="form-label">
          <n-input v-model:value="customerData.name" bordered readonly placeholder="顧客名を選択" />
        </n-form-item>
        <n-form-item label="郵便番号" class="form-label">
          <n-input v-model:value="customerData.zipcode" bordered readonly placeholder="郵便番号" />
        </n-form-item>
        <n-form-item label="住所" class="form-label">
          <n-input v-model:value="customerData.address" bordered readonly placeholder="住所" />
        </n-form-item>
        <n-form-item label="電話番号" class="form-label">
          <n-input v-model:value="customerData.phone" bordered readonly placeholder="電話番号" />
        </n-form-item>
      </n-space>
    </n-form>

    <!-- 🔹 モーダル -->
    <CustomerSearchModal v-model:show="isSearchModalOpen" @select="applyCustomer" />
    <CustomerRegisterModal v-model:show="isRegisterModalOpen" @register="applyCustomer" />
  </n-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { mdiAccountPlus, mdiMagnify, mdiContentCopy, mdiHistory } from "@mdi/js";
import CustomButton from "@/components/common/CustomButton.vue";
import CustomerSearchModal from "@/components/customer/CustomerSearchModal.vue";
import CustomerRegisterModal from "@/components/customer/CustomerRegisterModal.vue";

const isSearchModalOpen = ref(false);
const isRegisterModalOpen = ref(false);

const customerData = ref({
  name: "",
  zipcode: "",
  address: "",
  phone: "",
});

// **発送先同上**
const copyToShipping = () => alert("発送先情報にコピーしました！");

// **前回商品反映**
const applyPreviousOrder = () => alert("前回の注文商品を反映しました！");

// **ボタン情報**
const buttons = [
  { label: "新規登録", icon: mdiAccountPlus, class: "btn-register", action: () => (isRegisterModalOpen.value = true) },
  { label: "顧客検索", icon: mdiMagnify, class: "btn-search", action: () => (isSearchModalOpen.value = true) },
  { label: "発送先同上", icon: mdiContentCopy, class: "btn-copy", action: copyToShipping },
  { label: "前回商品反映", icon: mdiHistory, class: "btn-history", action: applyPreviousOrder },
];

// **レスポンシブ対応**
const gridCols = ref(4);
const updateGridCols = () => {
  const width = window.innerWidth;
  gridCols.value = width < 600 ? 1 : width < 900 ? 2 : 4;
};
onMounted(() => {
  updateGridCols();
  window.addEventListener("resize", updateGridCols);
});
</script>

<style scoped>
.customer-info-card {
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 20px;
}

.button-container {
  margin-bottom: 20px;
}

.customer-form {
  margin-top: 10px;
}

.form-label {
  font-weight: bold;
  font-size: 15px;
}
</style>
