import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import firebase from "firebase";
import "firebase/firestore";
import firebaseConfig from "./config/firebase";
import {Plugin} from 'vue-fragment'

Vue.use(Plugin);

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();

import i18n from "./config/i18n";

require("./config/vuetify");
Vue.config.productionTip = false;

new Vue({
    router,
    store,
    mounted() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                db.collection('users').doc(user.uid).onSnapshot(snapshot => {
                    store.commit('setUser', user);
                    if (snapshot.exists) {
                        store.commit('setRole', snapshot.data().role);
                    }
                })
            }
            store.commit('setLoaded', true);
        });
    },
    i18n,
    render: h => h(App)
}).$mount("#app");
