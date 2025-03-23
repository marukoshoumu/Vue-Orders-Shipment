<template>
  <n-card title="発送先情報" class="info-card" bordered size="large">
    <!-- 🔹 ボタンエリア -->
    <n-grid :cols="gridCols" :x-gap="10" :y-gap="10" class="button-container">
      <n-gi v-for="(button, index) in buttons" :key="index">
        <CustomButton :label="button.label" :icon="button.icon" :buttonClass="button.class" :onClick="button.action" />
      </n-gi>
    </n-grid>

    <!-- 🔹 発送先情報フォーム -->
    <n-form label-width="120px">
      <n-space vertical size="large">
        <n-form-item label="発送先名">
          <n-input v-model:value="shippingTo.name" bordered readonly placeholder="発送先名を選択" />
        </n-form-item>
        <n-form-item label="郵便番号">
          <n-input v-model:value="shippingTo.zipcode" bordered readonly placeholder="郵便番号" />
        </n-form-item>
        <n-form-item label="住所">
          <n-input v-model:value="shippingTo.address" bordered readonly placeholder="住所" />
        </n-form-item>
        <n-form-item label="電話番号">
          <n-input v-model:value="shippingTo.phone" bordered readonly placeholder="電話番号" />
        </n-form-item>
      </n-space>
    </n-form>

    <!-- 🔹 モーダル -->
    <ShippingToRegisterModal v-model:show="showRegisterModal" @registered="updateShippingTo" />
    <ShippingToSearchModal v-model:show="showSearchModal" @selected="updateShippingTo" />
  </n-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { mdiAccountPlus, mdiMagnify } from "@mdi/js";
import CustomButton from "@/components/common/CustomButton.vue";
import ShippingToRegisterModal from "@/components/shipping/ShippingToRegisterModal.vue";
import ShippingToSearchModal from "@/components/shipping/ShippingToSearchModal.vue";

const emit = defineEmits(["updateShippingTo"]);
const showRegisterModal = ref(false);
const showSearchModal = ref(false);

const shippingTo = ref({ name: "", zipcode: "", address: "", phone: "" });

// **発送先情報を更新**
const updateShippingTo = (data) => {
  shippingTo.value = data;
  emit("updateShippingTo", data);
};

// **ボタン情報**
const buttons = [
  { label: "新規登録", icon: mdiAccountPlus, class: "btn-register", action: () => (showRegisterModal.value = true) },
  { label: "発送先検索", icon: mdiMagnify, class: "btn-search", action: () => (showSearchModal.value = true) },
];

// **レスポンシブ対応**
const gridCols = ref(2);
const updateGridCols = () => {
  const width = window.innerWidth;
  gridCols.value = width < 600 ? 1 : 2;
};
onMounted(() => {
  updateGridCols();
  window.addEventListener("resize", updateGridCols);
});
</script>

<style scoped>
.info-card {
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 20px;
}

.button-container {
  margin-bottom: 20px;
}

.form-label {
  font-weight: bold;
  font-size: 15px;
}
</style>
