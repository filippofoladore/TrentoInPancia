<template>
  <div>
    I miei voti:
    {{ votes }}
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
    };
  },
  computed: {
    ...mapGetters({
      user: "user",
    }),
  },
  created() {
    const db = firebase.firestore();
    const url =
      "https://os.smartcommunitylab.it/comuneintasca-multi/restaurants/TrentoInTasca";
    db.collection("votes")
      .where("usermail", "==", this.user.data.email)
      .get()
      .then((d) => {
        d.forEach((d1) => {
          this.votes.push(d1.data());
          axios
            .post(url, {
              criteria: { id: d1.data().restid },
            })
            .then((res) => {
              console.log(res.data[0].title.it);
            })
            .catch((err) => {
              console.log(err);
            });
        });
      });
  },
};
</script>
