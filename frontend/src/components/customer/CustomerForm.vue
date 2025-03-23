<template>
  <AppNavbar />
  <Sidebar />

  <n-card class="form-card">
    <n-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <!-- 🔹 顧客分類 -->
      <n-form-item label="顧客分類" path="category">
        <n-select v-model:value="form.category" :options="categoryOptions" placeholder="分類を選択" />
      </n-form-item>

      <!-- 🔹 会社名・氏名 -->
      <n-form-item label="会社名" path="company">
        <n-input v-model:value="form.company" placeholder="会社名を入力" />
      </n-form-item>
      <n-form-item label="氏名" path="name">
        <n-input v-model:value="form.name" placeholder="氏名を入力" />
      </n-form-item>

      <!-- 🔹 フリガナ -->
      <n-form-item label="フリガナ" path="furigana">
        <n-input v-model:value="form.furigana" placeholder="フリガナを入力" />
      </n-form-item>

      <!-- 🔹 部署・役職 -->
      <n-grid :cols="2" x-gap="10">
        <n-gi>
          <n-form-item label="部署" path="department">
            <n-input v-model:value="form.department" placeholder="部署を入力" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="役職" path="position">
            <n-input v-model:value="form.position" placeholder="役職を入力" />
          </n-form-item>
        </n-gi>
      </n-grid>

      <!-- 🔹 郵便番号 + 住所自動入力 -->
      <n-form-item label="郵便番号" path="zipcode">
        <n-input v-model:value="form.zipcode" placeholder="例: 1000001" clearable @input="validateZipcode"
          @blur="fetchAddressFromZipcode" />
      </n-form-item>
      <n-form-item label="住所1" path="address1">
        <n-input v-model:value="form.address1" placeholder="都道府県・市区町村" disabled />
      </n-form-item>
      <n-form-item label="住所2" path="address2">
        <n-input v-model:value="form.address2" placeholder="番地・建物名など" />
      </n-form-item>

      <!-- 🔹 連絡先 -->
      <n-form-item label="電話番号" path="phone">
        <n-input v-model:value="form.phone" placeholder="例: 0312345678" clearable @input="validatePhone('phone')" />
      </n-form-item>
      <n-form-item label="携帯電話" path="mobile">
        <n-input v-model:value="form.mobile" placeholder="例: 09012345678" clearable @input="validatePhone('mobile')" />
      </n-form-item>
      <n-form-item label="FAX" path="fax">
        <n-input v-model:value="form.fax" placeholder="例: 0312345678" clearable @input="validatePhone('fax')" />
      </n-form-item>

      <!-- 🔹 メールアドレス -->
      <n-form-item label="メールアドレス" path="email">
        <n-input v-model:value="form.email" placeholder="メールアドレスを入力" clearable />
      </n-form-item>

      <!-- 🔹 請求書有無・入金期日 -->
      <n-grid :cols="2" x-gap="10">
        <n-gi>
          <n-form-item label="請求書有無" path="invoice">
            <n-switch v-model:value="form.invoice" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="入金期日" path="paymentDue">
            <n-select v-model:value="form.paymentDue" :options="paymentDueOptions" placeholder="入金期日を選択" />
          </n-form-item>
        </n-gi>
      </n-grid>

      <!-- 🔹 備考 -->
      <n-form-item label="備考" path="note">
        <n-input v-model:value="form.note" placeholder="備考を入力" clearable type="textarea" />
      </n-form-item>

      <n-space justify="end">
        <n-button type="primary" @click="submitForm">{{ isEdit ? "更新" : "登録" }}</n-button>
        <n-button v-if="isEdit" type="error" @click="deleteCustomer">削除</n-button>
        <n-button @click="goBack">戻る</n-button>
      </n-space>
    </n-form>
  </n-card>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";
import { useRouter } from "vue-router";
import AppNavbar from "@/components/common/AppNavbar.vue";
import Sidebar from "@/components/common/Sidebar.vue";
import axios from "axios";

const props = defineProps({ customer: Object, isEdit: Boolean });
const emit = defineEmits(["save", "delete"]);
const router = useRouter();

const formRef = ref(null);
const form = ref({
  id: props.customer?.id || null,
  category: props.customer?.category || "",
  company: props.customer?.company || "",
  name: props.customer?.name || "",
  furigana: props.customer?.furigana || "",
  department: props.customer?.department || "",
  position: props.customer?.position || "",
  zipcode: props.customer?.zipcode || "",
  address1: props.customer?.address1 || "",
  address2: props.customer?.address2 || "",
  phone: props.customer?.phone || "",
  mobile: props.customer?.mobile || "",
  fax: props.customer?.fax || "",
  email: props.customer?.email || "",
  invoice: props.customer?.invoice || false,
  paymentDue: props.customer?.paymentDue || "",
  note: props.customer?.note || "",
});

// 📌 顧客分類オプション
const categoryOptions = [
  { label: "一次卸し・大口", value: "1" },
  { label: "小売店", value: "2" },
  { label: "飲食店・ホテル", value: "3" },
  { label: "地元飲食店", value: "4" },
  { label: "通信販売", value: "5" },
  { label: "一般販売", value: "6" },
  { label: "その他", value: "7" },
  { label: "職域", value: "8" },
];

// 📌 入金期日オプション
const paymentDueOptions = [
  { label: "翌末日", value: "翌末日" },
  { label: "２週間後", value: "２週間後" },
  { label: "翌々中日", value: "翌々中日" },
  { label: "翌々末日", value: "翌々末日" },
];
const validateZipcode = () => {
  form.value.zipcode = form.value.zipcode.replace(/[^0-9]/g, "").slice(0, 7);
};

const fetchAddressFromZipcode = async () => {
  if (form.value.zipcode.length === 7) {
    try {
      const response = await axios.get(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${form.value.zipcode}`);
      if (response.data.status === 200 && response.data.results) {
        const address = response.data.results[0];
        form.value.address1 = `${address.address1}${address.address2}${address.address3}`;
      } else {
        alert("該当する住所が見つかりませんでした");
      }
    } catch (error) {
      alert("住所の取得に失敗しました");
      console.error(error);
    }
  }
};

// 📌 フォーム送信
const validatePhone = (field) => {
  form.value[field] = form.value[field].replace(/[^0-9]/g, "").slice(0, 11);
};

// **バリデーションルール**
const rules = {
  company: [{ required: false }],
  name: [{ required: false }],
  zipcode: [
    { required: true, message: "郵便番号は必須です" },
    { validator: (_, value) => /^[0-9]{7}$/.test(value), message: "郵便番号は7桁の半角数字で入力してください" },
  ],
  address1: [{ required: true, message: "住所1は必須です" }],
  address2: [{ required: true, message: "住所2は必須です" }],
  phone: [
    { required: true, message: "電話番号は必須です" },
    { validator: (_, value) => /^[0-9]{10,11}$/.test(value), message: "電話番号は10桁または11桁で入力してください" },
  ],
  email: [
    { required: false },
    {
      validator: (_, value) => {
        if (value === "") return true; // 空の場合はOK（必須ではない）
        return /^[\w\-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
      },
      message: "メールアドレスの形式が正しくありません"
    }
  ],
};
const submitForm = () => {
  if (!form.value.company && !form.value.name) {
    alert("会社名または氏名のいずれかを入力してください");
    return;
  }
  emit("save", form.value);
};

const deleteCustomer = () => emit("delete", form.value.id);
const goBack = () => router.push("/customers");
</script>
