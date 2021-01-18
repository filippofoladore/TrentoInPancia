<template>
      <div>
    <center>
 <md-card style="padding:15px;margin:10px;border-radius:10px;box-shadow:none">
      <md-card-header style="font-size:1.5em;font-weight:bold">
        Registrazione
      </md-card-header>
      <md-field>
        <label for="">Nome</label>
        <md-input v-model.trim="name" required autofocus></md-input>
      </md-field>
       <md-field>
        <label for="">Email</label>
        <md-input type="email" v-model.trim="email" required></md-input>
      </md-field>
     <md-field>
        <label for="">Password</label>
        <md-input type="password" v-model.trim="password" required></md-input>
      </md-field>
      <div v-if="error" style="color:#f44336">{{error}}</div>
      <md-button @click="submit" type="submit" class="md-primaryt">Registrati</md-button>
    </md-card>
    </center>
  </div>
</template>


<script>
import firebase from "firebase";
export default {
  data() {
    return {
      name: "",
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
      } if (this.name == undefined || this.name == '') {
        this.error = 'Il nome inserito non è valido'
      } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(data => {
          console.log(this.name)
          data.user
            .updateProfile({
              displayName: this.name
            })
            .then(() => {this.$router.replace({name: 'Login'})});
        })
        .catch(err => {
          this.error = err.message;
        });
    }
    }
  }
};
</script>