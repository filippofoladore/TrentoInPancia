<template>
  <md-toolbar class="md-transparent" md-elevation="0">
    <router-link to="/" style="flex:1">
      <button class="btn btn-3"><span>TrentoInPancia</span></button>
    </router-link>
    <router-link to="list"><md-button>Lista</md-button></router-link>
    <router-link to="space"><md-button>Space</md-button></router-link>
    <router-link to="about"><md-button>About</md-button></router-link>

    <template v-if="user.loggedIn">
      <div>
        <md-icon>face</md-icon>
        {{ user.data.displayName }}
      </div>
      <md-button @click.prevent="signOut"> Sign out</md-button>
    </template>

    <template v-else>
      <router-link to="login"
        ><md-button
          style="background-color:#3DCCF9;color:#fff;border-radius:10px;"
          >Login</md-button
        ></router-link
      >
    </template>
  </md-toolbar>
</template>

<script>
import { mapGetters } from "vuex";
import firebase from "firebase";
export default {
  computed: {
    ...mapGetters({
      user: "user",
    }),
  },
  methods: {
    signOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.replace({
            name: "Home",
          });
        });
    },
  },
};
</script>

<style scoped>
.btn {
  display: inline-block;
  position: relative;
  background: none;
  letter-spacing: 1px;
  border: none;
  color: #232323;
  font-size: 1.15rem;
  cursor: pointer;
  margin: 20px 30px;
}
span {
  display: block;
  padding: 15px 60px;
}
.btn::before,
.btn::after {
  content: "";
  width: 0;
  height: 2px;
  position: absolute;
  transition: all 0.2s linear;
  background: #80eec6;
}

span::before,
span::after {
  content: "";
  width: 2px;
  height: 0;
  position: absolute;
  transition: all 0.2s linear;
  background: #80eec6;
}
.btn:hover::before,
.btn:hover::after {
  width: 100%;
}
.btn:hover span::before,
.btn:hover span::after {
  height: 100%;
}
.btn-3::after {
  left: 0;
  bottom: 0;
  transition-delay: 0.6s;
}
.btn-3 span::after {
  transition-delay: 0.4s;
  right: 0;
  bottom: 0;
}
.btn-3::before {
  right: 0;
  top: 0;
  transition-delay: 0.2s;
}
.btn-3 span::before {
  transition-delay: 0s;
  left: 0;
  top: 0;
}

.btn-3:hover::after {
  transition-delay: 0s;
}
.btn-3:hover span::after {
  transition-delay: 0.2s;
}
.btn-3:hover::before {
  transition-delay: 0.4s;
}
.btn-3:hover span::before {
  transition-delay: 0.6s;
}
</style>
