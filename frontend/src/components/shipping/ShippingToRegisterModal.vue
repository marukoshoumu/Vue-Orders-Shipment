<template>
  <n-modal v-model:show="show" preset="card" title="発送先新規登録" class="register-modal">
    <n-form ref="formRef" :model="form" label-width="100px">
      <n-form-item label="会社名" path="name">
        <n-input v-model:value="form.name" placeholder="会社名を入力" />
      </n-form-item>
      <n-form-item label="部署" path="department">
        <n-input v-model:value="form.department" placeholder="部署を入力" />
      </n-form-item>
      <n-form-item label="氏名" path="contact">
        <n-input v-model:value="form.contact" placeholder="氏名を入力" />
      </n-form-item>
      <n-form-item label="郵便番号" path="zipcode">
        <n-input v-model:value="form.zipcode" placeholder="例: 1000001" clearable @blur="fetchAddressFromZipcode" />
      </n-form-item>
      <n-form-item label="住所1" path="address1">
        <n-input v-model:value="form.address1" placeholder="都道府県・市区町村" />
      </n-form-item>
      <n-form-item label="住所2" path="address2">
        <n-input v-model:value="form.address2" placeholder="番地・建物名など" />
      </n-form-item>
      <n-form-item label="電話番号" path="phone">
        <n-input v-model:value="form.phone" placeholder="電話番号を入力" clearable />
      </n-form-item>
      <n-form-item label="メールアドレス" path="email">
        <n-input v-model:value="form.email" placeholder="メールアドレスを入力" clearable />
      </n-form-item>
      <n-form-item label="備考" path="note">
        <n-input v-model:value="form.note" placeholder="備考を入力" clearable type="textarea" />
      </n-form-item>
    </n-form>

    <n-space justify="end">
      <n-button type="primary" @click="registerShippingTo">登録</n-button>
      <n-button @click="close">キャンセル</n-button>
    </n-space>
  </n-modal>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const show = defineModel("show");
const emit = defineEmits(["registered"]);

const form = ref({
  name: "",
  department: "",
  contact: "",
  zipcode: "",
  address1: "",
  address2: "",
  phone: "",
  email: "",
  note: "",
});

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

const registerShippingTo = () => {
  emit("registered", form.value);
  close();
};

const close = () => {
  show.value = false;
};
</script>

<style scoped>
.register-modal {
  width: 400px;
}
</style>
