<template>
  <n-card title="発送詳細">
    <n-tabs v-model:value="activeTab">
      <n-tab-pane v-for="date in dates" :key="date" :name="date" :tab="date">
        <n-grid cols="1" item-responsive>
          <n-gi v-for="detail in filteredDetails" :key="detail.customer">
            <n-card>
              <!-- 📌 顧客名と発送会社を横並びに配置 -->
              <div class="header">
                <strong>顧客名:</strong>
                <span class="customer-name">{{ detail.customer }}</span>
                <span class="company-tag">{{ detail.company }}</span>
              </div>

              <n-table bordered>
                <thead>
                  <tr>
                    <th>商品名</th>
                    <th>個数</th>
                    <th>メモ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in detail.items" :key="i">
                    <td class="truncate">{{ item.name }}</td>
                    <td>{{ item.count }}</td>
                    <td>{{ item.memo }}</td>
                  </tr>
                </tbody>
              </n-table>
            </n-card>
          </n-gi>
        </n-grid>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script setup>
import { ref, computed } from "vue";
import { NCard, NGrid, NGi, NTable, NTabs, NTabPane } from "naive-ui";

// 📌 日付データ
const dates = ref(["02/14", "02/15", "02/16", "02/17", "02/18"]);
// const dates = ref([
//   dayjs().subtract(1, "day").format("MM/DD"), // 昨日
//   today, // 今日
//   dayjs().add(1, "day").format("MM/DD"), // 明日
//   dayjs().add(2, "day").format("MM/DD"), // 明後日
//   dayjs().add(3, "day").format("MM/DD") // 明々後日
// ]);
const activeTab = ref(dates.value[1]);

// 📌 発送詳細データ
const shippingDetails = ref([
  {
    date: "02/15",
    company: "ヤマト",
    customer: "テストホテル",
    items: [
      { name: "青首大根", count: "5個", memo: "" },
      { name: "白玉ねぎ", count: "2個", memo: "" },
    ],
  },
  {
    date: "02/15",
    company: "佐川",
    customer: "テスト小売",
    items: [{ name: "白玉ねぎ", count: "1個", memo: "注意事項あり" }],
  },
  {
    date: "02/16",
    company: "佐川",
    customer: "テスト小売",
    items: [{ name: "大盤振る舞い白玉ねぎスペシャル", count: "1個", memo: "注意事項あり" }],
  },
]);

// 📌 選択された日付の発送詳細
const filteredDetails = computed(() => {
  return shippingDetails.value.filter((d) => d.date === activeTab.value);
});
</script>

<style scoped>
/* 📌 顧客名と発送会社を横並びにする */
.header {
  display: flex;
  align-items: center;
  font-weight: bold;
  padding: 5px 0;
}

.customer-name {
  margin-left: 5px;
}

.company-tag {
  background-color: #b0e3a4;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.9em;
  margin-left: 10px;
}

.truncate {
  max-width: 100%;
  word-break: break-word;
  white-space: normal;
}
</style>
