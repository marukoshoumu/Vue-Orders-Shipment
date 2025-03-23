<template>
  <n-card class="form-card">
    <n-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <n-grid :cols="2" x-gap="10">
        <!-- 会社名 -->
        <n-gi>
          <n-form-item label="会社名" path="company">
            <n-input v-model:value="form.company" placeholder="会社名を入力" />
          </n-form-item>
        </n-gi>

        <!-- 部署 -->
        <n-gi>
          <n-form-item label="部署" path="department">
            <n-input v-model:value="form.department" placeholder="部署を入力" />
          </n-form-item>
        </n-gi>
      </n-grid>

      <n-grid :cols="2" x-gap="10">
        <!-- 氏名 -->
        <n-gi>
          <n-form-item label="氏名" path="name">
            <n-input v-model:value="form.name" placeholder="氏名を入力" />
          </n-form-item>
        </n-gi>

        <!-- 郵便番号 -->
        <n-gi>
          <n-form-item label="郵便番号" path="zipcode">
            <n-input v-model:value="form.zipcode" placeholder="例: 123-4567" clearable @input="validateZipcode"
              @blur="fetchAddressFromZipcode" />
          </n-form-item>
        </n-gi>
      </n-grid>

      <n-form-item label="住所1" path="address1">
        <n-input v-model:value="form.address1" placeholder="都道府県・市区町村" disabled />
      </n-form-item>

      <n-form-item label="住所2" path="address2">
        <n-input v-model:value="form.address2" placeholder="番地・建物名" />
      </n-form-item>

      <n-grid :cols="2" x-gap="10">
        <!-- TEL -->
        <n-gi>
          <n-form-item label="TEL" path="phone">
            <n-input v-model:value="form.phone" placeholder="電話番号を入力" @input="validatePhone('phone')" />
          </n-form-item>
        </n-gi>

        <!-- メールアドレス -->
        <n-gi>
          <n-form-item label="メールアドレス" path="email">
            <n-input v-model:value="form.email" placeholder="メールアドレスを入力" />
          </n-form-item>
        </n-gi>
      </n-grid>

      <n-form-item label="備考" path="note">
        <n-input v-model:value="form.note" type="textarea" placeholder="備考を入力" />
      </n-form-item>

      <n-space justify="end">
        <n-button type="primary" @click="submitForm">{{ isEdit ? "更新" : "登録" }}</n-button>
        <n-button v-if="isEdit" type="error" @click="deleteShipping">削除</n-button>
        <n-button @click="goBack">戻る</n-button>
      </n-space>
    </n-form>
  </n-card>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const props = defineProps({ shipping: Object, isEdit: Boolean });
const emit = defineEmits(["save", "delete"]);
const router = useRouter();

const form = ref({
  id: props.shipping?.id || null,
  company: props.shipping?.company || "",
  department: props.shipping?.department || "",
  name: props.shipping?.name || "",
  zipcode: props.shipping?.zipcode || "",
  address1: props.shipping?.address1 || "",
  address2: props.shipping?.address2 || "",
  phone: props.shipping?.phone || "",
  email: props.shipping?.email || "",
  note: props.shipping?.note || "",
});

// 📌 郵便番号バリデーション（数字のみ）
const validateZipcode = () => {
  form.value.zipcode = form.value.zipcode.replace(/[^0-9]/g, "").slice(0, 7);
};

// 📌 郵便番号から住所を取得
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
    }
  }
};

// 📌 電話番号バリデーション（数字のみ）
const validatePhone = (field) => {
  form.value[field] = form.value[field].replace(/[^0-9]/g, "").slice(0, 11);
};

// 📌 フォームバリデーション
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
        if (value === "") return true;
        return /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
      },
      message: "メールアドレスの形式が正しくありません",
    },
  ],
};

// 📌 フォーム送信
const submitForm = () => {
  if (!form.value.company && !form.value.name) {
    alert("会社名または氏名のいずれかを入力してください");
    return;
  }
  emit("save", form.value);
};

// 📌 削除処理
const deleteShipping = () => emit("delete", form.value.id);

// 📌 戻る処理
const goBack = () => router.push("/shipping");
</script>

<style scoped>
.form-card {
  max-width: 900px;
  margin: 10px auto;
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 10px;
}

.n-button {
  margin-top: 10px;
}
</style>
