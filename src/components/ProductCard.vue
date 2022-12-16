<template>
    <div class="product-card">
        <div class="image">
            <div v-if="item.media_type == 'CAROUSEL'">
                <img v-if="item.children[0].media_type == 'IMAGE'" :src="item.children[0].media_url" @click="handlePanelDisplay" :alt="item.caption"/>
            <video poster="../assets/photo-5.webp" v-else width="220" playsinline height="240" controls @click="handlePanelDisplay">
                <source :src="item.children[0].media_url" type="video/mp4">
              Your browser does not support the video tag.
              </video>
            </div>
            <div v-else>
                <img v-if="item.media_type == 'IMAGE'" :src="item.media_url" @click="handlePanelDisplay" :alt="item.caption"/>
                <video v-else width="220" playsinline height="240" controls @click="handlePanelDisplay">
                    <source :src="item.media_url" type="video/mp4">
                  Your browser does not support the video tag.
                  </video>
            </div>
        </div>
        <div class="btm-row">
            <h6>{{item.caption || 'Item'}}</h6>
            <div class="top-price">
                <div class="price">
                    <small>
                        Price
                    </small>
                    <small v-if="item.price">₦{{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}}</small>
                    <small v-else>N/A</small>
                </div>
                    <button type="button" class="btn btn-light" @click="addToCart(item)">Add to Cart
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart-plus" viewBox="0 0 16 16">
                        <path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9V5.5z"/>
                        <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                    </svg>
                </span>
            </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import { useCustomerData, useNotification } from "../store/index";
const emit = defineEmits(['openPanel'])
const customerStore = useCustomerData()
const notificationStore = useNotification();

const props = defineProps({
    item: {
        type: Object,
        required: true
    }
})

let handlePanelDisplay = () => {
    emit('openPanel', props.item)
}

let addToCart = (item) => {
    if(item.colors || item.sizes) {
        handlePanelDisplay()
    } else {
        let temp = {
            selectedColor: '',
            selectedSize: ''
        }
        Object.assign(item, temp);
        customerStore.addItemToCart(item);
        notificationStore.setNotification({
            message: "Item has been added to cart",
            category: "success",
            title: "Successful!"
            })
        notificationStore.setShowNotification();
    }
}
</script>

<style lang="scss" src="../styles/card.scss"></style>