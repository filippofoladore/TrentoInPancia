<template>
  <div>
    <!-- I miei voti:
    {{ votes }} -->
    <br>
    I miei favorites 
    {{favorites}}
    <p>{{vis}}</p>
    <!-- <li v-for="(f,index) in favorites" :key="index">{{f.restid}} - {{f.name}}</li> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import firebase from "firebase";
import axios from "axios";

export default {
  data() {
    return {
      votes: [],
      favorites: [],
      vis: []
    };
  },
  computed: {
    ...mapGetters({
      user: "user",
    }),
  },
  async created() {
    const db = firebase.firestore();
    const url = "https://os.smartcommunitylab.it/comuneintasca-multi/restaurants/TrentoInTasca";

    // db.collection("votes").where("usermail", "==", this.user.data.email).get().then((d) => {
    //     d.forEach((d1) => {
    //       this.votes.push(d1.data());
    //       // axios.post(url, {criteria: { id: d1.data().restid },})
    //       //   .then((res) => {
    //       //     console.log(res.data[0].title.it);
    //       //   })
    //       //   .catch((err) => {
    //       //     console.log(err);
    //       //   });
    //     });
    //   });

    //vuex state does not persist on page refresh
      await   db.collection('favorites').where("usermail", '==', this.user.data.email).get().then((d) => {
        d.forEach((d1, index) => {
          this.favorites.push(d1.data())
        })
      }).then(() => {
        for (let i = 0; i < this.favorites.length; i++) {
        axios.post(url, {criteria: {id: this.favorites[i].restid}})
          .then(res => {
            console.log(res.data[0].title.it)
            this.favorites[i].name = res.data[0].title.it
              // this.favorites[i].name = res.data[0].title.it
          }).catch(err => {
            console.log(err)
          })
      }
      })

        this.vis = this.favorites



      
  },
};
</script>
