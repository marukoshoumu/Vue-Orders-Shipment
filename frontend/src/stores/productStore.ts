import { defineStore } from "pinia";

export const useProductStore = defineStore("productStore", {
  state: () => ({
    products: [
      { id: "1", category: "野菜", name: "青首大根", price: 300 },
      { id: "2", category: "野菜", name: "五寸ニンジン", price: 250 },
      { id: "3", category: "果物", name: "りんご", price: 500 },
      { id: "4", category: "果物", name: "みかん", price: 400 },
    ],
  }),
  actions: {
    addProduct(product) {
      product.id = String(this.products.length + 1);
      this.products.push(product);
    },
    getProductById(id) {
      return this.products.find((p) => p.id === id);
    },
    updateProduct(updatedProduct) {
      const index = this.products.findIndex((p) => p.id === updatedProduct.id);
      if (index !== -1) {
        this.products[index] = updatedProduct;
      }
    },
    deleteProduct(id) {
      this.products = this.products.filter((p) => p.id !== id);
    },
  },
});
