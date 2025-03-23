<template>
  <n-card title="発送件数">
    <!-- 📌 テーブルを横スクロール可能にする -->
    <div class="table-container">
      <n-table bordered class="responsive-table">
        <thead>
          <tr>
            <th>発送会社</th>
            <th v-for="date in dates" :key="date" :class="{ today: date === today }">{{ date }}</th>
            <th class="total-column">合計</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="method in activeMethods" :key="method">
            <td class="method-name">{{ method }}</td>
            <td v-for="date in dates" :key="date" :class="{ today: date === today }">
              {{ shippingData[date]?.[method] || '-' }} 件
            </td>
            <td class="total-column">
              {{ getMethodTotal(method) }} 件
            </td>
          </tr>
          <!-- 日付ごとの合計行 -->
          <tr class="total-row">
            <td class="total-label">合計</td>
            <td v-for="date in dates" :key="date" :class="{ today: date === today }">
              {{ getDateTotal(date) }} 件
            </td>
            <td class="total-column">
              {{ getTotalAll() }} 件
            </td>
          </tr>
        </tbody>
      </n-table>
    </div>
  </n-card>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { NCard, NTable } from "naive-ui";
import dayjs from "dayjs";
import axios from "axios";

// 📌 今日の日付
const today = dayjs().format("MM/DD");

// 📌 過去/未来5日間のリスト
const dates = ref([
  dayjs().subtract(1, "day").format("MM/DD"), // 昨日
  today, // 今日
  dayjs().add(1, "day").format("MM/DD"), // 明日
  dayjs().add(2, "day").format("MM/DD"), // 明後日
  dayjs().add(3, "day").format("MM/DD") // 明々後日
]);

// 📌 発送会社のリスト
// const allMethods = ["ヤマト", "佐川", "西濃運輸", "配達", "店舗受取", "ヤマト産直伝票", "レターパック", "その他"];

// 📌 発送件数データ（サンプル）
const shippingData = ref({});
// const shippingData = ref({
//   "02/14": { ヤマト: 2, 佐川: 1 },
//   "02/15": { ヤマト: 3, 佐川: 2, 西濃運輸: 1 },
//   "02/16": { ヤマト: 1, 西濃運輸: 2 }
// });
// 📌 API からデータを取得する
const fetchShippingData = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/shipping");
    shippingData.value = response.data.shippingData;
  } catch (error) {
    console.error("🚨 発送データの取得に失敗しました:", error);
  }
};

// 📌 使用されている発送会社のリスト
const activeMethods = computed(() => {
  let methods = new Set();
  Object.values(shippingData.value).forEach((data) => {
    Object.keys(data).forEach((method) => methods.add(method));
  });
  return Array.from(methods);
});

// 📌 発送会社ごとの合計件数を計算
const getMethodTotal = (method) => {
  return Object.values(shippingData.value).reduce((sum, data) => sum + (data[method] || 0), 0);
};

// 📌 日付ごとの合計件数を計算
const getDateTotal = (date) => {
  return Object.values(shippingData.value[date] || {}).reduce((sum, count) => sum + count, 0);
};

// 📌 全体の合計件数
const getTotalAll = () => {
  return Object.values(shippingData.value).reduce(
    (sum, data) => sum + Object.values(data).reduce((s, c) => s + c, 0),
    0
  );
};
// 📌 コンポーネントがマウントされたら API を呼び出す
onMounted(fetchShippingData);
</script>

<style scoped>
/* 📌 テーブルの横スクロールを可能にする */
.table-container {
  overflow-x: auto;
  max-width: 100%;
}

/* 📌 レスポンシブ対応 */
.responsive-table {
  min-width: 600px;
  /* 最小幅を設定 */
  width: 100%;
}

/* 📌 今日の列を色分け */
.today {
  background-color: #b0e3a4;
  font-weight: bold;
}

/* 📌 発送会社名 */
.method-name {
  font-weight: bold;
  background-color: #f0f8ff;
  white-space: nowrap;
  /* 改行を防ぐ */
}

/* 📌 合計列 */
.total-column {
  background-color: #e0e0e0;
  font-weight: bold;
  white-space: nowrap;
  /* 改行を防ぐ */
}

/* 📌 合計行 */
.total-row {
  background-color: #e8f5e9;
  font-weight: bold;
}

/* 📌 合計ラベル */
.total-label {
  text-align: right;
  white-space: nowrap;
}
</style>
