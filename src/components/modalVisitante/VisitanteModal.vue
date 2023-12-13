<template>
    <div class="background" v-if="open">
        <div class="card">

            <div class="d-flex justify-content-between">
                <span>Cadastrar visita para <span style="color: var(--second-color); font-weight: 600;">{{ pessoaNomeModal }}</span> </span>
                <button type="button" class="btn-close" aria-label="Close" @click="$emit('close')"></button>
            </div>
            <div style="margin-bottom: -15px; color: var(--second-color);">
                <hr>
            </div>
            <div style="display: flex; flex-flow: column;">

                <div style="display:flex; flex-flow: row; padding-top:10px; padding-bottom: 20px; ">
                    <div style="padding: 10px; width: 50%; display: flex; flex-flow: column; ">
                        <div style="display: flex; flex-flow: row; margin-bottom: 15px;">
                            <span>Validade</span>&nbsp;<span style="color: red;">*
                            </span>
                        </div>
                        <div style="display: flex; flex-flow: row;">
                            <div class="mr-3">
                                <input class="form-control d-inline" value="1" type="number" id="dias" size="sm"
                                    style="width:50px;" />
                                <label for="dias" class="d-inline ms-1">Dia(s)</label>
                            </div>
                            <div>
                                <input class="form-control d-inline" type="number" max="24" id="horas" size="sm"
                                    value="0" style="width:50px;" />
                                <label for="horas" class="d-inline ms-1">Hora(s)</label>
                            </div>
                        </div>
                        <div style="display: flex; flex-flow: column; padding-top: 30px;">
                            <div style="display: flex; flex-flow: row; margin-bottom: 15px;">
                                <span>Informações</span>
                            </div>
                            <div>
                                <textarea class="form-control" id="info" rows="2" for="info"></textarea>
                            </div>
                        </div>
                        <div style="display: flex; flex-flow: row; padding-top: 50px; padding-bottom: 20px;">
                            <div class="mr-3">
                               <button @click="iniciaLeitor" 
                                class="btn btn-primary mr-3">
                                <i class="fa-regular fa-address-card"></i>&nbsp;&nbsp;
                                Vincular cartão</button>
                            </div>

                        </div>
                     <!--    <qrcode-stream v-if="cameraAberta && !qrcodeWebcam" @detect="onDetect" style="height: 470px;" /> -->
                    </div>
                    <div style="padding: 10px; width: 50%;display: flex; flex-flow: column; ">
                        <div style="margin-bottom: 15px;">
                            <span>Setor</span>&nbsp;<span style="color: red;">*
                            </span>
                        </div>
                  
                            <div class="input-group mb-2">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">
                                        <i class="fa-solid fa-magnifying-glass"></i>
                                    </span>
                                </div>
                                <input v-model="filtroSetor" type="text" class="form-control" placeholder="Pesquisar"
                                    aria-label="Pesquisa" aria-describedby="basic-addon1" />
                            </div>
                        
                        <div
                            style="display: flex; height: 120px; border: solid; border-color: lightgray; border-radius: 5px; border-width: 1px;">
                            <table class="table-responsive">
                                <tr v-for="item in setoresFiltrados" :key="item.id">
                                    <td>
                                        <input v-model="setoresVisitante" type="checkbox" :value="item.id">
                                    </td>
                                    <td style="max-height: 40px; overflow-y: auto;">
                                        &nbsp;&nbsp;{{ item.nome }}
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>

                <div style="display: flex; flex-flow: row; justify-content: center;">
                    <button type="button" class="btn btn-primary float-end" @click="salvarVisita"><i class="fa-regular fa-circle-check"></i>&nbsp;&nbsp;Salvar
                        </button>
                </div>
            </div>



            <!--  <span>ID da Pessoa: {{ pessoaIDModal }}</span>
          <span>Nome da Pessoa: {{ pessoaNomeModal }}</span>
          <span>CPF da Pessoa: {{ pessoaCPFModal }}</span>
          <span>Email da Pessoa: {{ pessoaEmail }}</span>
          <span>local: {{ localSelecionado }} (esconder)</span>
          -->


        </div>
    </div>
</template>

<script>
import api from '../../services/api';
import Setores from '../../models/Setor'
import setorService from '../../services/setor-service';
export default {
    props: {

        open: 
        {
            type: Boolean,
            required: true
        },

        pessoaIDModal: 
        {
            type: Number,
            required: true,
            default: null,
        },

        pessoaNomeModal: 
        {
            type: String,
            required: true,
            default: null,
        },

        pessoaCPFModal: 

        {
            type: String,
            required: true,
            default: null,
        },

        pessoaEmail: {

            type: String,
            required: true,
            default: null,
        },

        setup(props, { emit }) {
            const closeModal = () => {
                emit('close', false)
            }
            return {
                closeModal
            }
        },

    },

    data() {

        return {
            localSelecionado: '',
            localData: [],
            setores: [],
            filtroSetor: '',
            setoresVisitante: [],
             mostraAlerta: false,
             mostraAlertaWebcam: false,
           
        }

    },

    created() {
        const localSelecionado = localStorage.getItem('localSelecionado');
        if (localSelecionado) {
            this.localSelecionado = localSelecionado;
        }

        console.log('modal 2:', this.localSelecionado, this.pessoaIDModal, this.pessoaNomeModal, this.pessoaCPFModal, this.pessoaEmail);

        
    },

    mounted() {
        this.obterSetores();

        
    },

    computed: {
        setoresFiltrados() {
            return this.setores.filter(setor => {
                const buscaSetor = this.filtroSetor.toLowerCase();
                return (
                    (setor.nome && setor.nome.toLowerCase().includes(buscaSetor))
                );
            });
        },
    },

    methods: {

         async buscaLocal() {
            try {
                const response = await api.get(`/local`);
                this.localData = response.data;
                //console.log('local visitantes', this.localData)
            } catch (error) {
                console.error('Error:', error);
            }
        },

        async alterarLocal() {
            if (this.localSelecionado !== null) {
                try {
                    const response = await api.get(`/local/${this.localSelecionado}/acessos`);
                    this.localData = response.data || [];
                    console.log(this.localData)
                } catch (error) {
                    console.error('Error', error);
                }
            }
        },

        obterSetores() {
            setorService.obterTodos()
                .then((response) => {
                    this.setores = response.data.data.map((p) => new Setores(p));
                })
                .catch(error => {
                    console.log(error)
                    //toaster.show(`Erro ao carregar lista de setores"`, { type: "error" });
                })
        },

        
    }
}
</script>

<style scoped>
.background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(20, 20, 20, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
}

.card {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    width: 600px;
    height: 500px;
    padding: 30px;
    border-radius: 10px;
}
</style>

