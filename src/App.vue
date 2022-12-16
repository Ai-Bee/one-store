<template>
  <NavBar/>
  <div id="app">
  <router-view></router-view>
  <div v-if="notificationStore.show">
    <GenericAlertVue/>
  </div>
  <div v-if="notificationStore.loading">
    <LoaderComponent/>
  </div>
  </div>
</template>

<script setup>
import GenericAlertVue from './components/GenericAlert.vue';
import LoaderComponent from './components/LoaderComponent.vue';
import NavBar from './components/NavBar.vue';
import { useNotification } from "./store/index";

let notificationStore = useNotification();
</script>

<style lang="scss" src="./styles/app.scss"/>