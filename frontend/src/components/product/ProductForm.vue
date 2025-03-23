<template>
  <AppNavbar />
  <Sidebar />
  <n-card title="商品情報" class="form-card">
    <n-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <n-grid cols="2" x-gap="24" responsive="screen">
        <!-- 商品名 -->
        <n-gi span="2">
          <n-form-item label="商品名" path="name">
            <n-input v-model:value="form.name" placeholder="商品名を入力" clearable class="wide-input" />
          </n-form-item>
        </n-gi>

        <!-- 商品分類 -->
        <n-gi>
          <n-form-item label="商品分類" path="category">
            <n-select v-model:value="form.category" :options="categoryOptions" placeholder="分類を選択" />
          </n-form-item>
        </n-gi>

        <!-- 価格 -->
        <n-gi>
          <n-form-item label="価格 (円)" path="price">
            <n-input-number v-model:value="form.price" placeholder="価格を入力" clearable min="0" step="50"
              @update:value="calculateMargin" />
          </n-form-item>
        </n-gi>

        <!-- 商品原価 -->
        <n-gi>
          <n-form-item label="原価 (円)" path="cost">
            <n-input-number v-model:value="form.cost" placeholder="原価を入力" clearable min="0" step="50"
              @update:value="calculateMargin" />
          </n-form-item>
        </n-gi>

        <!-- 粗利 -->
        <n-gi>
          <n-form-item label="粗利 (円)" path="margin">
            <n-input-number v-model:value="form.margin" placeholder="自動計算" clearable disabled />
          </n-form-item>
        </n-gi>

        <!-- 在庫数 -->
        <n-gi>
          <n-form-item label="在庫数" path="stock">
            <n-input-number v-model:value="form.stock" placeholder="在庫数を入力" clearable min="0" step="1" />
          </n-form-item>
        </n-gi>

        <!-- 税率 -->
        <n-gi>
          <n-form-item label="税率 (%)" path="tax">
            <n-input-number v-model:value="form.tax" placeholder="税率" clearable min="0" step="1" />
          </n-form-item>
        </n-gi>

        <!-- 備考 -->
        <n-gi span="2">
          <n-form-item label="備考" path="note">
            <n-input v-model:value="form.note" placeholder="備考を入力" clearable type="textarea" />
          </n-form-item>
        </n-gi>
      </n-grid>

      <n-space justify="end" class="button-space">
        <n-button type="primary" @click="submitForm" secondary strong>{{ isEdit ? "更新" : "登録" }}</n-button>
        <n-button v-if="isEdit" type="error" @click="deleteProduct">削除</n-button>
        <n-button @click="goBack">戻る</n-button>
      </n-space>
    </n-form>
  </n-card>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from "vue";
import { useRouter } from "vue-router";
// import { useProductStore } from "@/stores/productStore";
import { useCategoryStore } from "@/stores/categoryStore";
import AppNavbar from "@/components/common/AppNavbar.vue";
import Sidebar from "@/components/common/Sidebar.vue";

const props = defineProps({
  product: Object,  // 編集時の商品データ
  isEdit: Boolean,  // true: 編集モード, false: 新規登録
});

const emit = defineEmits(["save", "delete"]);
const router = useRouter();
// const productStore = useProductStore();
const categoryStore = useCategoryStore();

const formRef = ref(null);
const form = ref({
  id: props.product?.id || null,
  name: props.product?.name || "",
  category: props.product?.category || "",
  price: props.product?.price || null,
  cost: props.product?.cost || null,  // 商品原価
  margin: computed(() => (form.value.price && form.value.cost ? form.value.price - form.value.cost : 0)),  // 粗利計算
  stock: props.product?.stock || 0,  // 在庫数
  tax: props.product?.tax || 10,  // 税率（デフォルト10%）
  note: props.product?.note || "",
});

// 商品分類の選択肢
const categoryOptions = categoryStore.categoryOptions;

// 価格と商品原価が変更されたら粗利を計算
const calculateMargin = () => {
  form.value.margin = form.value.price && form.value.cost ? form.value.price - form.value.cost : 0;
};

// バリデーションルール
const rules = {
  name: [{ required: true, message: "商品名は必須です" }],
  category: [{ required: true, message: "商品分類を選択してください" }],
  price: [{ required: true, message: "価格を入力してください" }],
  cost: [{ required: true, message: "商品原価を入力してください" }],
  stock: [{ required: true, message: "在庫数を入力してください" }],
  tax: [{ required: true, message: "税率を入力してください" }],
};

// フォーム送信
const submitForm = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      emit("save", form.value);
    }
  });
};

// 削除処理
const deleteProduct = () => {
  emit("delete", form.value.id);
};

// 戻る処理
const goBack = () => {
  router.push("/products");
};
</script>

<style scoped>
/* 📌 全体のカードデザイン */
.form-card {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 10px;
}

/* 📌 ボタンの間隔を調整 */
.button-space {
  margin-top: 20px;
}

/* 📌 商品名の入力を広くする */
.wide-input {
  width: 100%;
}
</style>
