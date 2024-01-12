<template>
    <form @submit.prevent="login" class="container">
            
        <div class="box-login">
            <div style="text-align: center;">
                <img class="logo" src="../../../public/img/thalamus-logo.png" width="150px"><br><br>
            </div>
    
    
            <div class="input-group mb-1">
                <div class="input-group-prepend">
                    <span class="input-group-text"><i class="fa-solid fa-envelope"></i></span>
                </div>
                <input type="text" class="form-control" v-model="email" placeholder="roboflex@roboflex.com.br">
            </div>
    
            <div class="input-group mb-1">
                <div class="input-group-prepend">
                    <span class="input-group-text"><i class="fa-solid fa-lock"></i></span>
                </div>
                <input type="password" class="form-control" v-model="password" placeholder="12345678">
            </div>
            <br>
    
            <div class="form-check ">
                <!-- <input class="form-check-input" type="radio" id="roboflex" value="roboflex" v-model="local">
                <label class="form-check-label" for="roboflex"> Roboflex </label>
                <br>
                <input class="form-check-input" type="radio" id="zontec" value="zontec" v-model="local">
                <label class="form-check-label" for="zontec"> Zontec </label>
                -->
                <ul style="list-style: none;  margin: 0; padding: 0;">
                    <li v-for="local in localData" :key="local.local_nome">
                        <input type="radio" :value="local.id" v-model="localSelecionado" @change="salvarLocalSelecionado" style="margin-right: 5px;" />
                        <span>{{ local.local_nome }}</span>
                    </li>
                </ul>
                <!-- <select v-model="localSelecionado" @change="alterarLocal" class="select" style="border: solid; border-radius: 5px; border-width: 1px; border-color: lightgrey; padding:5px 10px 5px 10px;">
                    <option v-for="local in localData" :key="local.id" :value="local.id">{{ local.local_nome }}</option>
                </select> -->
            </div>
            <br>
            <div class="col-sm-12 text-center">
                <button class="button-default" value="Entrar">
                    <i v-if="loading" class="fas fa-spinner fa-spin"></i> &nbsp;
                    <span v-if="!loading">Entrar</span>
                    <span v-if="loading">Processando...</span>
                </button>
            </div>
            <div class="col-sm-12" style="text-align: center; font-size: 15px;">
                <a @click="EsqueceuSenha()" style="color: rgb(0, 0, 0); text-decoration: underline;">Esqueceu sua senha ?</a>
            </div>
        </div>
    </form>
</template>

<script>
//import axios from 'axios';
import { createToaster } from "@meforma/vue-toaster";
import api from '../../services/api';

const toaster = createToaster({
    position: "top-right",
    duration: "4000",
});

export default {
    name: 'LoginComponent',

    components: {
        
    },

    data() {
        return {
            local: '',
            email: '',
            password: '',
            token: '',
            id: '',
            loading: false,
            user: null,
            localData: [],
            localSelecionado: null,
            apiUrl: api.defaults.baseURL,
        }
    },

   
    mounted() {
        this.buscaLocal();

        if (localStorage.localSelecionado) {
            this.localSelecionado = localStorage.localSelecionado
        }
    },

    watch: {
        local(newLocal) {
            localStorage.localSelecionado = newLocal;
        }
    },

    methods: {
        EsqueceuSenha(){
            this.$router.push({ name: "EsqueceuSenha" })
        },

        login() {

            if(!this.email ){
                toaster.show(`Por favor, preencha o e-mail`, { type: "error" });
            }

            if(!this.password ){
                toaster.show(`Por favor, preencha a senha`, { type: "error" });
            }

            //axios.post('http://192.168.0.6:8000/api/login', {
            api.post('/login', {
                email: this.email,
                password: this.password,
            }).then(
                res => {
                    this.id = res.data.user.id
                    this.user = res.data.user.name
                    sessionStorage.setItem('userName', this.user)
                    sessionStorage.setItem('token', res.data.token)
                    sessionStorage.setItem('LoggedUser', true)

                    this.loading = false
                    this.$router.push({ name: "HomeView" })
                }
            ).catch(
                err => {
                    this.email = ''
                    this.password = ''
                    console.log(err)
                    toaster.show(`E-mail e/ou senha estão incorretos!`, { type: "error" });
                }
            )
        },

       

        async buscaLocal() {
            try {
                const response = await fetch(`${this.apiUrl}/local`);
                this.localData = await response.json();
            } catch (error) {
                console.error('Error ao buscar empresas', error);
                toaster.show(`Erro buscar empresa`, { type: "error" });
            }
        },

        salvarLocalSelecionado() {
            localStorage.setItem('localSelecionado', this.localSelecionado);
        },

    }
}
</script>

<style scoped>
.botaoLogin {
    border: 1px solid;
    border-radius: 20px;
    width: 70%;
}

.box-login {
    max-width: 80%;
    margin-left: auto;
    margin-right: auto;
    border: 2px solid #ddd;
    margin-top: 10px;
    padding: 30px;
    border-radius: 20px;
}

.logo {
    text-align: center;
    /* background-image: url(../../public/img/logo-preta.png); */
    color: var(--first-color);
    padding: 100;
    font-size: 22px;
}

.container {
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    flex-direction: column;
    margin-left: -50px;
    margin-top: -80px;
}

@media (max-width: 768px) {
    .box-login {
        max-width: 50%;
        margin: auto;
        border: 1px solid #ddd;
        margin-top: 10px;
        padding: 30px;
        border-radius: 20px;
    }
    .logo {
        font-size: 18px;
    }
}

@media (max-width: 576px) {
    .box-login {
        max-width: 90%;
        margin: auto;
        border: 1px solid #ddd;
        margin-top: 10px;
        padding: 30px;
        border-radius: 20px;
    }
    .logo {
        font-size: 16px;
    }
}
</style>
  