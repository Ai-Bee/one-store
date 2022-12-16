<template>
  <div class="login-page">
    <div class="form-component">
      <div>
        <h3>Welcome to #OneStore</h3>
        <p>Please connect your store</p>
      </div>
      <div class="btn-group">
        <button
          class="button"
          v-if="toggles.connect"
          @click="logInWithFacebook"
        >
          Login with Facebook
        </button>
        <button class="button" v-if="toggles.stores" @click="newMet">
          Get Connected Accounts
        </button>
        <select
          class="form-select form-select-sm"
          v-show="data.availableStores.length > 0"
          aria-label=".form-select-sm"
          name="stores"
          id="stores"
          v-model="data.selectedStore"
        >
          <option disabled selected value="null">
            Please pick the store you wish to connect
          </option>
          <template v-for="store in data.availableStores" :key="store.id">
            <option :value="store.id">{{ store.name }}</option>
          </template>
        </select>
        <p v-show="store.name">
          You've succcessfully connected <br />
          {{ store.name }}!
        </p>
        <button class="button" v-if="toggles.logout" @click="logOutFacebook">
          Logout Facebook
        </button>
      </div>
    </div>
    <div class="decoration">
      <!-- <img src="../assets/ecommerce.gif"/> -->
    </div>

  </div>
</template>

<script setup>
import { reactive, watch, onMounted } from "vue";
import router from "@/router";
import { useUserData, useUserMedia, useNotification } from "../store/index";

const store = useUserData();
const mediaStore = useUserMedia();
const notificationStore = useNotification();

let toggles = reactive({
  connect: true,
  logout: false,
  stores: false,
});

let data = reactive({
  availableStores: [],
  selectedStore: null,
  mediaArray: [],
});

let userObject = reactive({
  bio: null,
  name: null,
  picture: null,
  media: [],
  temp: "Store Name",
});

let newMet = () => {
  window.FB.api("/me/accounts", function (response) {
    data.availableStores = response.data;
    store.availableStores = response.data;
  });
};

// instead, use a getter:
watch(
  () => data.selectedStore,
  (newValue) => {
    getInstagramBusiness(newValue);
  }
);

onMounted(() => {

})


let logOutFacebook = () => {
  // log out method here
  notificationStore.setLoadingState(true)
  window.FB.logout(function () {
    notificationStore.setLoadingState(false)
    toggles.connect = true;
    toggles.stores = toggles.logout = false;
    userObject.bio = null;
    userObject.name = null;
    userObject.picture = null;
    userObject.media = [];
    data.availableStores = [];
    data.mediaArray = [];
    data.selectedStore = null;
    store.$reset();
    mediaStore.$reset();
  });
};

let getInstagramBusiness = (id) => {
  notificationStore.setLoadingState(true)
  window.FB.api(`${id}?fields=instagram_business_account`, function (response) {
    notificationStore.setLoadingState(false)
    if(response.instagram_business_account.id) {
      notificationStore.setNotification({
          message: "You will be redirected",
          category: "success",
          title: "Successful!"
        })
      getMedia(response.instagram_business_account.id);
    } else {
      notificationStore.setNotification({
          message: "Sorry, an error occurred",
          category: "failure",
          title: "Error"
        })
    }
    notificationStore.setShowNotification();
  });
};

let getMedia = (igID) => {
  window.FB.api(
    `${igID}?fields=biography,name,profile_picture_url,media`,
    function (response) {
      // console.log({ response });
      store.addBasicInfo({
        bio: response.biography,
        name: response.name,
        picture: response.profile_picture_url,
      });
      userObject.bio = response.biography;
      userObject.name = response.name;
      userObject.picture = response.profile_picture_url;
      mediaStore.mediaArray = response.media.data;
      router.push({ path: '/products' }) 
      // getMediaUrls(response.media.data);
    }
  );
};



let logInWithFacebook = async () => {
  notificationStore.setLoadingState(true)
  await loadFacebookSDK(document, "script", "facebook-jssdk");
  await initFacebook();
  window.FB.login(
    function (response) {
      notificationStore.setLoadingState(false)
      if (response.authResponse) {
        notificationStore.setNotification({
          message: "Please go ahead to select a store",
          category: "success",
          title: "Logged in Successfully"
        })
        localStorage.setItem("login", response.authResponse);
        toggles.connect = false;
        toggles.stores = true;
        toggles.logout = true;
      } else {
        notificationStore.setNotification({
          message: "Login attempt was cancelled by user",
          category: "failure",
          title: "Login failed"
        })
        toggles.connect = true;
        toggles.stores = false;
        toggles.logout = false;
      }
      notificationStore.setShowNotification();
    },
    { scope: "public_profile, email, instagram_basic, pages_show_list" }
  );
  return false;
};

let initFacebook = async () => {
  window.fbAsyncInit = await function () {
    window.FB.init({
      appId: process.env.VUE_APP_ID,
      cookie: true, // This is important, it's not enabled by default
      version: "v15.0",
    });
  };
};

let loadFacebookSDK = (d, s, id) => {
  var js,
    fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
};
</script>

<style lang="scss">
div.btn-group {
  display: flex;
  justify-content: center;
  align-items: center;
  button {
    width: 180px;
    border-radius: 4px;
    height: auto;
    margin-right: 20px;
    font-size: 14px;
    padding: 20px;
    color: #fff;
    background-color: cadetblue;
    outline: none;
    border: none;
  }
}

ul.picture-gallery {
  background-color: bisque;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  li {
    list-style-type: none;
    padding: 30px;
    img {
      max-width: 200px;
    }
  }
}
</style>
