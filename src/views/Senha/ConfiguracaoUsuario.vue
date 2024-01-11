<template>
    <MenuLSGP></MenuLSGP>

    <div class="container">

        <div>
            <br>
            <h2 class="titulo">Alterar empresa</h2>

        </div>

        <!-- <input class="form-check-input" type="radio" id="roboflex" value="roboflex" v-model="local">
                <label class="form-check-label" for="roboflex"> Roboflex </label>
                <br>
                <input class="form-check-input" type="radio" id="zontec" value="zontec" v-model="local">
                <label class="form-check-label" for="zontec"> Zontec </label>
                
 -->
        <ul style="list-style: none;  margin: 0; padding: 0;">
            <li v-for="local in localData" :key="local.local_nome">
                <input type="radio" :value="local.id" v-model="localSelecionado" @change="salvarLocalSelecionado"
                    style="margin-right: 5px;" />
                <span>{{ local.local_nome }}</span>
            </li>
        </ul>


        <!-- <select v-model="localSelecionado" @change="alterarLocal" class="select" style="border: solid; border-radius: 5px; border-width: 1px; border-color: lightgrey; padding:5px 10px 5px 10px;">
                    <option v-for="local in localData" :key="local.id" :value="local.id">{{ local.local_nome }}</option>
                </select> -->


    </div>

</template>

<script>
import { createToaster } from "@meforma/vue-toaster";
import api from '../../services/api';
import MenuLSGP from '@/components/menuLateral/MenuLSGP.vue';

const toaster = createToaster({
    position: "top-right",
    duration: "4000",
});

export default {
    name: 'ConfiguracaoUsuarioComponent',

    components: {
                MenuLSGP,


    },

    data() {
        return {
            local: '',
          
            id: '',
            loading: false,
           
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
    margin: auto;
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
}</style>
  