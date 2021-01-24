<template>
  <div>
    <div style="margin-left: 15px;">
      <md-button @click="loadfunc('fav')">Preferiti</md-button>
      <md-button @click="loadfunc('vot')">Voti</md-button>
    </div>

    <template v-if="error == false">
      <div style="display:flex; justify-content:center">
        <h1>
          {{ filter == "fav" ? "Preferiti " : "Voti" }}
          <md-icon v-if="filter == 'fav'" style="color:red">favorite</md-icon>
          <md-icon v-else style="color:gold">star</md-icon>
        </h1>
      </div>

      <div style="display: flex;flex-wrap:wrap;margin-top:30px">
        <li
          v-for="(f, index) in load"
          :key="index"
          style="margin-right:10px; width: 100%; padding:10px;display:flex"
        >
          <template v-if="filter == 'fav'">
            <div
              style="display:flex; width: 100%; justify-content:space-around"
            >
              <p>
                <strong>{{ f.data.restname }} </strong>
              </p>
              <md-button @click="deleteFavorite(f)">
                <md-icon>close</md-icon>
              </md-button>
            </div>
          </template>

          <template v-else>
            <div
              style="display: flex; width: 100%; justify-content: space-around;"
            >
              <p>
                <strong>{{ f.restname }} </strong>
              </p>
              <div style="display:flex; flex-direction:row; align-self:center">
                <li style="list-style-type: none">
                  <md-icon :style="{ color: f.stars >= 1 ? 'gold' : '' }"
                    >star</md-icon
                  >
                </li>
                <li style="list-style-type: none">
                  <md-icon :style="{ color: f.stars >= 2 ? 'gold' : '' }"
                    >star</md-icon
                  >
                </li>
                <li style="list-style-type: none">
                  <md-icon :style="{ color: f.stars >= 3 ? 'gold' : '' }"
                    >star</md-icon
                  >
                </li>
                <li style="list-style-type: none">
                  <md-icon :style="{ color: f.stars >= 4 ? 'gold' : '' }"
                    >star</md-icon
                  >
                </li>
                <li style="list-style-type: none">
                  <md-icon :style="{ color: f.stars >= 5 ? 'gold' : '' }"
                    >star</md-icon
                  >
                </li>
              </div>
            </div>
          </template>
        </li>
      </div>
    </template>

    <template v-else>
      <h3 style="margin-left: 15px">
        Questa è un'area dove visualizzare i tuoi preferiti e i voti. <br />
        <br />
        Non sei loggato, esegui il login per visualizzare!
      </h3>
      <div class="login">
        <router-link to="login"
          ><md-button
            style="background-color:#3DCCF9;color:#fff;border-radius:10px;"
            @click="isOpen = false"
            >Login</md-button
          ></router-link
        >
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import firebase from "firebase";

export default {
  data() {
    return {
      load: [],
      filter: "",
      error: false,
    };
  },
  computed: {
    ...mapGetters({
      user: "user",
    }),
  },
  created() {
    this.loadfunc("fav");
  },

  methods: {
    async loadfunc(v) {
      const db = firebase.firestore();
      this.load = [];
      this.filter = v;
      if (this.user.loggedIn == true) {
        if (v === "fav") {
          await db
            .collection("favorites")
            .where("usermail", "==", this.user.data.email)
            .get()
            .then((d) => {
              d.forEach((d1) => {
                let obj = {
                  id: d1.id,
                  data: d1.data(),
                };
                this.load.push(obj);
              });
            });
        } else {
          await db
            .collection("votes")
            .where("usermail", "==", this.user.data.email)
            .get()
            .then((d) => {
              d.forEach((d1) => {
                this.load.push(d1.data());
              });
            });
        }
      } else {
        this.error = true;
      }
    },
    deleteFavorite(v) {
      const db = firebase.firestore();
      db.collection("favorites")
        .doc(v.id)
        .delete()
        .then(() => {
          this.loadfunc("fav");
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
@media screen and (min-device-width: 320px) and (max-device-width: 480px) {
  .login {
    display: flex;
    justify-content: center;
    margin: 0;
  }
}

.login {
  margin-left: 15px;
}
</style>
