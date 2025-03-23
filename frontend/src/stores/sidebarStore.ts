import { defineStore } from "pinia";

export const useSidebarStore = defineStore("sidebar", {
  state: () => ({
    isDrawerOpen: false,
  }),
  actions: {
    toggleSidebar() {
      this.isDrawerOpen = !this.isDrawerOpen;
    },
    closeSidebar() {
      this.isDrawerOpen = false;
    },
  },
});
