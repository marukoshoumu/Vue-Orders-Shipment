<template>
  <n-card title="発送情報" class="shipping-info-card">
    <n-form label-width="120px" class="shipping-info-form">

      <!-- 品名 -->
      <n-form-item label="品名">
        <n-input v-model:value="shippingData.itemName" placeholder="品名を入力" />
      </n-form-item>

      <!-- 送状種別 & クール区分 -->
      <n-grid :cols="2" x-gap="10">
        <n-gi>
          <n-form-item label="送状種別">
            <n-select v-model:value="shippingData.invoiceType" :options="filteredInvoiceOptions"
              placeholder="送状種別を選択" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="クール区分">
            <n-select v-model:value="shippingData.coolType" :options="filteredCoolOptions" placeholder="クール区分を選択" />
          </n-form-item>
        </n-gi>
      </n-grid>

      <!-- 荷扱い -->
      <n-grid :cols="2" x-gap="10">
        <n-gi>
          <n-form-item label="荷扱い1">
            <n-select v-model:value="shippingData.handling1" :options="filteredHandlingOptions" placeholder="荷扱い1を選択" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="荷扱い2">
            <n-select v-model:value="shippingData.handling2" :options="filteredHandlingOptions" placeholder="荷扱い2を選択" />
          </n-form-item>
        </n-gi>
      </n-grid>

      <!-- 代引き情報 -->
      <n-grid :cols="2" x-gap="10">
        <n-gi>
          <n-form-item label="代引総額">
            <n-input-number v-model:value="shippingData.codTotal" :min="0" placeholder="0" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="代引内税">
            <n-input-number v-model:value="shippingData.codTax" :min="0" placeholder="0" />
          </n-form-item>
        </n-gi>
      </n-grid>

      <!-- 発行枚数 -->
      <n-form-item label="発行枚数">
        <n-input-number v-model:value="shippingData.issueCount" :min="1" placeholder="1" />
      </n-form-item>

      <!-- 送り状備考 -->
      <n-form-item label="送り状 備考欄">
        <n-input v-model:value="shippingData.invoiceNotes" type="textarea" placeholder="送り状の備考を入力" />
      </n-form-item>

      <!-- 納品書備考 -->
      <n-form-item label="納品書 備考欄">
        <n-input v-model:value="shippingData.deliveryNotes" type="textarea" placeholder="納品書の備考を入力" />
      </n-form-item>

      <!-- メモ -->
      <n-form-item label="メモ">
        <n-input v-model:value="shippingData.memo" type="textarea" placeholder="メモを入力" />
      </n-form-item>

    </n-form>
  </n-card>
</template>

<script setup>
import { ref, computed, watch, defineProps } from "vue";

// **親コンポーネントから納品方法を受け取る**
const props = defineProps({
  selectedDeliveryMethod: String
});

// **発送情報データ**
const shippingData = ref({
  itemName: "",
  invoiceType: "",
  coolType: "",
  handling1: "",
  handling2: "",
  codTotal: null,
  codTax: null,
  issueCount: 1,
  invoiceNotes: "",
  deliveryNotes: "",
  memo: "",
});

// **送状種別テーブル**
const allInvoiceOptions = [
  { method: "ヤマト", label: "発払い", value: "0:発払い" },
  { method: "ヤマト", label: "コレクト", value: "2:コレクト" },
  { method: "ヤマト", label: "着払い", value: "5:着払い" },
  { method: "佐川", label: "元払", value: "1:元払" },
  { method: "佐川", label: "着払", value: "2:着払" },
];

// **クール区分テーブル**
const allCoolOptions = [
  { method: "ヤマト", label: "通常", value: "0:通常" },
  { method: "ヤマト", label: "冷凍", value: "1:冷凍" },
  { method: "ヤマト", label: "冷蔵", value: "2:冷蔵" },
  { method: "佐川", label: "通常", value: "001:通常" },
  { method: "佐川", label: "クール便", value: "002:クール便" },
];

// **荷扱いテーブル**
const allHandlingOptions = [
  { method: "ヤマト", label: "ワレ物注意", value: "ワレ物注意" },
  { method: "ヤマト", label: "下積厳禁", value: "下積厳禁" },
  { method: "ヤマト", label: "天地無用", value: "天地無用" },
  { method: "ヤマト", label: "ナマモノ", value: "ナマモノ" },
  { method: "ヤマト", label: "水漏厳禁", value: "水漏厳禁" },
  { method: "佐川", label: "取扱注意", value: "011:取扱注意" },
  { method: "佐川", label: "貴重品", value: "012:貴重品" },
  { method: "佐川", label: "天地無用", value: "013:天地無用" },
];

// **納品方法に応じた送状種別・クール区分・荷扱いのフィルタリング**
const filteredInvoiceOptions = computed(() => {
  if (!props.selectedDeliveryMethod) return [];
  return allInvoiceOptions
    .filter(option => option.method === props.selectedDeliveryMethod)
    .map(option => ({ label: option.label, value: option.value }));
});

const filteredCoolOptions = computed(() => {
  if (!props.selectedDeliveryMethod) return [];
  return allCoolOptions
    .filter(option => option.method === props.selectedDeliveryMethod)
    .map(option => ({ label: option.label, value: option.value }));
});
const filteredHandlingOptions = computed(() => {
  if (!props.selectedDeliveryMethod) return [];
  return allHandlingOptions
    .filter(option => option.method === props.selectedDeliveryMethod)
    .map(option => ({ label: option.label, value: option.value }));
});
// 納品方法が変更されたらクール区分をリセット
watch(() => props.selectedDeliveryMethod, (newValue) => {
  if (!newValue) return;
  shippingData.value.coolType = "";
  shippingData.value.handling1 = "";
  shippingData.value.handling2 = "";
});
</script>

<style scoped>
.shipping-info-card {
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 20px;
}

/* スマホ対応 */
@media (max-width: 768px) {
  .shipping-info-form {
    display: flex;
    flex-direction: column;
  }

  .n-form-item {
    width: 100%;
  }
}
</style>
