<template>
    <div class="alertBody">
        <div class="card mb-3" style="min-width: 18rem;">
            <div v-bind:class="`card-header ${notificationStore.category === 'failure' ? 'failure' : 'success'} ` ">
              <h4>
                {{notificationStore.title}}
              </h4>
              <div class="cls-btn">
                <svg @click="closeNotification()" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-x-lg close-btn" viewBox="0 0 16 16">
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                </svg>
              </div>
              </div>
            <div v-bind:class="`card-body ${notificationStore.category === 'failure' ? 'failure' : 'success'} ` ">
              <p class="card-text">{{notificationStore.message}}</p>
              <br/>
            </div>
          </div>
    </div>
</template>

<script setup>
import { useNotification } from "../store/index";

let notificationStore = useNotification();


let closeNotification = () => {
  notificationStore.setHideNotification();
}

</script>

<style lang="scss" src="../styles/alert.scss"></style>