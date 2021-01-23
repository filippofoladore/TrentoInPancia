<template>
  <div>
    <div style="display: flex;flex-wrap:wrap;width:100%; align-self:center">
      <h1>Ristorante trovato</h1>
    </div>
    <div
      style="display: flex;flex-wrap:wrap;width:70%; margin:0 auto;margin-top: 10%"
    >
      <template>
        <img
          :src="search.image"
          alt="immagine"
          style="width:200px;height:200px;border-radius:10px"
          v-if="search.image != undefined"
        />
        <div
          style="width:200px;height:200px;background-color:#ccc; display: flex; justify-content:center; align-items: center; border-radius: 10px"
          v-else
        >
          Immagine non disponibile
        </div>
        <md-button
          @click="openInfo(search)"
          style="align-self:center; font-size: 1.15rem"
        >
          {{ search.title.it }} <md-icon>search</md-icon>
        </md-button>
      </template>
    </div>

    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title style="padding:10px;font-size:25px;text-align:center"
        >Dettaglio Ristorante</md-dialog-title
      >
      <div style="display:flex;width:100%;" v-if="selected">
        <div style="width:50%;height:100%;align-self:flex-start">
          <img :src="selected.image" style="width:100%; height:100%" />
        </div>
        <div style="width:50%">
          <p style="padding:10px;font-size:20px">
            Nome: {{ selected.title.it }} <br />
            Categoria: {{ selected.cat.it[0] }} <br />
            Telefono: {{ selected.contacts.phone }} <br />
            <md-button style="background-color:#c5e1a5;border-radius:10px">
              Chiama ora <md-icon>phone</md-icon>
            </md-button>
            <md-button
              style="align-self:center;margin-left:15px"
              @click="sendFavorite(selected)"
              ><md-icon
                :style="{ color: selected.favorites === true ? 'red' : '' }"
                >favorite</md-icon
              ></md-button
            >
          </p>

          <div style="display:flex; padding:10px;font-size:18px">
            Lascia un voto: <br />
            <li @click="setStar(1)" style="list-style-type:none">
              <md-icon
                style="margin-left:10px"
                :style="{ color: stars >= 1 ? 'yellow' : '' }"
                >star</md-icon
              >
            </li>
            <li @click="setStar(2)" style="list-style-type:none">
              <md-icon
                style="margin-left:10px"
                :style="{ color: stars >= 2 ? 'yellow' : '' }"
                >star</md-icon
              >
            </li>
            <li @click="setStar(3)" style="list-style-type:none">
              <md-icon
                style="margin-left:10px"
                :style="{ color: stars >= 3 ? 'yellow' : '' }"
                >star</md-icon
              >
            </li>
            <li @click="setStar(4)" style="list-style-type:none">
              <md-icon
                style="margin-left:10px"
                :style="{ color: stars >= 4 ? 'yellow' : '' }"
                >star</md-icon
              >
            </li>
            <li @click="setStar(5)" style="list-style-type:none">
              <md-icon
                style="margin-left:10px"
                :style="{ color: stars >= 5 ? 'yellow' : '' }"
                >star</md-icon
              >
            </li>
            <p>Media: {{ selected.average }} da {{ selected.nvotes }} voti</p>
          </div>
        </div>
      </div>
      <md-dialog-actions>
        <md-button @click="showDialog = false">Chiudi</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-dialog :md-active.sync="showStarConfirm">
      <md-dialog-title style="padding:10px;text-align:center; font-size:25px;"
        >Conferma voto</md-dialog-title
      >
      <div v-if="selected">
        <p style="font-size: 20px">
          Hai votato <strong>{{ selected.title.it }} </strong> con
          {{ stars }} stelle! <br />
          Vuoi inviare il tuo voto?
        </p>
        <md-dialog-actions>
          <md-button @click="sendVote">Conferma</md-button>
          <md-button @click="showStarConfirm = false">Chiudi</md-button>
        </md-dialog-actions>
      </div>
    </md-dialog>

    <md-snackbar
      md-position="center"
      :md-duration="snackbarDuration"
      :md-active.sync="showSnackbar"
      md-persistent
    >
      <span>Non sei loggato, esegui il login per votare un ristorante!</span>
      <md-button class="md-primary" @click="redirectLogin">Login</md-button>
      <md-button class="md-primary" @click="showSnackbar = false"
        >Chiudi</md-button
      >
    </md-snackbar>
  </div>
</template>

<script>
import firebase from "firebase";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      search: {},
      showDialog: false,
      showStarConfirm: false,
      showSnackbar: false,
      selected: null,
      stars: 0,
      snackbarDuration: 4000,
    };
  },
  computed: {
    ...mapGetters({
      user: "user",
    }),
  },
  created() {
    this.search = JSON.parse(localStorage.getItem("search"))[0];
  },

  methods: {
    openInfo(val) {
      this.selected = val;
      const db = firebase.firestore();
      var vueInstance = this;

      //get voti
      db.collection("votes")
        .where("restid", "==", this.selected.id)
        .get()
        .then(function(querySnapshot) {
          var s = 0;
          if (!querySnapshot.empty) {
            querySnapshot.forEach((d) => {
              s += d.data().stars;
            });
            vueInstance.selected.average = (s / querySnapshot.size).toFixed(1);
            vueInstance.selected.nvotes = querySnapshot.size;
            vueInstance.stars = vueInstance.selected.average;

            if (vueInstance.user.loggedIn == true) {
              db.collection("votes")
                .where("usermail", "==", vueInstance.user.data.email)
                .where("restid", "==", vueInstance.selected.id)
                .get()
                .then(function(querySnapshot) {
                  if (!querySnapshot.empty) {
                    querySnapshot.forEach((d) => {
                      vueInstance.selected.docid = d.id;
                    });
                  }
                });
            }
          }
        });

      //get fav
      if (this.user.loggedIn == true) {
        db.collection("favorites")
          .where("restid", "==", this.selected.id)
          .where("usermail", "==", this.user.data.email)
          .get()
          .then(function(querySnapshot) {
            if (!querySnapshot.empty) {
              querySnapshot.forEach((d) => {
                vueInstance.selected.docfav = d.id;
                vueInstance.selected.favorites = true;
              });
            }
          })
          .then(() => {
            this.showDialog = true;
          });
      } else {
        this.showDialog = true;
      }
    },

    setStar(s) {
      this.stars = s;
      this.showStarConfirm = true;
    },

    sendVote() {
      const db = firebase.firestore();
      if (this.user.loggedIn == false) {
        this.showSnackbar = true;
      } else {
        if (this.selected.docid) {
          db.collection("votes")
            .doc(this.selected.docid)
            .update({ stars: this.stars })
            .then(() => {
              this.showStarConfirm = false;
              this.showDialog = false;
            });
        } else {
          db.collection("votes")
            .doc()
            .set({
              stars: this.stars,
              usermail: this.user.data.email,
              restid: this.selected.id,
              restname: this.selected.title.it,
            })
            .then(() => {
              this.showStarConfirm = false;
              this.showDialog = false;
            });
        }
      }
    },

    redirectLogin() {
      this.showSnackbar = false;
      this.showStarConfirm = false;
      this.$router.replace({ name: "Login" });
    },

    sendFavorite(v) {
      const db = firebase.firestore();
      if (this.user.loggedIn == false) {
        this.showSnackbar = true;
      } else {
        if (!v.favorites) {
          db.collection("favorites")
            .doc()
            .set({
              restid: v.id,
              usermail: this.user.data.email,
              restname: this.selected.title.it,
            })
            .then(() => {
              this.showDialog = false;
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          db.collection("favorites")
            .doc(v.docfav)
            .delete()
            .then(() => {
              this.showDialog = false;
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    },
  },
};
</script>

<style scoped>
.md-dialog /deep/ .md-dialog-container {
  padding: 50px;
  border-radius: 10px;
  font-size: 30px;
  text-align: center;
  min-height: 200px !important;
}
</style>
