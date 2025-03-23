import { defineStore } from "pinia";

export const useCategoryStore = defineStore("categoryStore", {
  state: () => ({
    categories: [
      { label: "野菜", value: "野菜" },
      { label: "果物", value: "果物" },
    ],
  }),
  getters: {
    categoryOptions(state) {
      return [...state.categories];
    },
  },
  actions: {
    addCategory(category) {
      if (!this.categories.find((c) => c.value === category.value)) {
        this.categories.push(category);
      }
    },
    removeCategory(value) {
      this.categories = this.categories.filter((c) => c.value !== value);
    },
  },
});
