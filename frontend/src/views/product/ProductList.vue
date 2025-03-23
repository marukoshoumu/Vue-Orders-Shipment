<script setup>
import { ref, computed, watch } from "vue";
import { NTable, NInput, NSelect, NPagination, NCard, NButton } from "naive-ui";
import { useRouter } from "vue-router";
import AppNavbar from "@/components/common/AppNavbar.vue";
import Sidebar from "@/components/common/Sidebar.vue";

const router = useRouter(); // Vue Router を取得

// 📌 商品データ（仮データ）
const products = ref([
  { id: 1, category: "野菜", name: "青首大根", price: 300 },
  { id: 2, category: "野菜", name: "五寸ニンジン", price: 250 },
  { id: 3, category: "果物", name: "りんご", price: 500 },
  { id: 4, category: "果物", name: "みかん", price: 400 },
  { id: 5, category: "特別果物スペシャル", name: "ホワイトみかんスペシャルブランド", price: 4000 },
  { id: 6, category: "果物", name: "みかん", price: 400 },
  { id: 7, category: "果物", name: "みかん", price: 400 },
  { id: 8, category: "果物", name: "みかん", price: 400 },
  { id: 9, category: "果物", name: "みかん", price: 400 },
  { id: 10, category: "果物", name: "みかん", price: 400 },
  { id: 11, category: "果物", name: "みかん", price: 400 },
]);

// 📌 商品分類リスト
const categories = ref([
  { label: "すべて", value: "" },
  { label: "野菜", value: "野菜" },
  { label: "果物", value: "果物" },
]);

// 📌 フィルタリング用データ
const searchQuery = ref("");
const selectedCategory = ref("");

// 📌 ページネーション用データ
const currentPage = ref(1);
const pageSize = ref(10); // デフォルトのページサイズ

// 📌 ページサイズ変更時の処理
const updatePageSize = (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 1; // ページ数をリセット
};

// 📌 フィルタリングされたデータ
const filteredProducts = computed(() => {
  return products.value
    .filter(
      (p) =>
        (selectedCategory.value === "" || p.category === selectedCategory.value) &&
        (searchQuery.value === "" || p.name.includes(searchQuery.value))
    )
    .slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value);
});

// 📌 商品総数（フィルタ後）
const totalProducts = computed(() => {
  return products.value.filter(
    (p) =>
      (selectedCategory.value === "" || p.category === selectedCategory.value) &&
      (searchQuery.value === "" || p.name.includes(searchQuery.value))
  ).length;
});

// 📌 ページサイズの変更を監視
watch(pageSize, () => {
  currentPage.value = 1; // ページサイズを変更するときに最初のページに戻る
});

// 📌 商品登録ページへ遷移
const goToCreatePage = () => {
  router.push("/products/create");
};

// 📌 商品編集ページへ遷移（ID付き）
const goToEditPage = (id) => {
  router.push(`/products/edit/${id}`);
};
</script>

<template>
  <AppNavbar />
  <Sidebar />
  <n-card>
    <n-space justify="end">
      <!-- 🔹 商品登録ボタン -->
      <n-button type="primary" @click="goToCreatePage" class="create-btn">+ 商品登録</n-button>
    </n-space>

    <!-- フィルター -->
    <div class="filter-container">
      <n-input v-model:value="searchQuery" placeholder="商品名を検索" clearable class="filter-item" />
      <n-select v-model:value="selectedCategory" :options="categories" class="filter-item" />
    </div>

    <!-- 商品一覧テーブル -->
    <n-table class="product-table" striped bordered>
      <thead>
        <tr>
          <th class="category-column">商品分類</th>
          <th class="name-column">商品名</th>
          <th class="price-column">価格</th>
          <th class="action-column">操作</th> <!-- 🔹 編集ボタン用の列 -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in filteredProducts" :key="product.id">
          <td>{{ product.category }}</td>
          <td class="product-name">{{ product.name }}</td>
          <td>{{ product.price }}</td>
          <td>
            <n-button type="warning" @click="goToEditPage(product.id)" size="small">編集</n-button>
          </td>
        </tr>
      </tbody>
    </n-table>

    <!-- ページネーション -->
    <n-pagination v-model:page="currentPage" v-model:page-size="pageSize"
      :page-count="Math.ceil(totalProducts / pageSize)" show-size-picker :page-sizes="[5, 10, 20]"
      @update:page-size="updatePageSize" class="pagination" />
  </n-card>
</template>

<style scoped>
/* 📌 商品一覧のテーブルデザイン */
.product-table {
  table-layout: fixed;
  /* 列幅を固定 */
  width: 100%;
}

/* 📌 商品名の列 */
.name-column {
  width: 40%;
  /* 商品名の列を適切に広げる */
}

/* 📌 商品名のスタイル */
.product-name {
  word-wrap: break-word;
  /* 長い商品名を折り返す */
  white-space: normal;
  /* 折り返しを可能にする */
  overflow-wrap: break-word;
  /* 英単語なども適切に折り返す */
}

/* 📌 商品分類の列 */
.category-column {
  width: 20%;
}

/* 📌 価格の列 */
.price-column {
  width: 15%;
  text-align: center;
}

/* 📌 操作ボタンの列 */
.action-column {
  width: 15%;
  text-align: center;
}

.filter-container {
  display: flex;
  gap: 10px;
  margin: 15px 0 20px;
}

.filter-item {
  flex: 1;
}


/* 📌 ページネーション */
.pagination {
  margin-top: 15px;
  text-align: center;
}
</style>
