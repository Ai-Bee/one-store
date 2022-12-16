<template>
    <div class="topNav container-fluid">
        <ul class="py-2 nav">
            <li class="nav-item pl-2">
                <div class="hero">
            <img src="../assets/logo.png" style="max-width: 40px;"/>
            {{ store.getBasicInfo.name || "One Store" }}
        </div>
            </li>
            <div class="d-flex">
                <!-- <li class="nav-item pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
  <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
</svg>
            </li> -->
            <li class="text-dark pointer px-4 nav-item">
                <button class="btn align-center btn-primary">
                    <router-link to="/checkout" class="text-light no-decoration">
                        Cart
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi pb-1 bi-bag-dash" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M5.5 10a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5z"/>
  <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/>
</svg>
<span v-if="(customerStore.cartCount !== 0)" class="position-absolute top-0 text-danger bg-light rounded-5 px-2 fw-bold border border-danger">
    {{ customerStore.cartCount }}
</span>
                    </router-link>
                </button>
            </li>
            </div>
        </ul>
    </div>
</template>

<script setup>
import { useUserData, useCustomerData } from "../store/index";

const store = useUserData()
const customerStore = useCustomerData()

</script>

<style lang="scss" src="../styles/nav.scss"></style>