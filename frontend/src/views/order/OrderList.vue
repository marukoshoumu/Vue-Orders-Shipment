<script setup>
import { ref, computed } from "vue";
import AppNavbar from "@/components/common/AppNavbar.vue";
import Sidebar from "@/components/common/Sidebar.vue";

// 📌 日付フォーマット関数（YYYY/MM/DD → MM/DD）
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月（0から始まるので +1）
  const day = String(date.getDate()).padStart(2, "0"); // 日
  return `${month}/${day}`;
};

// 📌 `Date` オブジェクトを `YYYY/MM/DD` 形式に変換する関数
const formatToYYYYMMDD = (date) => {
  if (!date) return null;
  const d = new Date(date); // `n-date-picker` から渡された timestamp を Date に変換
  if (isNaN(d)) return null; // 無効な日付チェック
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}/${mm}/${dd}`;
};
// 📌 受注データ（仮データ）
const orders = ref([
  {
    orderId: "o81tz6bz",
    orderDate: "2025/01/17",
    customerName: "テスト顧客",
    deliveryMethod: "ヤマト",
    shippingDate: "2025/01/20",
    deliveryDate: "2025/01/21",
    items: [
      { productName: "ホワイトアスパラガス", quantity: 2 },
      { productName: "特選スペシャルブラントおらほ米", quantity: 5 },
    ],
  },
  {
    orderId: "p9beroeb",
    orderDate: "2025/01/18",
    customerName: "テスト顧客",
    deliveryMethod: "ヤマト",
    shippingDate: "2025/01/20",
    deliveryDate: "2025/01/21",
    items: [
      { productName: "にんじん", quantity: 4 },
      { productName: "たまねぎ", quantity: 2 },
    ],
  },
  {
    orderId: "x3ftw5ny",
    orderDate: "2025/01/18",
    customerName: "テスト２",
    deliveryMethod: "佐川",
    shippingDate: "2025/01/20",
    deliveryDate: "2025/01/21",
    items: [
      { productName: "にんじん", quantity: 2 },
      { productName: "たまねぎ", quantity: 5 },
    ],
  },
]);

// 📌 フィルター用データ
const searchQuery = ref("");
const selectedDate = ref(null);
const selectedDelivery = ref("");
const currentPage = ref(1);
const pageSize = ref(5);

// 📌 納品方法オプション
const deliveryOptions = [
  { label: "すべて", value: "" },
  { label: "ヤマト", value: "ヤマト" },
  { label: "佐川", value: "佐川" },
];

// 📌 フィルタリングされたデータ
const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    const selectedFormattedDate = formatToYYYYMMDD(selectedDate.value);
    console.log(selectedFormattedDate);
    return (
      (searchQuery.value === "" || order.customerName.includes(searchQuery.value)) &&
      (selectedDate.value === null || order.orderDate === selectedFormattedDate) &&
      (selectedDelivery.value === "" || order.deliveryMethod === selectedDelivery.value)
    );
  });
});

// 📌 ページネーション対応
const paginatedOrders = computed(() => {
  return filteredOrders.value.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value);
});

// 📌 ページサイズ変更処理
const updatePageSize = (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 1;
};
</script>

<template>
  <AppNavbar />
  <Sidebar />
  <n-card class="list-card">
    <!-- 🔹 フィルターエリア -->
    <div class="filter-container">
      <n-date-picker v-model:value="selectedDate" type="date" placeholder="受注日を選択" class="filter-item date-picker" />
      <n-input v-model:value="searchQuery" placeholder="顧客名で検索" clearable class="filter-item input-box" />
      <n-select v-model:value="selectedDelivery" :options="deliveryOptions" class="filter-item select-box"
        placeholder="納品方法" />
    </div>

    <!-- 🔹 受注カード -->
    <n-grid :cols="1" x-gap="12">
      <n-gi v-for="(order, index) in paginatedOrders" :key="index">
        <n-card class="order-card">
          <!-- 1行目: 受注日 + 顧客名 -->
          <div class="row">
            <span class="order-date">📅 <strong>受注日:</strong> {{ formatDate(order.orderDate) }}</span>
            <span class="delivery-method">🚚 <strong>納品方法:</strong> {{ order.deliveryMethod }}</span>
          </div>
          <div class="row">
            <span class="customer-name">👤 <strong>{{ order.customerName }}</strong></span>
          </div>

          <!-- 2行目: 納品方法 + 発送日 + 納品日 -->
          <div class="row">
            <span class="shipping-date">📦 <strong>発:</strong> {{ formatDate(order.shippingDate) }}</span>
            <span class="delivery-date">🏠 <strong>納:</strong> {{ formatDate(order.deliveryDate) }}</span>
          </div>

          <!-- 3行目: 商品リスト -->
          <div class="product-list">
            <div v-for="item in order.items" :key="item.productName" class="product-item">
              <span class="product-name">{{ item.productName }}:</span>
              <span class="product-quantity">{{ item.quantity }}</span>
            </div>
          </div>
        </n-card>
      </n-gi>
    </n-grid>

    <!-- 🔹 ページネーション -->
    <n-pagination v-model:page="currentPage" v-model:page-size="pageSize"
      :page-count="Math.ceil(filteredOrders.length / pageSize)" show-size-picker :page-sizes="[5, 10, 20]"
      @update:page-size="updatePageSize" class="pagination" />
  </n-card>
</template>

<style scoped>
/* 📌 カードデザイン */
.list-card {
  max-width: 900px;
  margin: 10px auto;
  padding: 10px;
  background-color: #f9fafb;
  border-radius: 10px;
}

/* 📌 フィルターエリア */
.filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 15px 0;
  align-items: center;
  justify-content: space-between;
}

/* 📌 各フィルターアイテムの幅を統一 */
.filter-item {
  flex: 1;
  min-width: 120px;
}

/* 📌 日付ピッカーの幅を調整 */
.date-picker {
  min-width: 160px;
  /* 必要に応じて調整 */
}

/* 📌 入力フィールドのスタイル */
.input-box {
  min-width: 160px;
  max-width: 250px;
  text-overflow: ellipsis;
}

/* 📌 選択ボックスのスタイル */
.select-box {
  min-width: 140px;
}

/* 📌 受注カード */
.order-card {
  padding: 15px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
}

/* 📌 行のスタイル */
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  margin-bottom: 5px;
}

/* 📌 商品リスト */
.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 5px;
}

.product-item {
  background-color: #eef2ff;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
}

/* 📌 ページネーション */
.pagination {
  margin-top: 15px;
  text-align: center;
}
</style>
