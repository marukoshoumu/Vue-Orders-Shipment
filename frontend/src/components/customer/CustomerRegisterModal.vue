<template>
  <n-modal v-model:show="isOpen" :mask-closable="false" preset="card" title="顧客新規登録">
    <n-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <!-- 🔹 顧客分類 -->
      <n-form-item label="顧客分類" path="category">
        <n-select v-model:value="form.category" :options="categoryOptions" placeholder="分類を選択" />
      </n-form-item>

      <!-- 🔹 会社名・氏名 -->
      <n-grid :cols="2" x-gap="10">
        <n-gi>
          <n-form-item label="会社名" path="company">
            <n-input v-model:value="form.company" placeholder="会社名を入力" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="氏名" path="name">
            <n-input v-model:value="form.name" placeholder="氏名を入力" />
          </n-form-item>
        </n-gi>
      </n-grid>

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
      <n-grid :cols="3" x-gap="10">
        <n-gi>
          <n-form-item label="郵便番号" path="zipcode">
            <n-input v-model:value="form.zipcode" placeholder="例: 1000001" clearable @input="validateZipcode"
              @blur="fetchAddressFromZipcode" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="住所1" path="address1">
            <n-input v-model:value="form.address1" placeholder="都道府県・市区町村" disabled />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="住所2" path="address2">
            <n-input v-model:value="form.address2" placeholder="番地・建物名など" />
          </n-form-item>
        </n-gi>
      </n-grid>

      <!-- 🔹 連絡先 -->
      <n-grid :cols="3" x-gap="10">
        <n-gi>
          <n-form-item label="電話番号" path="phone">
            <n-input v-model:value="form.phone" placeholder="例: 0312345678" clearable @input="validatePhone('phone')" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="携帯電話" path="mobile">
            <n-input v-model:value="form.mobile" placeholder="例: 09012345678" clearable
              @input="validatePhone('mobile')" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="FAX" path="fax">
            <n-input v-model:value="form.fax" placeholder="例: 0312345678" clearable @input="validatePhone('fax')" />
          </n-form-item>
        </n-gi>
      </n-grid>

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

      <!-- 🔹 アクションボタン -->
      <n-space justify="end">
        <n-button @click="close">キャンセル</n-button>
        <n-button type="primary" @click="registerCustomer">登録</n-button>
      </n-space>
    </n-form>
  </n-modal>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import axios from "axios";

const emit = defineEmits(["close", "register"]);
const isOpen = ref(true);

// フォームデータ
const form = ref({
  category: "",
  company: "",
  name: "",
  furigana: "",
  department: "",
  position: "",
  zipcode: "",
  address1: "",
  address2: "",
  phone: "",
  mobile: "",
  fax: "",
  email: "",
  invoice: false,
  paymentDue: "",
  note: "",
});

// 顧客分類オプション
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

// 入金期日オプション
const paymentDueOptions = [
  { label: "翌末日", value: "翌末日" },
  { label: "２週間後", value: "２週間後" },
  { label: "翌々中日", value: "翌々中日" },
  { label: "翌々末日", value: "翌々末日" },
];

// 郵便番号から住所を取得
const fetchAddressFromZipcode = async () => {
  if (form.value.zipcode.length === 7) {
    const response = await axios.get(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${form.value.zipcode}`);
    if (response.data.status === 200 && response.data.results) {
      const address = response.data.results[0];
      form.value.address1 = `${address.address1}${address.address2}${address.address3}`;
    }
  }
};

// 登録処理
const registerCustomer = () => {
  emit("register", form.value);
  emit("close");
};

// モーダルを閉じる
const close = () => {
  emit("close");
};
</script>
