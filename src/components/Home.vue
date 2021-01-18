<template>
<div>
  <div class="container">
    <div class="left">
      <h1 style="margin-left:25px;margin-bottom: 40px;">Dove si mangia <br> <br><span>stasera?</span></h1>
      <input autocomplete="off" autocorrect="off" autocapitalize="off" class="input" placeholder="Cerca ristorante...">
    </div>
    <div class="right"><img src="dinner.svg">
  </div>
  </div>

  <div class="links-container">
    <div class="links-item">
      <h2>79</h2>
      <p>Luoghi in cui mangiare.</p>
      <md-button style="background-color: #FFAB50; color: #fff;border-radius:10px; margin: 0 auto; padding: 2px 15px;" @click="load('all')">Vedi tutti</md-button>
    </div>
    <div class="links-item">
      <h2>49</h2>
      <p>Ristoranti e pizzerie, l'eccellenza italiana.</p>
       <md-button style="background-color: #FFAB50; color: #fff;border-radius:10px; margin: 0 auto; padding: 2px 15px;" @click="load('rest')">Vedi tutti</md-button>
    </div>
    <div class="links-item">
      <h2>20</h2>
      <p>Bar, espresso o aperitivo?</p>
       <md-button style="background-color: #FFAB50; color: #fff;border-radius:10px; margin: 0 auto; padding: 2px 15px;" @click="load('bar')">Vedi tutti</md-button>
    </div>
    <div class="links-item">
      <h2>9</h2>
      <p>Ristoranti con cui esplorare il mondo</p>
       <md-button style="background-color: #FFAB50; color: #fff;border-radius:10px; margin: 0 auto; padding: 2px 15px;" @click="load('other')">Vedi tutti</md-button>
    </div>
  </div>

</div>

</template>

<script>
import { mapGetters } from "vuex";
import axios from 'axios'

export default {
  data() {
    return {
      items: [],
      bar: [],
      rest: [],
      other: []
    }
  },
  created() {
    const url = 'https://os.smartcommunitylab.it/comuneintasca-multi/restaurants/TrentoInTasca'
    const data_default = {"center": [46.067369,11.121311],"radius": 0.01}
    axios.post(url, data_default).then(res => {
      const populate = res.data.map(item => this.items.push(item))
      this.rest = res.data.filter(item => item.cat.it[0] == 'Ristorante' || item.cat.it[0] == 'Pizzeria')
      this.bar = res.data.filter(item => item.cat.it[0] == 'Bar')
      this.other = res.data.filter(item => item.cat.it[0] !== 'Bar' && item.cat.it[0] !== 'Ristorante' && item.cat.it[0] !== 'Pizzeria')   
}).catch(err => {
      console.log(err)
    })
  },
  computed: {
    ...mapGetters({
      user: "user"
    })
  },
  methods: {
    load(val) {
     switch (val) {
      case 'all':
        localStorage.setItem('toSearch', val); 
        this.$router.replace({name: 'List'})
        break;
      case 'rest':
        localStorage.setItem('toSearch', val); 
        this.$router.replace({name: 'List'})
        break;
      case 'bar':
        localStorage.setItem('toSearch', val); 
        this.$router.replace({name: 'List'})
        break;
      case 'other':
        localStorage.setItem('toSearch', val);
        this.$router.replace({name: 'List'})
        break;
     }
  }
  }
};
</script>

<style>
.container {
  display:flex;
  height: 42vh;
  margin: 0 auto;
  background-color: #C9F2E3;
  border-radius:10px;
  width:80%;
  margin-bottom: 30px;
}

.right, .left {
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
  width: 90%

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
    border-radius:10px;
    background-color: #C9F2E3;
    display:flex;
    flex-direction: column;
    align-content: center;
    align-items: center;
    padding: 10px;
  }

  .links-item h2 {
    font-size: 30px
  }

  .links-item  p {
    font-size: 25px;
  }

/*  
  .hscroll {
    display:flex;
    overflow-x: auto;
    flex-wrap: wrap;
    margin-top: 5%;
  }
  .menu-item {
    margin-right:15px;
    margin-bottom: 15px;
    padding: 30px;
    border-radius: 10px;
    width: 30%
  }
  .hscoll::-webkit-scrollbar {
    display: none;
}

  li {list-style: none;} */
</style> 