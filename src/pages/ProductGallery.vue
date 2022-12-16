<template>
  <div class="productCards" v-if="arrayReady">
    <!-- <iframe style="border-radius:12px; margin-bottom: 50px" id="music" src="https://open.spotify.com/embed/track/3inmZizVSBfCmmgEbaowtl?utm_source=generator&theme=0" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe> -->
    <template v-for="item in userObject.media" :key="item">
      <ProductCard @openPanel="handleOpen" :item="item"></ProductCard>
    </template>
    <div v-if="showSide" id="sidepanel">
      <SidePanel
        @closePanel="handleClose()"
        :selectedItem="selectedItem"
      ></SidePanel>
    </div>
  </div>
  <div class="container p-4" v-else>
    <p>Sorry, there were no products found 😔...</p>
  </div>
</template>
<script setup>
import ProductCard from "@/components/ProductCard.vue";
import SidePanel from "@/components/SidePanel.vue";
import { ref, reactive, onMounted } from "vue";
import { useUserMedia, useNotification } from "../store/index";
import { storeToRefs } from "pinia";

const mediaStore = useUserMedia();
const notificationStore = useNotification();
const { mediaArray } = storeToRefs(mediaStore);

let showSide = ref(false);
let arrayReady = ref(false);

let userObject = reactive({
  bio: null,
  name: null,
  picture: null,
  media: [],
});

let selectedItem = ref(null);


onMounted(() => {
  getMediaUrls(mediaArray.value);
});


let itemSoldOut = (caption) => {
  const regex = /\s?(sold|out\sof\sstock)\s?/gim;
  return regex.test(caption);
}

let colorPicker = (stringToCheck) => {
  let colors = [];
  const regex = /\s?(white|Yellow|Blue|Red|pink|Green|black|brown|ivory|teal|silver|grey|purple|gray|orange|maroon|coral|aquamarine|coral|fuchsia|crimson|cyan)/gim;
  if (regex.test(stringToCheck)) {
    colors = [...new Set([...stringToCheck.match(regex)])];
    return colors;
  } else {
    return null;
  }
}

let handleClose = () => {
  showSide.value = false;
};

let handleOpen = (dataObject) => {
  showSide.value = true;
  selectedItem.value = dataObject;
};

let filterSizes = (stringToCheck) => {
  let stepOne = filterAlphabeticSizes(stringToCheck)
    ? filterAlphabeticSizes(stringToCheck)
    : filterNumericSizes(stringToCheck);
  return stepOne;
};

let filterNumericSizes = (stringToCheck) => {
  if (stringToCheck) {
    let regex = /size(s)?\s?(:|-|\s)\s?\(?[1-9][0-9]?(,\s?[0-9]*[0-9])+\)?\b/gim;
    let altRegex =
      /size(s)?\s?(:|-|\s)\s?\(?[1-9][0-9]?(\s?-\s?[0-9]*[0-9])+\)?\b/gim;
    let sizes = [];
    if (regex.test(stringToCheck)) {
      sizes = [...stringToCheck.match(regex)];
      let justDigitsRegex = /\D/g;
      let filtered = sizes[0]
        .replace(justDigitsRegex, " ")
        .split(" ")
        .filter((elm) => elm);
      let justDigits = [...new Set([...filtered])];
      return justDigits;
    } else if (altRegex.test(stringToCheck)) {
      sizes = [...stringToCheck.match(altRegex)];
      let justDigitsRegex = /(\D|-)/g;
      let filtered = sizes[0]
        .replace(justDigitsRegex, " ")
        .split(" ")
        .filter((elm) => elm);
      let allSizes = [];
      for (let i = parseInt(filtered[0]); i <= parseInt(filtered[1]); i++) {
        allSizes.push(parseInt(i));
      }
      return allSizes;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

let filterAlphabeticSizes = (stringToCheck) => {
  if (stringToCheck) {
    const letterRegex =
      /(size\s?(:|-|\s))\s?\(?(((\s?xs\s?){1}(\/|,\s?))?|((\s?M\s?){1}(\/|,\s?))?|((\s?L\s?){1}(\/|,\s?)?)?|((\s?S\s?){1}(\/|,\s?)?)?|((\s?XL\s?){1}(\/|,\s?)?)?|((XXL\s?){1}(\/|,\s?)?)?\)?){1,}(\s+|\n+)/gim;
    let sizes = [];
    const regexString = /(size(s)?\s?(:|-|\s))\s?\(?/gim;
    if (letterRegex.test(stringToCheck)) {
      sizes = [...stringToCheck.match(letterRegex)];
      let temp = null;
      let all = sizes[0].replaceAll(regexString, "").split("/");
      if(all.length == 1) {
        temp = all[0].split(",")
      } else {
        temp = all
      }
      return [...new Set([...temp])].filter((el)=> el && el !== ' ');
    }
    return null;
  } else {
    return null;
  }
};

let filterQuestions = (stringToCheck) => {
  if (stringToCheck) {
    let mainRegex =
      /(\$|₦|ngn|NGN|N|#|n)\s?([1-9][0-9]{0,2})(,?\d{3})*(\.\d{1,2})?\s?/gim;
    let altRegex = /([1-9][0-9]{0,2})(,?\d{3})*(\.\d{1,2})?\s?naira/gim;
    let backupCheck1 = /([1-9][0-9]{0,4})(\.\d{1,2})?k\s?/gim;
    let backupCheck =
      /(price\s?(:|-))\s?([1-9][0-9]{0,2})(,?\d{3})*(\.\d{1,})?\s?/gim;
    let prices = [];
    let justDigitsRegex = /(\d|\.)/g;
    if (mainRegex.test(stringToCheck)) {
      prices = [...stringToCheck.match(mainRegex)];
      return prices[0].match(justDigitsRegex).join("");
    } else if (altRegex.test(stringToCheck)) {
      prices = [...stringToCheck.match(altRegex)];
      return prices[0].match(justDigitsRegex).join("");
    } else if (backupCheck.test(stringToCheck)) {
      prices = [...stringToCheck.match(backupCheck)];
      return prices[0].match(justDigitsRegex).join("");
    } else if (backupCheck1.test(stringToCheck)) {
      prices = [...stringToCheck.match(backupCheck1)];
      return prices[0].match(justDigitsRegex).join("");
    } else {
      return null;
    }
  } else {
    return null;
  }
};

let getMediaUrls = async (media) => {
  notificationStore.setLoadingState(true)
  media.map(async (item) => {
    await window.FB.api(
      `/${item.id}`,
      "GET",
      {
        fields:
          "caption,media_url,timestamp,media_product_type,media_type,children,like_count,comments_count",
      },
      function (response) {
        // Insert your code here
        if (response.children) {
          let temp = {
            id: response.id,
            caption: response.caption,
            timestamp: response.timestamp,
            media_type: "CAROUSEL",
            price: filterQuestions(response.caption),
            children: [],
            colors: colorPicker(response.caption),
            sizes: filterSizes(response.caption),
            selectedColor: '',
            selectedSize: '',
            likes: response.like_count,
            comments: response.comments_count
          };
          if(!itemSoldOut(temp.caption) && temp.price){
            response.children.data.map(async (child) => {
            return window.FB.api(
              `/${child.id}`,
              "GET",
              {
                fields: "media_url,timestamp,media_type",
              },
              (response2) => {
                temp.children.push(response2);
              }
            );
          });
            userObject.media.push(temp);
          }
        } else {
          let temp = {};
          (temp.price = filterQuestions(response.caption)),
            (temp.sizes = filterSizes(response.caption));
            temp.colors = colorPicker(response.caption);
          const returnedTarget = Object.assign(temp, response);
          if(!itemSoldOut(response.caption) && temp.price){
            userObject.media.push(returnedTarget);
          }
        }
        setTimeout(()=>{
          notificationStore.setLoadingState(false)
          arrayReady.value = true;  
        }, 10000)
        // if (userObject.media.length === media.length) {
        //   setTimeout(() => {
        //     arrayReady.value = true;
        //   }, 5000);
        // }
        return userObject.media;
      }
    );
  });
};
</script>
