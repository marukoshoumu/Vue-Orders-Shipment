<template>
  <AppNavbar />
  <Sidebar />
  <n-card class="list-card">
    <n-space justify="end">
      <n-button type="primary" @click="goToRegister">＋ 顧客登録</n-button>
    </n-space>

    <!-- 🔹 フィルターエリア -->
    <div class="filter-container">
      <n-select v-model:value="selectedFilter" :options="filterOptions" class="filter-item" placeholder="検索対象" />
      <n-input v-model:value="searchQuery" :placeholder="selectedFilterLabel + 'で検索'" clearable class="filter-item" />
    </div>

    <!-- 🔹 顧客一覧（カード形式） -->
    <n-grid :cols="1" x-gap="12">
      <n-gi v-for="customer in filteredCustomers" :key="customer.id">
        <n-card class="customer-card">
          <div class="row">
            <span class="customer-title">{{ customer.company }} {{ customer.name }}</span>
          </div>
          <div class="row">
            <span class="customer-address">{{ customer.address1 }} {{ customer.address2 }}</span>
          </div>
          <div class="row">
            <span class="customer-phone">📞 {{ customer.phone }}</span>
            <n-button size="small" @click="editCustomer(customer.id)">編集</n-button>
          </div>
        </n-card>
      </n-gi>
    </n-grid>

    <!-- 🔹 ページネーション -->
    <n-pagination v-model:page="currentPage" v-model:page-size="pageSize"
      :page-count="Math.ceil(totalCustomers / pageSize)" show-size-picker :page-sizes="[5, 10, 20]"
      @update:page-size="updatePageSize" class="pagination" />
  </n-card>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import AppNavbar from "@/components/common/AppNavbar.vue";
import Sidebar from "@/components/common/Sidebar.vue";

// 📌 顧客データ（仮データ）
const customers = ref([
  { id: 1, company: "テスト株式会社", name: "田中 太郎", furigana: "タナカ タロウ", address1: "東京都渋谷区", address2: "1丁目2番地3号", phone: "03-1234-5678" },
  { id: 2, company: "サンプル商店", name: "佐藤 花子", furigana: "サトウ ハナコ", address1: "大阪府大阪市", address2: "4-5-6", phone: "06-9876-5432" },
  { id: 3, company: "デモカンパニー", name: "山本 次郎", furigana: "ヤマモト ジロウ", address1: "福岡県福岡市", address2: "7-8-9", phone: "092-111-2222" },
  { id: 4, company: "デモカンパニー", name: "山本 次郎", furigana: "ヤマモト ジロウ", address1: "福岡県福岡市", address2: "7-8-9", phone: "092-111-2222" },
  { id: 5, company: "デモカンパニー", name: "山本 次郎", furigana: "ヤマモト ジロウ", address1: "福岡県福岡市", address2: "7-8-9", phone: "092-111-2222" },
  { id: 6, company: "デモカンパニー", name: "山本 次郎", furigana: "ヤマモト ジロウ", address1: "福岡県福岡市", address2: "7-8-9", phone: "092-111-2222" },
  { id: 7, company: "デモカンパニー", name: "山本 次郎", furigana: "ヤマモト ジロウ", address1: "福岡県福岡市", address2: "7-8-9", phone: "092-111-2222" },
  { id: 8, company: "デモカンパニー", name: "山本 次郎", furigana: "ヤマモト ジロウ", address1: "福岡県福岡市", address2: "7-8-9", phone: "092-111-2222" },
  { id: 9, company: "デモカンパニー", name: "山本 次郎", furigana: "ヤマモト ジロウ", address1: "福岡県福岡市", address2: "7-8-9", phone: "092-111-2222" },
  { id: 10, company: "デモカンパニー", name: "山本 次郎", furigana: "ヤマモト ジロウ", address1: "福岡県福岡市", address2: "7-8-9", phone: "092-111-2222" },
  { id: 11, company: "デモカンパニー", name: "山本 次郎", furigana: "ヤマモト ジロウ", address1: "福岡県福岡市", address2: "7-8-9", phone: "092-111-2222" },
]);

// 📌 フィルターデータ
const searchQuery = ref("");
const selectedFilter = ref("company");
const filterOptions = [
  { label: "会社名", value: "company" },
  { label: "氏名", value: "name" },
  { label: "フリガナ", value: "furigana" },
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
  currentPage.value = 1; // ページ数をリセット
};

// 📌 フィルタリングされたデータ
const filteredCustomers = computed(() => {
  return customers.value
    .filter((c) =>
      searchQuery.value === "" ||
      (c[selectedFilter.value]?.includes(searchQuery.value))
    )
    .slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value);
});

// 📌 顧客総数
const totalCustomers = computed(() => {
  return customers.value.filter((c) =>
    searchQuery.value === "" ||
    (c[selectedFilter.value]?.includes(searchQuery.value))
  ).length;
});

// 📌 ページサイズの変更を監視
watch(pageSize, () => {
  currentPage.value = 1; // ページサイズを変更するときに最初のページに戻る
});

// 📌 顧客登録画面へ遷移
const goToRegister = () => {
  router.push("/customers/create");
};

// 📌 顧客編集画面へ遷移
const editCustomer = (id) => {
  router.push(`/customers/edit/${id}`);
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

/* 📌 顧客カード */
.customer-card {
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

/* 📌 顧客名 */
.customer-title {
  font-weight: bold;
  font-size: 18px;
  white-space: normal;
  word-break: break-word;
}

/* 📌 住所 */
.customer-address {
  font-size: 14px;
  color: #555;
  white-space: normal;
  word-break: break-word;
}

/* 📌 電話番号 */
.customer-phone {
  font-size: 14px;
  color: #007bff;
}

/* 📌 ページネーション */
.pagination {
  margin-top: 15px;
  text-align: center;
}
</style>
