<template>
  <n-modal v-model:show="isOpen" :mask-closable="false" preset="card" title="発送先検索">
    <n-form label-width="100px">
      <!-- 🔹 発送先検索 -->
      <n-grid :cols="2" x-gap="10">
        <n-gi>
          <n-form-item label="発送先">
            <n-select v-model:value="searchFilter" :options="searchOptions" />
          </n-form-item>
        </n-gi>
      </n-grid>

      <!-- 🔹 キーワード検索 -->
      <n-form-item label="キーワード">
        <n-input v-model:value="searchQuery" placeholder="キーワードを入力" clearable />
      </n-form-item>

      <n-space justify="end">
        <n-button @click="close">キャンセル</n-button>
        <n-button type="primary" @click="searchShippingTo">検索</n-button>
      </n-space>
    </n-form>

    <!-- 🔹 検索結果 -->
    <n-table v-if="results.length" striped bordered class="result-table">
      <thead>
        <tr>
          <th>選択</th>
          <th>会社名</th>
          <th>氏名</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(shippingTo, index) in results" :key="index">
          <td>
            <n-button size="small" @click="selectShippingTo(shippingTo)">選択</n-button>
          </td>
          <td>{{ shippingTo.company }}</td>
          <td>{{ shippingTo.name }}</td>
        </tr>
      </tbody>
    </n-table>

    <n-alert v-if="!results.length && searched" type="warning">
      該当する発送先が見つかりませんでした。
    </n-alert>
  </n-modal>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import axios from "axios";

const emit = defineEmits(["close", "select"]);
const isOpen = ref(true);
const searchFilter = ref("1"); // デフォルト: 会社名
const searchQuery = ref("");
const results = ref([]);
const searched = ref(false);

// 発送先検索オプション
const searchOptions = [
  { label: "会社名", value: "1" },
  { label: "氏名", value: "2" },
];

// **発送先検索APIの呼び出し**
const searchShippingTo = async () => {
  searched.value = true;
  try {
    const response = await axios.get("/api/shipping-to", {
      params: {
        filter: searchFilter.value,
        keyword: searchQuery.value,
      },
    });
    results.value = response.data;
  } catch (error) {
    console.error("発送先検索エラー:", error);
    results.value = [];
  }
};

// **発送先を選択**
const selectShippingTo = (shippingTo) => {
  emit("select", shippingTo);
  close();
};

// **モーダルを閉じる**
const close = () => {
  emit("close");
};
</script>

<style scoped>
.result-table {
  margin-top: 15px;
}
</style>
