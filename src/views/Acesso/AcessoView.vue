<template>
    <MenuLSGP></MenuLSGP>
    <div class="container">
        <div>
            <br>
            <div class="text-center">
                <h2 class="titulo">Acessos Recentes</h2>
                <hr>
            </div>
            <div class="col-12">

                <div class="form-group input-group" style="width: 100%;">
                    <div class="input-group-prepend">
                        <span class="input-group-text">
                            <i class="fa-solid fa-magnifying-glass"></i>
                        </span>
                    </div>
                    <input v-model="filtroNome" @input="pesquisaComFiltro" type="text" class="form-control"
                        placeholder="Pesquisar acessos" />

                         <button class="btn-filter" @click="pesquisar"><i class="fa-solid fa-filter"></i>&nbsp;&nbsp;Filtro Avançado</button>

                </div>

                <div class="row">
                    <div class="col-12 col-sm-12 col-md-8">
                        <div class="table-responsive">
                            <table class="table table-striped" style="width: 100$;">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Data/Hora</th>
                                        <th style="text-align: center;">Entrada/Saída</th>
                                        <th>Empresa</th>
                                    </tr>
                                </thead>
                                <tbody v-if="acessos.length > 0">
                                    <tr v-for="acesso in acessos" :key="acesso.id">
                                        <td>{{ acesso.nomeCompleto }}</td>
                                        <td>{{ formatarDataHora(acesso.created_at) }}</td>
                                        <!--  <td>{{ acesso.sentido }}</td> -->
                                        <td style="text-align: center;">
                                            <span v-if="acesso.sentido === 'e'" class="material-symbols-outlined"
                                                style="color:#388E3C">login</span>
                                            <span v-if="acesso.sentido === 's'" class="material-symbols-outlined"
                                                style="color: #E53935;">logout</span>
                                        </td>
                                        <td>{{ acesso.local_nome }}</td>
                                    </tr>
                                </tbody>
                                <tbody v-else>
                                    <!-- Exibição de mensagem quando não há acessos -->
                                    <tr>
                                        <td colspan="4" class="text-center">Nenhum acesso registrado</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="col-12 col-sm-12 col-md-4">
                        <div class="row">
                            <div class="col-12 mb-2" style="border: solid 1px lightgray; border-radius: 20px;">

                                <!-- FOTO DA ÚLTIMA PESSOA QUE PASSOU NA CATRACA -->
                                <div class="col-md-12 text-center">
                                    <img class="col-12" v-if="mostraFoto" :src="fotoPessoa" alt="Foto Acesso" />
                                    <!-- IMAGEM DE BACKGROUND QUANDO NÃO HÁ FOTO DE PESSOA -->
                                    <img class="col-12" src="../../../public/img/user-avatar.png" v-if="!mostraFoto"
                                        alt="Foto Acesso" />
                                </div>
                            </div>

                            <div class="col-md-12 acesso-permitido text-center align-middle" v-if="this.mostraFoto">
                                <p>Acesso permitido</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <br><br><br>
</template>

<script>
import moment from 'moment-timezone';
import api, { urlFoto } from '../../services/api';
import WebSocketService from '../../services/websocketservice'
import { createToaster } from "@meforma/vue-toaster";
import MenuLSGP from '@/components/menuLateral/MenuLSGP.vue';
//import Acesso from '../../models/Acesso'

const toaster = createToaster({
    position: "top-right",
    duration: "4000",
});

export default {
    name: 'AcessoView',

    components: {
        MenuLSGP,
    },

    data() {
        return {
            acessos: [],
            message: '',
            fotoPessoa: '',
            mostraFoto: false,
            filtro: '',
            filtroNome: '',
            pageAcesso: 1,
            localSelecionado: null,
            localData: [],
            wsService: new WebSocketService(),
            apiUrl: api.defaults.baseURL,
            urlFoto: urlFoto.caminhoFoto,
            lastPage: null,
            currentPage: null,
            totalPages: null,
            page: 1,
        };
    },

    created() {
        const localSelecionadoStorage = localStorage.getItem('localSelecionado');
        if (localSelecionadoStorage) {
            this.localSelecionado = JSON.parse(localSelecionadoStorage);
            this.alterarLocal();
        }

        this.wsService.addListener(this.handleMessage);
    },

    beforeUnmount() {
        this.wsService.removeListener(this.handleMessage);
        this.wsService.close();
    },

    mounted() {
        this.buscaLocal();
      this.buscaAcessos();
    },

    watch: {
        filtroNome: {
            handler: 'pesquisaComFiltro',
            immediate: true,
        },
    },

    methods: {

         pesquisar() {
            this.$router.push({ name: "PesquisaView" })
        },

       
        //busca acessos sem paginação
        async buscaAcessos() {
            try {
                const response = await api.get(`/local/${this.localSelecionado}/acessos-hoje`);
                this.acessos = response.data;
               console.log('acessos', this.acessos)
            } catch (error) {
                console.error('Erro:', error);
                toaster.show(`Erro ao buscar acessos`, { type: "error" });
            }
        },

        pesquisaComFiltro() {
            const termoPesquisa = this.filtroNome.toLowerCase();

            if (!termoPesquisa) {
                this.buscaAcessos();
                return;
            }

            this.acessos = this.acessos.filter(acesso => {
                return acesso.nomeCompleto.toLowerCase().includes(termoPesquisa);
            });
        },

        replaceIcon() {
            this.results = this.text.replace(this.text, this.newText);
        },

        formatarDataHora(valor) {
            if (valor) {
                const dataHoraGTM3 = moment.utc(valor).tz('America/Sao_Paulo');
                return dataHoraGTM3.format('DD/MM/YYYY HH:mm:ss');
            }
            return '';
        },

        async alterarLocal() {
            if (this.localSelecionado !== null) {
                try {
                    const response = await api.get(`/local/${this.localSelecionado}/acessos`);
                    this.acessos = response.data.data || [];
                    localStorage.setItem('localSelecionado', JSON.stringify(this.localSelecionado));
                } catch (error) {
                    console.error('Error ao alterar empresa', error);
                    toaster.show(`Erro alterar empresa`, { type: "error" });
                }
            }
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

        async handleMessage(event) {
            this.message = event.data;
          //  console.log('event', this.message);

            try {
                const messageData = JSON.parse(this.message);

                if (messageData.mensagem === "acesso_autorizado" && messageData.visitante === 1) {
                    const visitanteInfo = await api.get(`/visitante/${messageData.pessoa_id}`);

                    if (visitanteInfo.data.path_image) {
                        const urlfoto = 'http://192.168.0.5:8000/storage/';

                        this.fotoPessoa = urlfoto + visitanteInfo.data.path_image;
                        this.mostraFoto = true;
                        await this.buscaAcessos(); 
                    }
                }

                if (messageData.mensagem === "acesso_autorizado" && messageData.visitante === 0) {
                    const colaboradorInfo = await api.get(`/pessoa/${messageData.pessoa_id}`);

                    if (colaboradorInfo.data.path_image) {
                        // const urlfoto = 'http://192.168.0.5:8000/storage/';
                        const urlfoto = 'http://192.168.0.6:8000/storage/';

                        this.fotoPessoa = urlfoto + colaboradorInfo.data.path_image;
                        this.mostraFoto = true;
                        await this.buscaAcessos(); 
                    }
                } else if (messageData.mensagem === "acesso_negado") {
                    console.log(messageData.mensagem);
                    this.mostraFoto = false;
                  
                }
            } catch (error) {
                console.error('Mensagem não reconhecida no Acesso', error);
            }

   
        },


    },
};
</script>

<style scoped> 


.card-foto {
     min-height: 500px;
 }

 .foto-ultimo {
     width: 400px;
     height: 400px;
     overflow: hidden;
 }
 .acesso-permitido{
    border-radius: 10px;
    color: green;
    border: 1px solid lightgray;
    font-weight: bold;
 }
</style>
