<template>
  <div class="home">

    <nav class="navbar navbar-expand-lg navbar-light bg-dark" style="color: white; text-align: center; margin-left: 0px;">
      <a class="navbar-brand" href="#">
        <img src="https://roboflex.com.br/wp-content/uploads/2023/05/logotipo-roboflex.png" alt="Logo"
          style="width: 75%;">
      </a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="navbar-nav ml-auto">
        <b-nav-item-dropdown right>
          <template v-slot:button-content>
            <i style="color: white;" class="fa-solid fa-circle-user"></i>
            <span class="username" style="color: white;">&nbsp; Olá, {{ userName }}</span>
          </template>
          <b-dropdown-item style="color: black" href="/alterarSenha">
            <span style="color: black;"><i class="fa-solid fa-user-gear"></i>&nbsp; Alterar Senha</span>
          </b-dropdown-item>
          <b-dropdown-item style="color: black" @click="logout">
            <span style="color: black;"><i class="fa-solid fa-right-from-bracket"></i>&nbsp; Logout</span>
          </b-dropdown-item>
        </b-nav-item-dropdown>
      </div>
    </nav>
    <div style="left: 0px;">

      <div class="three-columns" style="justify-content: center; color: white; text-align: center;">
        <div class="divLeft" id="column1" style="width: 33%;">
      
         
             <img  src="../../public/img/home4_4.png">
             <div class="titulo-menu">
              <h1  style="color: red;">Administrativo</h1>
             </div>
             
         
        </div>
        <div class="column" id="column2">
          <br><br>
          <!-- <img  src="../../public/img/fabricaColorido.png"  width="500px"><br><br>
          <h1>Fábrica</h1> -->

        </div>
        <div class="column" id="column3">
          <br><br>
          <!-- <img  src="../../public/img/gestaoColorido.png"  width="500px"><br><br>
          <h1>Gestão</h1> -->

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "Home3Component",
  components: {

  },
  methods: {


    logout() {
      const token = localStorage.getItem('token')
      axios
        .post('http://192.168.0.6:8000/api/logout', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(() => {
          this.$router.push('/');
          localStorage.removeItem('token')
          localStorage.removeItem('userName')
        })
        .catch(error => {
          console.error('Logout failed:', error);
        });
    },

    closeContent() {
      this.activeMenu = null;
    },
  },

  created() {
    this.userName = localStorage.getItem('userName')

  }
}
</script>

  
<style scoped>
.divLeft {
    width: 49.5%;
    height: 949px;
    float: left;
    position: relative;
}
.home {
  position: fixed;
  bottom: 0;
  left: 0;
}


nav {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  left: 0;
}

.three-columns {
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: space-between center;
  align-items: center;
  margin-left: 0px;
}

.column:hover {
  background-color: #000000;
  box-shadow: 0 0 1000px rgb(0, 0, 0);
  cursor: pointer;
  opacity: 1;
  filter: grayscale(0%);
}

#column1:hover {
  background-color: #000000;
  box-shadow: 0 0 1000px rgb(255, 255, 255);
  cursor: pointer;
  opacity: 1;
  filter: grayscale(0%);
}

#column2:hover {
  background-color: #000000;
  box-shadow: 0 0 1000px rgb(0, 0, 0);
  cursor: pointer;
  opacity: 1;
  filter: grayscale(0%);
}

#column3:hover {
  background-color: #000000;
  box-shadow: 0 0 1000px rgb(0, 0, 0);
  cursor: pointer;
  opacity: 1;
  filter: grayscale(0%);
}

.column {
  flex: 1;
  height: 100%;
  margin: 0px;
}

#column1 {
  border: 10px solid none;
  background-color: var(--first-color);
 /*  background-image: url(../../public/img/home4_4.png); */
  background-repeat: no-repeat;
  filter: grayscale(100%);
  transition: filter 0.3s ease;
}

#column2 {
  border: 10px solid none;
  background-color: #393D40;
  background-image: url(../../public/img/home4_5.png);
  background-repeat: no-repeat;
  filter: grayscale(100%);
  transition: filter 0.3s ease;
  /* opacity: 0.2; */
}

#column3 {
  border: 10px solid none;
  background-color: #515558;
  background-image: url(../../public/img/home4_6.png);
  background-repeat: no-repeat;
  filter: grayscale(100%);
  transition: filter 0.3s ease;
  /* opacity: 0.2; */
}
</style>