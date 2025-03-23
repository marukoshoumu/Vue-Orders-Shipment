<template>
  <n-card title="発送元情報" class="info-card" bordered size="large">
    <!-- ボタンエリア -->
    <n-grid :cols="gridCols" :x-gap="10" :y-gap="10" class="button-container">
      <n-gi v-for="(button, index) in buttons" :key="index">
        <CustomButton :label="button.label" :icon="button.icon" :buttonClass="button.class" :onClick="button.action" />
      </n-gi>
    </n-grid>

    <!-- フォームエリア -->
    <n-form label-width="100px" class="shipping-form">
      <n-form-item label="発送元名">
        <n-input v-model:value="shippingFromData.name" placeholder="発送元名" readonly />
      </n-form-item>
      <n-form-item label="郵便番号">
        <n-input v-model:value="shippingFromData.zipcode" placeholder="郵便番号" readonly />
      </n-form-item>
      <n-form-item label="住所">
        <n-input v-model:value="shippingFromData.address" placeholder="住所" readonly />
      </n-form-item>
      <n-form-item label="電話番号">
        <n-input v-model:value="shippingFromData.phone" placeholder="電話番号" readonly />
      </n-form-item>
    </n-form>
  </n-card>
</template>

<script setup>
import { ref, defineProps, computed, onMounted, onUnmounted } from "vue";
import { mdiContentCopy, mdiMagnify } from "@mdi/js";
import axios from "axios";
import CustomButton from "@/components/common/CustomButton.vue";

const props = defineProps({
  customerData: Object,
  shippingToData: Object,
});

// **発送元情報のデータ**
const shippingFromData = ref({
  name: "",
  zipcode: "",
  address: "",
  phone: "",
});

// **会社名ボタンが押下されたときの処理**
const setCompanyInfo = async () => {
  try {
    const response = await axios.get("/api/company"); // 1件の会社情報を取得
    if (response.data) {
      shippingFromData.value = {
        name: response.data.name,
        zipcode: response.data.zipcode,
        address: response.data.address,
        phone: response.data.phone,
      };
    } else {
      alert("会社情報が登録されていません。");
    }
  } catch (error) {
    console.error("会社情報の取得に失敗しました:", error);
    alert("会社情報の取得に失敗しました。サーバーを確認してください。");
  }
};

// **顧客コピー**
const copyFromCustomer = () => {
  if (props.customerData && props.customerData.name) {
    shippingFromData.value = { ...props.customerData };
  } else {
    alert("顧客情報が設定されていません。");
  }
};

// **発送先コピー**
const copyFromShippingTo = () => {
  if (props.shippingToData && props.shippingToData.name) {
    shippingFromData.value = { ...props.shippingToData };
  } else {
    alert("発送先情報が設定されていません。");
  }
};

// **ボタン情報**
const buttons = computed(() => [
  { label: "会社名", icon: mdiMagnify, class: "btn-search", action: setCompanyInfo },
  { label: "顧客コピー", icon: mdiContentCopy, class: "btn-copy", action: copyFromCustomer },
  { label: "発送先コピー", icon: mdiContentCopy, class: "btn-copy", action: copyFromShippingTo },
]);

// **レスポンシブ対応**
const gridCols = ref(3); // 初期値（PC用）

const updateGridCols = () => {
  gridCols.value = window.innerWidth < 768 ? 1 : 3; // 幅が 768px 未満なら 1列、それ以上なら 3列
};

// **画面サイズ変更時に列数を変更**
onMounted(() => {
  updateGridCols();
  window.addEventListener("resize", updateGridCols);
});
onUnmounted(() => {
  window.removeEventListener("resize", updateGridCols);
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
