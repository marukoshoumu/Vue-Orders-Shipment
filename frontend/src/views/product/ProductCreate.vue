<template>
  <ProductForm @save="handleSave" />
</template>

<script setup>
import { useRouter } from "vue-router";
import ProductForm from "@/components/product/ProductForm.vue";
import { useProductStore } from "@/stores/productStore";

const router = useRouter();
const productStore = useProductStore();

const handleSave = (product) => {
  productStore.addProduct(product);
  router.push("/products");
};
</script>
