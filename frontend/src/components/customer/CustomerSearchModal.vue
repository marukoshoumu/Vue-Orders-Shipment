<template>
  <n-modal v-model:show="show" :mask-closable="false" preset="card" title="顧客検索">
    <n-form label-width="100px">
      <!-- 🔹 顧客検索 -->
      <n-grid :cols="2" x-gap="10">
        <n-gi>
          <n-form-item label="顧客">
            <n-select v-model:value="searchFilter" :options="searchOptions" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="顧客分類">
            <n-select v-model:value="selectedCategory" :options="categoryOptions" />
          </n-form-item>
        </n-gi>
      </n-grid>

      <!-- 🔹 キーワード検索 -->
      <n-form-item label="キーワード">
        <n-input v-model:value="searchQuery" placeholder="キーワードを入力" clearable />
      </n-form-item>

      <n-space justify="end">
        <n-button @click="close">キャンセル</n-button>
        <n-button type="primary" @click="searchCustomers">検索</n-button>
      </n-space>
    </n-form>

    <!-- 🔹 検索結果 -->
    <n-table v-if="customers.length" striped bordered class="result-table">
      <thead>
        <tr>
          <th>選択</th>
          <th>会社名</th>
          <th>氏名</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(customer, index) in customers" :key="index">
          <td>
            <n-button size="small" @click="selectCustomer(customer)">選択</n-button>
          </td>
          <td>{{ customer.company }}</td>
          <td>{{ customer.name }}</td>
        </tr>
      </tbody>
    </n-table>

    <n-alert v-if="!customers.length && searched" type="warning">
      該当する顧客が見つかりませんでした。
    </n-alert>
  </n-modal>
</template>

<script setup>
import { ref, defineModel, defineEmits } from "vue";
import axios from "axios";

// 親コンポーネントから制御可能なモーダル表示状態
const show = defineModel("show");

const emit = defineEmits(["close", "select"]);

const searchFilter = ref("1"); // デフォルト: 会社名
const selectedCategory = ref("");
const searchQuery = ref("");
const customers = ref([]);
const searched = ref(false);

// 顧客検索オプション
const searchOptions = [
  { label: "会社名", value: "1" },
  { label: "氏名", value: "2" },
  { label: "表示名", value: "3" },
  { label: "フリガナ", value: "4" },
];

// 顧客分類オプション
const categoryOptions = [
  { label: "すべて", value: "" },
  { label: "一次卸し・大口", value: "1" },
  { label: "小売店", value: "2" },
  { label: "飲食店・ホテル", value: "3" },
  { label: "地元飲食店", value: "4" },
  { label: "通信販売", value: "5" },
  { label: "一般販売", value: "6" },
  { label: "その他", value: "7" },
  { label: "職域", value: "8" },
];

// **顧客検索APIの呼び出し**
const searchCustomers = async () => {
  searched.value = true;
  try {
    const response = await axios.get("/api/customers", {
      params: {
        filter: searchFilter.value,
        category: selectedCategory.value,
        keyword: searchQuery.value,
      },
    });
    customers.value = response.data;
  } catch (error) {
    console.error("顧客検索エラー:", error);
    customers.value = [];
  }
};

// **顧客を選択**
const selectCustomer = (customer) => {
  emit("select", customer);
  close();
};

// **モーダルを閉じる**
const close = () => {
  show.value = false;
  emit("close");
};
</script>

<style scoped>
.result-table {
  margin-top: 15px;
}
</style>
