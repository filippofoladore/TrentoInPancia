<template>
  <div>
    <div class="container">
      <div class="left">
        <h1 style="margin-left:25px;margin-bottom: 40px;">
          Dove si mangia <br />
          <br /><span>stasera?</span>
        </h1>
        <md-autocomplete
          style="background-color:#fff; border: none; border-radius: 10px; padding: 10px 30px; margin: 0 auto; width: 90%; height: 20%"
          v-model="selectedObj"
          :md-options="search"
          :md-open-on-focus="false"
          @md-selected="searchFunc"
          placeholder="Cerca..."
        >
          <label style="margin-left: 10px;height: 100%">Cerca</label>
        </md-autocomplete>
      </div>
      <div class="right"><img src="dinner.svg" scale="2" /></div>
    </div>

    <div class="links-container">
      <div class="links-item">
        <h2>{{ items.length }}</h2>
        <p>Luoghi in cui mangiare.</p>
        <md-button
          style="background-color: #FFAB50; color: #fff;border-radius:10px; margin: 0 auto; padding: 2px 15px;"
          @click="load('all')"
          >Vedi tutti</md-button
        >
      </div>
      <div class="links-item">
        <h2>{{ rest.length }}</h2>
        <p>Ristoranti e pizzerie, l'eccellenza italiana.</p>
        <md-button
          style="background-color: #FFAB50; color: #fff;border-radius:10px; margin: 0 auto; padding: 2px 15px;"
          @click="load('rest')"
          >Vedi tutti</md-button
        >
      </div>
      <div class="links-item">
        <h2>{{ bar.length }}</h2>
        <p>Bar, espresso o aperitivo?</p>
        <md-button
          style="background-color: #FFAB50; color: #fff;border-radius:10px; margin: 0 auto; padding: 2px 15px;"
          @click="load('bar')"
          >Vedi tutti</md-button
        >
      </div>
      <div class="links-item">
        <h2>{{ other.length }}</h2>
        <p>Ristoranti con cui esplorare il mondo</p>
        <md-button
          style="background-color: #FFAB50; color: #fff;border-radius:10px; margin: 0 auto; padding: 2px 15px;"
          @click="load('other')"
          >Vedi tutti</md-button
        >
      </div>
    </div>

    <div class="suggestion">
      <h2 style="font-size:2rem; font-weight: 500">
        Non trovi quello che stavi cercando?
      </h2>
      <h3 style="font-size:1.25rem;  font-weight: 300">
        Niente paura, suggeriscicelo e lo aggiungeremo!
      </h3>
    </div>

    <div class="form-container">
      <div class="img">
        <img
          src="send.svg"
          style="height: 100%; width: 100%; object-fit: contain"
        />
      </div>
      <div class="form">
        <md-field>
          <label>Il tuo nome</label>
          <md-input v-model="name" autocomplete="off"></md-input>
        </md-field>

        <md-field>
          <label>Nome del ristorante</label>
          <md-input v-model="restname" autocomplete="off"></md-input>
        </md-field>

        <md-field>
          <label>Numero di telefono</label>
          <md-input
            v-model="phone"
            autocomplete="off"
            @keypress="isNumber($event)"
          ></md-input>
        </md-field>

        <div v-if="error" style="color:#f44336">{{ error }}</div>

        <md-button
          style="background-color: #D2F6AD; color: #fff; width: 50%; margin: 0 auto; font-weight:900"
          @click="sendSuggestion"
          >Invia</md-button
        >
      </div>
    </div>

    <md-snackbar
      md-position="center"
      :md-duration="snackbarDuration"
      :md-active.sync="showSnackbar"
      md-persistent
    >
      <span>Suggerimento inviato, grazie!</span>
      <md-button class="md-primary" @click="showSnackbar = false"
        >Chiudi</md-button
      >
    </md-snackbar>

    <footer
      style="height: 25vh; background-image: url('Footer.png'); background-repeat: no-repeat;background-size: 100% 100%;"
    >
      <dl
        style="display: flex; width: 50%; height: auto; margin: 0 auto; display: flex; align-self: center; transform: translateY(100px); justify-content: space-around"
      >
        <p><a href="/" style="color: black">Home</a></p>
        <p><a href="/list" style="color: black">Lista</a></p>
        <p><a href="/space" style="color: black">Space</a></p>
        <p><a href="/login" style="color: black">Login</a></p>
        <p><a href="/register" style="color: black">Registrazione</a></p>
      </dl>
      <p
        style="position:absolute; bottom:0; bottom:0px; right:25%; left:50%; margin-right: 10px;"
      >
        © TrentoInPancia - 2021
      </p>
    </footer>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
import firebase from "firebase";

export default {
  data() {
    return {
      items: [],
      bar: [],
      rest: [],
      other: [],
      name: "",
      restname: "",
      phone: "",
      error: null,
      snackbarDuration: 4000,
      showSnackbar: false,
      search: [],
      selectedObj: "",
    };
  },

  created() {
    const url =
      "https://os.smartcommunitylab.it/comuneintasca-multi/restaurants/TrentoInTasca";
    const data_default = { center: [46.067369, 11.121311], radius: 0.01 };
    axios
      .post(url, data_default)
      .then((res) => {
        const populate = res.data.map((item) => this.items.push(item));
        const populateSearch = this.items.map((item) =>
          this.search.push(item.title.it)
        );
        this.rest = res.data.filter(
          (item) =>
            item.cat.it[0] == "Ristorante" || item.cat.it[0] == "Pizzeria"
        );
        this.bar = res.data.filter((item) => item.cat.it[0] == "Bar");
        this.other = res.data.filter(
          (item) =>
            item.cat.it[0] !== "Bar" &&
            item.cat.it[0] !== "Ristorante" &&
            item.cat.it[0] !== "Pizzeria"
        );
      })
      .catch((err) => {
        console.log(err);
      });
  },

  computed: {
    ...mapGetters({
      user: "user",
    }),
  },

  methods: {
    load(val) {
      switch (val) {
        case "all":
          localStorage.setItem("toSearch", val);
          this.$router.replace({ name: "List" });
          break;
        case "rest":
          localStorage.setItem("toSearch", val);
          this.$router.replace({ name: "List" });
          break;
        case "bar":
          localStorage.setItem("toSearch", val);
          this.$router.replace({ name: "List" });
          break;
        case "other":
          localStorage.setItem("toSearch", val);
          this.$router.replace({ name: "List" });
          break;
      }
    },

    async sendSuggestion() {
      const db = firebase.firestore();
      this.error = null;
      if (this.name == undefined || this.name == "") {
        this.error = "Inserisci il tuo nome.";
      } else if (this.restname == undefined || this.restname == "") {
        this.error = "Inserisci un suggerimento.";
      } else if (this.phone == undefined || this.phone == "") {
        this.error = "Inserisci il numero di telefono.";
      } else {
        await db
          .collection("suggestions")
          .doc()
          .set({ name: this.name, restname: this.restname, phone: this.phone })
          .then(() => {
            this.showSnackbar = true;
          });
      }
    },

    isNumber: function(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
      } else {
        return true;
      }
    },

    searchFunc() {
      const it = this.items.filter(
        (item) => item.title.it === this.selectedObj
      );
      localStorage.setItem("search", JSON.stringify(it));
      this.selectedObj = this.selectedObj.replace(/ /g, "_");
      this.$router.replace({ name: "Search", query: { s: this.selectedObj } });
    },
  },
};
</script>

<style>
.container {
  display: flex;
  margin: 0 auto;
  background-color: #c9f2e3;
  border-radius: 10px;
  width: 80%;
  margin-bottom: 30px;
}

.right,
.left {
  width: 50%;
}

.left {
  display: flex;
  flex-direction: column;
  padding: 10px;
  margin-top: 10px;
}

.input {
  background: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 30px;
  margin: 0 auto;
  height: 15%;
  width: 90%;
}

.input:focus {
  outline: none;
}

.links-container {
  width: 70%;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  align-content: center;
  justify-content: space-evenly;
}

.links-item {
  margin-top: 30px;
  width: 400px;
  height: 240px;
  border-radius: 10px;
  background-color: #c9f2e3;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  padding: 10px;
}

.links-item h2 {
  font-size: 30px;
}

.links-item p {
  font-size: 25px;
}

.suggestion {
  display: flex;
  flex-direction: column;
  height: 15vh;
  margin: 0 auto;
  width: 80%;
  margin-top: 70px;
  justify-content: center;
  align-items: center;
}

.form-container {
  display: flex;
  height: 42vh;
  margin: 0 auto;
  background-color: #f8f5f5;
  border-radius: 10px;
  width: 80%;
  margin-top: 40px;
  margin-bottom: 100px;
}

.img,
.form {
  width: 50%;
}

.img {
  padding: 15px;
}

.form {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

@media screen and (min-device-width: 1200px) and (max-device-width: 1600px) and (-webkit-min-device-pixel-ratio: 1) {
  .container {
    height: 42vh;
  }
}

@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) {
  /* .container {height: 42vh} */
}
</style>
