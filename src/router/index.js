import { createRouter, createWebHashHistory } from "vue-router";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import ProductGallery from "../pages/ProductGallery";
import SettingUp from "../pages/SettingUp";
import Checkout from "../pages/CheckoutPage"

const routes = [
  { path: "/", redirect: "/connect", component: LandingPage },
  { path: "/connect", component: LoginPage },
  { path: "/products", component: ProductGallery },
  {
    path: "/setup",
    component: SettingUp,
  },
  {
    path: "/checkout",
    component: Checkout
  }
];

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHashHistory(),
  routes, // short for `routes: routes`
});

export default router;
