<template>
  <div>
    <div style="display: flex; justify-content:center">
      <md-button @click="load('all')">Tutti</md-button>
      <md-button @click="load('rest')">Pizzerie</md-button>
      <md-button @click="load('bar')">Bar</md-button>
      <md-button @click="load('other')">Altro</md-button>
    </div>

    <div style="display: flex;flex-wrap:wrap;margin-top:30px">
      <li
        v-for="(f, index) in focus"
        :key="index"
        style="margin-right:10px; width: 80%; padding:10px;display:flex;margin: 0 auto"
        :style="{
          'justify-content': index % 2 === 0 ? 'flex-start' : 'flex-end',
        }"
      >
        <template v-if="index % 2 == 0">
          <img
            :src="f.image"
            alt="immagine"
            style="width:200px;height:200px; border-radius: 10px"
            v-if="f.image != undefined"
          />
          <div
            style="width:200px;height:200px;background-color:#ccc; display: flex; justify-content:center; align-items: center; border-radius: 10px"
            v-else
          >
            Immagine non disponibile
          </div>
          <h2 style="align-self:center;margin-left:15px">{{ f.title.it }}</h2>
          <md-button
            style="align-self:center;margin-left:15px"
            @click="openInfo(f)"
            ><md-icon>search</md-icon></md-button
          >
        </template>

        <template v-else>
          <md-button
            style="align-self:center;margin-right:15px"
            @click="openInfo(f)"
            ><md-icon>search</md-icon></md-button
          >
          <h2 style="align-self:center;margin-right:15px">{{ f.title.it }}</h2>
          <img
            :src="f.image"
            alt="immagine"
            style="width:200px;height:200px; border-radius: 10px"
            v-if="f.image != undefined"
          />
          <div
            style="width:200px;height:200px;background-color:#ccc; display: flex; justify-content:center; align-items: center: border-radius: 10px"
            v-else
          >
            Immagine non disponibile
          </div>
        </template>
      </li>
    </div>

    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title style="padding:10px;font-size:25px;text-align:center"
        >Dettaglio Ristorante</md-dialog-title
      >
      <div style="display:flex;width:100%;" v-if="selected">
        <div style="width:50%;height:100%;align-self:flex-start">
          <img :src="selected.image" style="height: 250px; width: 250px" />
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
            <div style="display: flex; flex-direction:column;">
              <div>
                Lascia un voto:
              </div>
              <div style="display:flex; margin-top: 10px">
                <li @click="setStar(1)" style="list-style-type:none">
                  <md-icon
                    style="margin-left:10px"
                    :style="{ color: stars >= 1 ? 'gold' : '' }"
                    >star</md-icon
                  >
                </li>
                <li @click="setStar(2)" style="list-style-type:none">
                  <md-icon
                    style="margin-left:10px"
                    :style="{ color: stars >= 2 ? 'gold' : '' }"
                    >star</md-icon
                  >
                </li>
                <li @click="setStar(3)" style="list-style-type:none">
                  <md-icon
                    style="margin-left:10px"
                    :style="{ color: stars >= 3 ? 'gold' : '' }"
                    >star</md-icon
                  >
                </li>
                <li @click="setStar(4)" style="list-style-type:none">
                  <md-icon
                    style="margin-left:10px"
                    :style="{ color: stars >= 4 ? 'gold' : '' }"
                    >star</md-icon
                  >
                </li>
                <li @click="setStar(5)" style="list-style-type:none">
                  <md-icon
                    style="margin-left:10px"
                    :style="{ color: stars >= 5 ? 'gold' : '' }"
                    >star</md-icon
                  >
                </li>
              </div>
            </div>

            <br />
            <div
              style="width: 100%; display: flex; align-items: center;  justify-content: center;"
            >
              Media: {{ selected.average }} da {{ selected.nvotes }}
              {{ selected.nvotes > 1 ? "voti" : "voto" }}
            </div>
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
import axios from "axios";
import firebase from "firebase";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      search: "",
      items: [],
      focus: [],
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
    this.load(localStorage.getItem("toSearch"));
  },

  methods: {
    load(val) {
      localStorage.setItem("toSearch", val);
      this.search = localStorage.getItem("toSearch");
      const url =
        "https://os.smartcommunitylab.it/comuneintasca-multi/restaurants/TrentoInTasca";
      const data_default = { center: [46.067369, 11.121311], radius: 0.01 };
      axios
        .post(url, data_default)
        .then((res) => {
          this.items = [];
          const populate = res.data.map((item) => this.items.push(item));
          switch (localStorage.getItem("toSearch")) {
            case "all":
              this.focus = this.items;
              break;
            case "rest":
              this.focus = res.data.filter(
                (item) =>
                  item.cat.it[0] == "Ristorante" || item.cat.it[0] == "Pizzeria"
              );
              break;
            case "bar":
              this.focus = res.data.filter((item) => item.cat.it[0] == "Bar");
              break;
            case "other":
              this.focus = res.data.filter(
                (item) =>
                  item.cat.it[0] !== "Bar" &&
                  item.cat.it[0] !== "Ristorante" &&
                  item.cat.it[0] !== "Pizzeria"
              );
              break;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

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
