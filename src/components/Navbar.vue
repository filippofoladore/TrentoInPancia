<template>
 <md-toolbar class="md-transparent" md-elevation="0">
   <router-link to="/"  style="flex:1">
    <md-button>
      <md-icon>local_dining</md-icon>
      TIP</md-button>
  </router-link>
      <router-link to="list"><md-button>Lista</md-button></router-link>
      <router-link to="space"><md-button>Space</md-button></router-link>
      <router-link to="about"><md-button>About</md-button></router-link>


       <template v-if="user.loggedIn">
            <div>
              <md-icon>face</md-icon>
              {{user.data.displayName}}</div>
            <md-button  @click.prevent="signOut"> Sign out</md-button>
          </template>

          <template v-else>
              <router-link to="login"><md-button style="background-color:#3DCCF9;color:#fff;border-radius:10px;">Login</md-button></router-link>
          </template>

    </md-toolbar>
</template>

<script>
import { mapGetters } from "vuex";
import firebase from "firebase";
export default {
  computed: {
    ...mapGetters({
      user: "user"
    })
  },
  methods: {
    signOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.replace({
            name: "Home"
          });
        });
    }
  }
};
</script>