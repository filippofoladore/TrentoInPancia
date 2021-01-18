import Vue from "vue";
import App from "./App.vue";
import router from "./routes/index";
import firebase from "firebase"
import store from "./store";
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'


Vue.use(VueMaterial)

Vue.config.productionTip = false;

// da mettere nell'env
const configOptions = {
  apiKey: "AIzaSyAFu6g4JJI_q0cpQdt0ehD39cs5mGDUAto",
  authDomain: "unitn-e5ef6.firebaseapp.com",
  projectId: "unitn-e5ef6",
  storageBucket: "unitn-e5ef6.appspot.com",
  messagingSenderId: "963518849719",
  appId: "1:963518849719:web:79c62baf0b2750d8aaa332",
  measurementId: "G-KVH2YE2VMR"
};

firebase.initializeApp(configOptions);

firebase.auth().onAuthStateChanged(user => {
  store.dispatch("fetchUser", user);
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");