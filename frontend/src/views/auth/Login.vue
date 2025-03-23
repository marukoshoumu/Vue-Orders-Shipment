<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const router = useRouter();

const login = () => {
  if (email.value === "demo@example.com" && password.value === "password") {
    localStorage.setItem("authToken", "dummy-token");
    router.push("/home");
  } else {
    errorMessage.value = "ログイン失敗";
  }
};
</script>

<template>
  <div>
    <h2>ログイン</h2>
    <input v-model="email" type="email" placeholder="メールアドレス" />
    <input v-model="password" type="password" placeholder="パスワード" />
    <button @click="login">ログイン</button>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>
