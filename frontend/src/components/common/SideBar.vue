<script setup>
import { useRouter } from "vue-router";
import { useSidebarStore } from "@/stores/sidebarStore";
import { NDrawer, NDrawerContent, NMenu, NButton, NIcon } from "naive-ui";
import { h } from "vue";

// 📌 アイコンをインポート（適切なアイコンを選択）
import { HomeFilled, RocketLaunchFilled, ListAltRound, Inventory2Round, GroupFilled, LocalShippingFilled } from "@vicons/material";

const sidebarStore = useSidebarStore();
const router = useRouter();

// 📌 メニューを閉じる関数
const closeDrawer = () => {
  sidebarStore.closeSidebar();
};

// 📌 ページ遷移関数
const navigate = (path) => {
  router.push(path).catch(() => { });
  closeDrawer();
};

// 📌 `icon` に `h` 関数を使って適切なアイコンをセット
const renderIcon = (icon) => () => h(NIcon, null, { default: () => h(icon) });

const menuOptions = [
  { label: "ホームへ", key: "/", icon: renderIcon(HomeFilled) },
  { label: "受注登録", key: "/order-register", icon: renderIcon(RocketLaunchFilled) },
  { label: "受注一覧", key: "/orders", icon: renderIcon(ListAltRound) },
  { label: "商品一覧", key: "/products", icon: renderIcon(Inventory2Round) },
  { label: "顧客一覧", key: "/customers", icon: renderIcon(GroupFilled) },
  { label: "発送先一覧", key: "/shipping", icon: renderIcon(LocalShippingFilled) },
];
</script>

<template>
  <n-drawer :show="sidebarStore.isDrawerOpen" placement="left" @after-leave="closeDrawer">
    <n-drawer-content title="メニュー">
      <n-menu :options="menuOptions" @update:value="navigate" />
      <n-button type="error" block @click="closeDrawer" class="close-btn">閉じる</n-button>
    </n-drawer-content>
  </n-drawer>
</template>

<style scoped>
.close-btn {
  margin-top: 20px;
}
</style>
