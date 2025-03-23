<script setup name="HomeDashboardView">
import { NLayout, NLayoutContent } from "naive-ui";
import AppNavbar from "@/components/common/AppNavbar.vue";
import Sidebar from "@/components/common/Sidebar.vue";
import Dashboard from "@/components/common/Dashboard.vue";
</script>
<template>
  <n-layout>
    <AppNavbar />
    <Sidebar />
    <n-layout-content class="content">
      <Dashboard />
    </n-layout-content>
  </n-layout>
</template>
