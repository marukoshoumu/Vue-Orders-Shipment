<template>
  <AppNavbar />
  <Sidebar />
  <n-card class="list-card">
    <n-space justify="end">
      <n-button type="primary" @click="goToRegister">＋ 発送先登録</n-button>
    </n-space>

    <!-- 🔹 フィルターエリア -->
    <div class="filter-container">
      <n-select v-model:value="selectedFilter" :options="filterOptions" class="filter-item" placeholder="検索対象" />
      <n-input v-model:value="searchQuery" :placeholder="selectedFilterLabel + 'で検索'" clearable class="filter-item" />
    </div>

    <!-- 🔹 発送先一覧（カード形式） -->
    <n-grid :cols="1" x-gap="12">
      <n-gi v-for="shipping in filteredShippingList" :key="shipping.id">
        <n-card class="shipping-card">
          <div class="row">
            <span class="shipping-title">{{ shipping.receiverName }}（{{ shipping.company }}）</span>
          </div>
          <div class="row">
            <span class="shipping-address">{{ shipping.address1 }} {{ shipping.address2 }}</span>
          </div>
          <div class="row">
            <span class="shipping-phone">📞 {{ shipping.phone }}</span>
            <n-button size="small" @click="editShipping(shipping.id)">編集</n-button>
          </div>
        </n-card>
      </n-gi>
    </n-grid>

    <!-- 🔹 ページネーション -->
    <n-pagination v-model:page="currentPage" v-model:page-size="pageSize"
      :page-count="Math.ceil(totalShippingCount / pageSize)" show-size-picker :page-sizes="[5, 10, 20]"
      @update:page-size="updatePageSize" class="pagination" />
  </n-card>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import AppNavbar from "@/components/common/AppNavbar.vue";
import Sidebar from "@/components/common/Sidebar.vue";

// 📌 発送先データ（仮データ）
const shippingList = ref([
  { id: 1, company: "テスト株式会社", receiverName: "田中 太郎", address1: "東京都渋谷区", address2: "1丁目2番地3号", phone: "03-1234-5678" },
  { id: 2, company: "サンプル商店", receiverName: "佐藤 花子", address1: "大阪府大阪市", address2: "4-5-6", phone: "06-9876-5432" },
  { id: 3, company: "デモカンパニー", receiverName: "山本 次郎", address1: "福岡県福岡市", address2: "7-8-9", phone: "092-111-2222" },
]);

// 📌 フィルターデータ
const searchQuery = ref("");
const selectedFilter = ref("receiverName");
const filterOptions = [
  { label: "会社名", value: "company" },
  { label: "受取人名", value: "receiverName" },
  { label: "住所", value: "address1" },
];

const currentPage = ref(1);
const pageSize = ref(10);
const router = useRouter();

// 📌 選択された検索フィルターのラベル
const selectedFilterLabel = computed(() => {
  return filterOptions.find(option => option.value === selectedFilter.value)?.label || "検索";
});

// 📌 ページサイズ変更時の処理
const updatePageSize = (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 1;
};

// 📌 フィルタリングされたデータ
const filteredShippingList = computed(() => {
  return shippingList.value
    .filter((s) =>
      searchQuery.value === "" ||
      (s[selectedFilter.value]?.includes(searchQuery.value))
    )
    .slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value);
});

// 📌 発送先総数
const totalShippingCount = computed(() => {
  return shippingList.value.filter((s) =>
    searchQuery.value === "" ||
    (s[selectedFilter.value]?.includes(searchQuery.value))
  ).length;
});

// 📌 ページサイズの変更を監視
watch(pageSize, () => {
  currentPage.value = 1;
});

// 📌 発送先登録画面へ遷移
const goToRegister = () => {
  router.push("/shipping/create");
};

// 📌 発送先編集画面へ遷移
const editShipping = (id) => {
  router.push(`/shipping/edit/${id}`);
};
</script>

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
  gap: 10px;
  margin: 15px 0;
}

.filter-item {
  flex: 1;
}

/* 📌 発送先カード */
.shipping-card {
  padding: 10px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* 📌 行のスタイル */
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 📌 発送先名 */
.shipping-title {
  font-weight: bold;
  font-size: 18px;
  white-space: normal;
  word-break: break-word;
}

/* 📌 住所 */
.shipping-address {
  font-size: 14px;
  color: #555;
  white-space: normal;
  word-break: break-word;
}

/* 📌 電話番号 */
.shipping-phone {
  font-size: 14px;
  color: #007bff;
}

/* 📌 ページネーション */
.pagination {
  margin-top: 15px;
  text-align: center;
}
</style>
