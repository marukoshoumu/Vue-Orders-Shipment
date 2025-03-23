import { createRouter, createWebHistory } from "vue-router";
import AppHome from "../views/dashboard/AppHome.vue";
import ProductList from "../views/product/ProductList.vue";
import OrderList from "../views/order/OrderList.vue";
import CustomerList from "../views/customer/CustomerList.vue";
import OrderRegister from "../views/order/OrderRegister.vue";
import ProductCreate from "@/views/product/ProductCreate.vue";
import ProductEdit from "@/views/product/ProductEdit.vue";
import CustomersCreate from "@/views/customer/CustomersCreate.vue";
import CustomersEdit from "@/views/customer/CustomersEdit.vue";
import ShippingToList from "@/views/shipping/ShippingToList.vue";
import ShippingToRegister from "@/views/shipping/ShippingToRegister.vue";
import ShippingToEdit from "@/views/shipping/ShippingToEdit.vue";

const routes = [
  { path: "/", component: AppHome, meta: { title: "ホーム" } },
  { path: "/products", component: ProductList, meta: { title: "商品一覧" } },
  { path: "/products/create", component: ProductCreate, meta: { title: "商品登録" } },
  { path: "/products/edit/:id", component: ProductEdit, meta: { title: "商品編集" } },
  { path: "/orders", component: OrderList, meta: { title: "受注一覧" } },
  { path: "/customers", component: CustomerList, meta: { title: "顧客一覧" } },
  { path: "/customers/create", component: CustomersCreate, meta: { title: "顧客登録" } },
  { path: "/customers/edit/:id", component: CustomersEdit, meta: { title: "顧客編集" } },
  { path: "/order-register", component: OrderRegister, meta: { title: "受注登録" } },
  { path: "/shipping", component: ShippingToList, meta: { title: "発送先一覧" } },
  { path: "/shipping/create", component: ShippingToRegister, meta: { title: "発送先登録" } },
  { path: "/shipping/edit/:id", component: ShippingToEdit, meta: { title: "発送先編集" } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
