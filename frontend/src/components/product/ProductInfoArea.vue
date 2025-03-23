<template>
  <n-card title="商品情報" class="product-info-card">
    <!-- PC用（デスクトップ）表示 -->
    <div class="table-container desktop-only">
      <n-table striped bordered class="product-table">
        <thead>
          <tr>
            <th style="width: 35%;">商品分類</th>
            <th style="width: 35%;">商品名</th>
            <th style="width: 15%;">価格</th>
            <th style="width: 10%;">個数</th>
            <th style="width: 5%;">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in products" :key="index" class="product-row">
            <!-- 商品分類 -->
            <td>
              <n-select v-model:value="product.category" :options="categoryOptions"
                @update:value="filterProducts(index)" placeholder="分類" size="small" style="width: 100%;" />
            </td>
            <!-- 商品名 -->
            <td>
              <n-select v-model:value="product.name" :options="filteredProductOptions(product.category)"
                @update:value="updatePrice(index)" placeholder="商品" size="small" style="width: 100%;" />
            </td>
            <!-- 価格 -->
            <td>
              <n-input-number v-model:value="product.price" :show-button="false" :min="0" size="small"
                @update:value="(val) => validateNumericInput(val, 'price', index)" placeholder="価格"
                style="width: 100%;" />
            </td>
            <!-- 個数 -->
            <td>
              <n-input-number v-model:value="product.quantity" :show-button="false" :min="1" size="small"
                style="width: 100%;" @update:value="(val) => validateNumericInput(val, 'quantity', index)" />
            </td>
            <!-- 削除ボタン -->
            <td>
              <n-button type="error" size="small" @click="removeProductRow(index)">
                ー
              </n-button>
            </td>
          </tr>
        </tbody>
      </n-table>
    </div>

    <!-- スマホ用（モバイル）表示 -->
    <div class="mobile-only">
      <div v-for="(product, index) in products" :key="index" class="product-card">
        <n-form-item label="商品分類">
          <n-select v-model:value="product.category" :options="categoryOptions" @update:value="filterProducts(index)"
            placeholder="分類" size="small" />
        </n-form-item>
        <n-form-item label="商品名">
          <n-select v-model:value="product.name" :options="filteredProductOptions(product.category)"
            @update:value="updatePrice(index)" placeholder="商品" size="small" />
        </n-form-item>
        <n-form-item label="価格">
          <n-input-number v-model:value="product.price" :min="0" size="small" @update:value="validatePrice(index)"
            placeholder="価格" style="min-width: 80px; width: 100%;" />
        </n-form-item>
        <n-form-item label="個数">
          <n-input-number v-model:value="product.quantity" :min="1" size="small" />
        </n-form-item>
        <n-button type="error" size="small" @click="removeProductRow(index)">
          削除
        </n-button>
      </div>
    </div>
    <!-- 合計値表示 -->
    <div class="total-summary">
      <p>合計価格: <strong>{{ totalPrice.toLocaleString() }}</strong> 円</p>
      <p>合計個数: <strong>{{ totalQuantity }}</strong> 個</p>
    </div>

    <n-space justify="center">
      <n-button type="success" size="small" @click="addProductRow" :disabled="products.length >= 10">
        商品追加
      </n-button>
    </n-space>
  </n-card>
</template>

<script setup>
import { ref, computed } from "vue";

// 商品データ
const products = ref([{ category: "", name: "", price: 0, quantity: 1 }]);

// 商品分類（ダミーデータ）
const categoryOptions = [
  { label: "だいこん", value: "だいこん" },
  { label: "にんじん", value: "にんじん" },
  { label: "たまねぎ", value: "たまねぎ" },
  { label: "送料", value: "送料" },
];

// 商品リスト（ダミーデータ）
const allProducts = [
  { category: "だいこん", name: "青首大根", price: 300 },
  { category: "だいこん", name: "桜島大根", price: 400 },
  { category: "にんじん", name: "五寸ニンジン", price: 200 },
  { category: "にんじん", name: "ミニキャロット", price: 300 },
  { category: "たまねぎ", name: "白玉ねぎ", price: 500 },
  { category: "たまねぎ", name: "サラダ玉ねぎ", price: 700 },
  { category: "送料", name: "送料", price: 1050 },
];

// 商品フィルタリング
const filteredProductOptions = (category) => {
  return category
    ? allProducts.filter(p => p.category === category).map(p => ({ label: p.name, value: p.name }))
    : [];
};

// 商品分類が選択されたときに商品をリセット
const filterProducts = (index) => {
  if (!products.value[index].category) {
    products.value[index].name = "";
    products.value[index].price = 0;
  }
};

// 商品名が選択されたときに価格を自動入力
const updatePrice = (index) => {
  const selectedProduct = allProducts.find(p => p.name === products.value[index].name);
  products.value[index].price = selectedProduct ? selectedProduct.price : 0;
};

// 商品行の追加
const addProductRow = () => {
  if (products.value.length < 10) {
    products.value.push({ category: "", name: "", price: 0, quantity: 1 });
  }
};

// 商品行の削除（1行のみの場合は初期化）
const removeProductRow = (index) => {
  if (products.value.length === 1) {
    products.value[0] = { category: "", name: "", price: 0, quantity: 1 };
  } else {
    products.value.splice(index, 1);
  }
};

// 合計価格の計算
const totalPrice = computed(() => {
  return products.value.reduce((sum, product) => sum + (product.price * product.quantity), 0);
});

// 合計個数の計算
const totalQuantity = computed(() => {
  return products.value.reduce((sum, product) => sum + product.quantity, 0);
});
// ** 半角数字のみ許可するバリデーション関数 **
const validateNumericInput = (val, field, index) => {
  if (val === null || val === undefined) {
    products.value[index][field] = 0;
  }
  // 半角数字以外を削除
  const numericVal = String(val).replace(/[^\d]/g, '');

  // 数値として変換しセット
  products.value[index][field] = numericVal !== "" ? Number(numericVal) : 0;
};
</script>

<style scoped>
/* カード全体のスタイル */
.product-info-card {
  max-width: 100%;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 20px;
}

/* テーブルのスタイル */
.table-container {
  overflow-x: auto;
  width: 100%;
}

/* PC用のテーブル表示 */
.desktop-only {
  display: table;
}

/* モバイル用のカード表示 */
.mobile-only {
  display: none;
}

/* モバイル用のレイアウト */
@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: block;
  }

  .product-card {
    border: 1px solid #ddd;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    background: #fff;
  }
}

/* 合計表示 */
.total-summary {
  margin-top: 15px;
  margin-bottom: 20px;
  padding: 10px;
  text-align: right;
  font-size: 16px;
  font-weight: bold;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>
