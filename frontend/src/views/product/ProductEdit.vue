<template>
  <ProductForm :product="product" isEdit @save="handleSave" @delete="handleDelete" />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import ProductForm from "@/components/product/ProductForm.vue";
import { useProductStore } from "@/stores/productStore";

const router = useRouter();
const route = useRoute();
const productStore = useProductStore();

const product = ref(null);

onMounted(() => {
  const foundProduct = productStore.getProductById(route.params.id);
  if (foundProduct) {
    product.value = foundProduct;
  } else {
    router.push("/products");
  }
});

const handleSave = (updatedProduct) => {
  productStore.updateProduct(updatedProduct);
  router.push("/products");
};

const handleDelete = (id) => {
  productStore.deleteProduct(id);
  router.push("/products");
};
</script>
