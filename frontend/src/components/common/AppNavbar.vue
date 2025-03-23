<template>
  <n-layout-header class="header">
    <n-button @click="toggleSidebar" text class="menu-btn">☰</n-button>
    <span class="title">{{ pageTitle }}</span>
    <n-button type="error" @click="logout" class="logout-btn">ログアウト</n-button>
  </n-layout-header>
</template>

<script setup name="AppNavbar">
import { useRoute, useRouter } from "vue-router";
import { useSidebarStore } from "@/stores/sidebarStore";
import { computed } from "vue";

const sidebarStore = useSidebarStore();
const router = useRouter();
const route = useRoute(); // 現在のルート情報を取得

// 🔹 ページタイトルを動的に変更
const pageTitle = computed(() => route.meta.title || "受注管理システム");
const toggleSidebar = () => {
  sidebarStore.toggleSidebar();
};

const logout = () => {
  localStorage.removeItem("authToken");
  router.push("/");
};
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: #409eff;
  color: white;
}

.menu-btn {
  font-size: 24px;
  color: white;
}

.menu-btn:focus,
.menu-btn:active {
  color: white;
}

.title {
  font-size: 20px;
  font-weight: bold;
}

.logout-btn {
  font-size: 14px;
}
</style>
