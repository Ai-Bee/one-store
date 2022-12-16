import { defineStore } from 'pinia'

const useUserData = defineStore('userData', {
  state: () => ({
    userBio: null,
    name: null,
    currency: null,
    profilePicture: null,
    productTags: [],
    primaryLocation: null,
    postsTimeRange: null,
    nationwideShipping: false,
    whatsappLink: null,
    announcements: [],
    availableStores: [],
    selectedStore: null,
  }),
  getters: {
    getBasicInfo(state) {
      return {name: state.name, bio: state.userBio, picture: state.profilePicture}
    },
    getAnnouncements(state) {
      return state.announcements;
    }
  },
  actions: {
    addBasicInfo(data) {
      this.userBio = data.bio
      this.name = data.name
      this.profilePicture = data.picture
    },
    addAnnouncements(data) {
      this.announcements.push(data)
    }
  },
})

const useUserMedia = defineStore('userMedia', {
  state: () => ({
    mediaArray: [],
    mediaSelection: [],
    recordSelected: null
  }),
  getters: {
    getAllUserMedia(state) {
      return state.mediaArray;
    },
    getSelectedRecord(state) {
      return state.recordSelected;
    }
  },
  actions: {
    updateMediaArray(data) {
      this.mediaArray.push(data);
    },
    setSelectedMedia(data) {
      this.recordSelected = data;
    }
  }
})

const useNotification = defineStore('notification', {
  state: () => ({
    message: null,
    category: null,
    title: null,
    show: false,
    loading: false,
  }),
  actions: {
    setShowNotification() {
      this.show = true;
    },
    setHideNotification() {
      this.show = false;
    },
    setLoadingState(item) {
      this.loading = item;
    },
    setNotification(item) {
      this.message = item.message;
      this.category = item.category;
      this.title = item.title;
    }
  }
})

const useCustomerData = defineStore('customer', {
  state: () => ({
    cart: []
  }),
  getters: {
    cartCount(state) {
      return state.cart.length;
    }
  },
  actions: {
    deleteItemFromCart(itemID) {
      this.cart =  this.cart.filter(item => item.id !== itemID)
    },
    addItemToCart(item) {
      if(!this.cart.find(el => el.id === item.id)) {
        this.cart.push(item);
      }
    },
  }
})

export { useUserData, useNotification, useUserMedia, useCustomerData }