<template>
  <div>
    <center>
 <md-card style="padding:15px;margin:10px;border-radius:10px;box-shadow:none">
      <md-card-header style="font-size:1.5em;font-weight:bold">
        Login
      </md-card-header>
      <md-field>
        <label for="">Email</label>
        <md-input type="email" v-model.trim="email" required autofocus></md-input>
      </md-field>
       <md-field>
        <label for="">Password</label>
        <md-input type="password" v-model.trim="password" required></md-input>
      </md-field>
      <div v-if="error" style="color:#f44336">{{error}}</div>
      <md-button @click="submit" type="submit" class="md-primaryt">Login</md-button>
      <p>Non hai un account?
      <router-link to="register"><a href="">Registrati</a></router-link>
      </p>
    </md-card>
    </center>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  data() {
    return {
      email: "",
      password: "",
      error: null
    };
  },
  methods: {
    submit() {
      this.error = null
      if (this.email == undefined || this.email == '') {
        this.error = 'La mail non è valida.'
      } else if (this.password == undefined || this.password == '') {
        this.error = 'La password è vuota.'
      } else {
        firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(data => {
          this.$router.replace({name: 'Home'})
        }).catch(err => {
          this.error = err.message
        })
      }
    }
  }
};
</script>