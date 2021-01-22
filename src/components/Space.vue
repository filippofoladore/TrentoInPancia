<template>
  <div>
    <div>
      <md-button @click="loadfunc('fav')">Preferiti</md-button>
      <md-button @click="loadfunc('vot')">Voti</md-button>   
    </div>

  <h1 style="margin-left: 15px;">{{filter == 'fav' ? 'Preferiti' : 'Voti'}}</h1>
     <div style="display: flex;flex-wrap:wrap;margin-top:30px">
            <li v-for="(f,index) in load" :key="index" style="margin-right:10px; width: 100%; padding:10px;display:flex">
              <template v-if="filter == 'fav'">
                 <h2>{{f.restname}}</h2>
              </template>

              <template v-else>
                 <h2>{{f.restname}}</h2>
                 <h3>{{f.stars}}</h3>
              </template>
            </li>
        </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import firebase from "firebase";

export default {
  data() {
    return {
      load: [],
      filter: ''
    };
  },
  computed: {
    ...mapGetters({
      user: "user",
    }),
  },
  created() {this.loadfunc('fav')},

  methods: {
    async loadfunc(v) {
      const db = firebase.firestore();
      this.load = []
      this.filter = v
      if (v === 'fav') {
        await db.collection('favorites').where("usermail", '==', this.user.data.email).get().then((d) => {
          d.forEach((d1) => {this.load.push(d1.data())})
          })
      } else {
        await db.collection('votes').where("usermail", '==', this.user.data.email).get().then((d) => {
          d.forEach((d1) => {this.load.push(d1.data())})
          })
      }
    }
  }
};
</script>
