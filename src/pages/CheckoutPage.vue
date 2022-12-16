<template>
  <div>
    <div class="all-checks">
      <h3>Your Cart</h3>
      <div class="checkout">
        <div v-if="customerStore.cart.length > 0">
          <template v-for="item in customerStore.cart" :key="item.id">
            <div class="cart-item">
              <div class="card-0">
                <div v-if="item.media_type == 'CAROUSEL'">
                  <img
                    v-if="item.children[0].media_type == 'IMAGE'"
                    :src="item.children[0].media_url"
                    @click="handlePanelDisplay"
                    :alt="item.caption"
                  />
                  <video
                    poster="../assets/photo-5.webp"
                    v-else
                    width="220"
                    playsinline
                    height="240"
                    controls
                    @click="handlePanelDisplay"
                  >
                    <source
                      :src="item.children[0].media_url"
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div v-else>
                  <img
                    v-if="item.media_type == 'IMAGE'"
                    :src="item.media_url"
                    @click="handlePanelDisplay"
                    :alt="item.caption"
                  />
                  <video
                    v-else
                    width="220"
                    playsinline
                    height="240"
                    controls
                    @click="handlePanelDisplay"
                  >
                    <source :src="item.media_url" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
              <div class="card-1">
                <h4>Short sleeve Jacket</h4>
                <p class="card-3" v-if="item.price">
                  ₦{{
                    item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }}
                </p>
                <p v-else>Null</p>
                <p v-show="item.selectedSize">Size: {{ item.selectedSize }}</p>
                <p v-show="item.selectedColor">
                  Color:
                  {{item.selectedColor}}
                </p>
              </div>
              <div class="card-4 position-relative">
                <button @click="decrease()" class="btn btn-outline-secondary">
                  -
                </button>
                <p>{{ count }}</p>
                <button @click="count++" class="btn btn-outline-secondary">
                  +
                </button>
                <button
                  class="d-flex btn btn-outline-danger position-absolute bottom-0 end-0"
                  @click="deleteItem(item)"
                  title="Delete"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-trash3"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </template>
        </div>
        <div v-else>
          <h6>Sorry, your cart is empty, kindly keep shopping...</h6>
        </div>
      </div>
      <div class="conclusion">
        <div>
          <h4>Shipping: <span>#3,000</span></h4>
        </div>
        <div>
          <h4>
            Total: <span> {{ `₦${computeTotalAmount().toLocaleString()}` }} </span>
          </h4>
        </div>
        <!-- <button class="btn btn-large btn-outline-success">Proceed to Checkout</button> -->
        <paystack
          buttonClass="btn btn-primary"
          buttonText="Securely Pay"
          :publicKey="paystackkey"
          :email="email"
          :amount="computeTotalAmount()*100"
          :reference="reference"
          :onSuccess="callback"
          :onCancel="close"
        >
        </paystack>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import router from "@/router";
import paystack from "vue3-paystack";
import { useCustomerData, useNotification } from "../store/index";

const notificationStore = useNotification();

const customerStore = useCustomerData();
let count = ref(1);
let paystackkey = ref(process.env.VUE_APP_PAYSTACK_KEY); //paystack public key
let email = ref("foobar@gmail.com"); // Customer email
// let cartLocal = ref(1000000);

let decrease = () => {
  if (count.value > 0) {
    count.value--;
  }
};

onMounted(() => {
  notificationStore.setHideNotification();
})

let callback = (response) => {
  // console.log({response});
  notificationStore.setNotification({
        message: "Order has been confirmed!!",
        category: "success",
        title: response.message
        })
    notificationStore.setShowNotification();
    customerStore.$reset()
    router.push({ path: '/products' }) 
};

let close = () => {
  // console.log("Payment closed");
  notificationStore.setNotification({
        message: "Action cancelled!",
        category: "success",
        title: "Cancelled"
        })
    notificationStore.setShowNotification();
};

let deleteItem = (item) => {
  customerStore.deleteItemFromCart(item.id);
};

// let totalAmount = computed(() => {
//   let dataArray = customerStore.cart.filter((item) => item.price);
//   // console.log({ dataArray });
//   let total = dataArray.reduce(
//     (total, item) => Number(total.price) + Number(item.price)
//   );
//   return total;
// });

customerStore.$subscribe((mutation, state) => {
  // persist the whole state to the local storage whenever it changes
  if(mutation.events.key == 'cart') {
    computeTotalAmount(state.cart)
  }
})

let computeTotalAmount = (arg) => {
  let dataArray1 = arg || customerStore.cart
  if(dataArray1.length > 1) {
    let dataArray = dataArray1.filter((item) => item.price);
  let total = dataArray.reduce(
    (total, item) => Number(total.price) + Number(item.price)
  );
  return total;
  } else {
    return Number(dataArray1[0].price);
  }
}

const reference = computed(() => {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 10; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
});
</script>

<style lang="scss" src="../styles/checkout.scss" />
