<template>
  <n-card title="受注基本情報" class="order-basic-card">
    <n-form label-width="120px" class="order-basic-form">
      <!-- 発送日・納品日 -->
      <n-grid :cols="2" x-gap="10">
        <n-gi>
          <n-form-item label="発送日">
            <n-date-picker v-model:value="orderData.shippingDate" type="date" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="納品日">
            <n-date-picker v-model:value="orderData.deliveryDate" type="date" />
          </n-form-item>
        </n-gi>
      </n-grid>

      <!-- 受取方法 -->
      <n-form-item label="受取方法">
        <n-select v-model:value="orderData.receiptMethod" :options="receiptOptions" placeholder="受取方法を選択" />
      </n-form-item>

      <!-- 受付者 -->
      <n-form-item label="受付者">
        <n-select v-model:value="orderData.receptionist" :options="receptionistOptions" placeholder="受付者を選択" />
      </n-form-item>

      <!-- 納品方法 -->
      <n-grid :cols="2" x-gap="10">
        <n-gi>
          <n-form-item label="納品方法">
            <n-select v-model:value="orderData.deliveryMethod" :options="deliveryOptions"
              @update:value="updateDeliveryMethod" placeholder="納品方法を選択" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="配送時間帯">
            <n-select v-model:value="orderData.deliveryTime" :options="filteredDeliveryTimeOptions"
              placeholder="配送時間帯を選択" />
          </n-form-item>
        </n-gi>
      </n-grid>

      <!-- 添付書類 -->
      <n-space>
        <n-checkbox v-model:checked="orderData.attachInvoice">納品書</n-checkbox>
        <n-checkbox v-model:checked="orderData.attachBill">請求書</n-checkbox>
        <n-checkbox v-model:checked="orderData.attachReceipt">領収書</n-checkbox>
        <n-checkbox v-model:checked="orderData.attachPamphlet">パンフ</n-checkbox>
        <n-checkbox v-model:checked="orderData.attachRecipe">レシピ</n-checkbox>
      </n-space>

      <!-- その他添付 -->
      <n-form-item label="その他添付">
        <n-input v-model:value="orderData.attachOther" placeholder="その他の添付書類を入力" />
      </n-form-item>
    </n-form>
  </n-card>
</template>

<script setup>
import { ref, computed, defineEmits } from "vue";

const emit = defineEmits(["updateDeliveryMethod"]);

const orderData = ref({
  shippingDate: null,
  deliveryDate: null,
  receiptMethod: "",
  receptionist: "",
  deliveryMethod: "",
  deliveryTime: "",
  attachInvoice: false,
  attachBill: false,
  attachReceipt: false,
  attachPamphlet: false,
  attachRecipe: false,
  attachOther: "",
});
// 受取方法（ダミーデータ）
const receiptOptions = [
  { label: "メール", value: "1" },
  { label: "電話", value: "2" },
  { label: "ＦＡＸ", value: "3" },
  { label: "makeshop", value: "4" },
  { label: "ふるさと納税", value: "5" },
  { label: "その他", value: "6" },
  { label: "食べチョク", value: "7" },
];

// 受付者（ダミーデータ）
const receptionistOptions = [
  { label: "サンプル", value: "T001" },
];

// ダミーデータ
const deliveryOptions = [
  { label: "ヤマト", value: "ヤマト" },
  { label: "佐川", value: "佐川" },
  { label: "西濃運輸", value: "西濃運輸" },
  { label: "配達", value: "配達" },
  { label: "店舗受取", value: "店舗受取" },
  { label: "ヤマト産直伝票", value: "ヤマト産直伝票" },
  { label: "レターパック", value: "レターパック" },
  { label: "その他", value: "その他" },
];

// 配送時間（ダミーデータ）
const deliveryTimeOptions = [
  { method: "ヤマト", label: "指定なし", value: "none" },
  { method: "ヤマト", label: "午前中", value: "0812" },
  { method: "ヤマト", label: "14～16時", value: "1416" },
  { method: "ヤマト", label: "16～18時", value: "1618" },
  { method: "ヤマト", label: "18～20時", value: "1820" },
  { method: "ヤマト", label: "19～21時", value: "1921" },
  { method: "佐川", label: "指定なし", value: "none" },
  { method: "佐川", label: "午前中", value: "01" },
  { method: "佐川", label: "12:00～14:00", value: "12" },
  { method: "佐川", label: "14:00～16:00", value: "14" },
  { method: "佐川", label: "16:00～18:00", value: "16" },
  { method: "佐川", label: "18:00～21:00", value: "04" },
];

// 納品方法に応じた配送時間をフィルタリング
const filteredDeliveryTimeOptions = computed(() => {
  return deliveryTimeOptions.filter(option => option.method === orderData.value.deliveryMethod)
    .map(option => ({ label: option.label, value: option.value }));
});
// **納品方法が変更されたときに `ShippinInfoArea.vue` へ通知**
const updateDeliveryMethod = () => {
  emit("updateDeliveryMethod", orderData.value.deliveryMethod);
};
</script>

<style scoped>
.order-basic-card {
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 20px;
}

.n-space {
  margin-top: 10px;
}
</style>
