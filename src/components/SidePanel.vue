<template>
    <aside class="side">
    <div class="panel-product-card">
        <div class="image">
            <svg @click="closePanel()" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-x-lg close-btn" viewBox="0 0 16 16">
  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
</svg>
<div>
    <img class="main" v-if="mediaInFocus['media_type'] === 'IMAGE'" :src="mediaInFocus.media_url" :alt="selectedItem.caption"/>
    <video v-else width="320" playsinline height="340" controls>
        <source :src="mediaInFocus.media_url" type="video/mp4">
      Your browser does not support the video tag.
      </video>
</div>
            <div class="img-row" v-if="selectedItem.media_type == 'CAROUSEL'">
                <template v-for="media in selectedItem.children" :key="media.timestamp">
                    <img @click="updateFocus(media)" class="main" v-if="media.media_type == 'IMAGE'" :src="media.media_url" :alt="selectedItem.caption"/>
    <video @click="updateFocus(media)" v-else width="220" playsinline="false" height="240">
        <source :src="media.media_url" type="video/mp4">
      Your browser does not support the video tag.
      </video>
                    </template>
            </div>
        </div>
        <div class="btm-row">
            <h2>Product Name</h2>
            <div class="top-price">
                <div class="price">
                    <p v-if="selectedItem.price">
                        ₦{{selectedItem.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}}
                    </p>
                    <p v-else>N/A</p>

                </div>
                <div class="color" v-if="selectedItem.colors">
                    Available Colors:
                    <template v-for="item in selectedItem.colors" :key="item">
                        <div @click="updateColorPreference(item)" :style="{ backgroundColor: item }" :class="`oneColor ${item == color ? 'active' : ''}`"></div>
                    </template>
                </div>
                <div class="sizes" v-if="selectedItem.sizes">
                    Available Sizes: 
                    <template v-for="element in selectedItem.sizes" :key="element">
                        <div @click="updateSizePreference(element)" :class="`oneSize ${element == size ? 'active' : ''}`">{{ element }}</div>
                    </template>
                </div>
                    <button type="button" @click="addToCart" class="btn cart-btn">Add to Cart
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
    </aside>
</template>

<script setup>
import { defineProps, defineEmits, watch, onMounted, ref } from 'vue';
import { useCustomerData, useNotification } from "../store/index";

const customerStore = useCustomerData()
const notificationStore = useNotification();
const props = defineProps({
    selectedItem: {
        type: Object,
        required: true
    }
})
const emit = defineEmits(['closePanel'])

let mediaInFocus = ref(props.selectedItem)
let color = ref(null);
let size = ref(null);

let updateColorPreference = (element) => {
    color.value = element;
}

let updateSizePreference = (element) => {
    size.value = element;
}
onMounted(() => {
    if (props.selectedItem.media_type == 'CAROUSEL') {
        mediaInFocus.value = props.selectedItem.children[0];
    } else {
        mediaInFocus.value = props.selectedItem;
    }
    if (props.selectedItem.colors) {
        color.value = props.selectedItem.colors[0]
    }
    if (props.selectedItem.sizes) {
        size.value = props.selectedItem.sizes[0]
    }
})

watch(
  () => props.selectedItem,
  () => {
    notificationStore.setHideNotification()
    if (props.selectedItem.media_type == 'CAROUSEL') {
        mediaInFocus.value = props.selectedItem.children[0];
    } else {
        mediaInFocus.value = props.selectedItem;
    }
  }
);

let updateFocus = (selection) => {
    mediaInFocus.value = selection;
}

let addToCart = () => {
    let item = props.selectedItem;
    let temp = null;
    if(item.colors || item.sizes) {
        temp = {
            selectedColor: color.value,
            selectedSize: size.value
        }
    } else {
        temp = {
            selectedColor: '',
            selectedSize: ''
        }
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

let closePanel = () => {
    emit("closePanel")
}
</script>

<style lang="scss" src="../styles/panelCard.scss"></style>