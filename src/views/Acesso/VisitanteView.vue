<template>
    <MenuLSGP></MenuLSGP>
    <div class="container">
        <div>
            <div class="row">
                <div class="col-sm-12" style="text-align: center;">
                    <h2 class="titulo">Visitante</h2>
                    <hr>
                </div>
            </div>
            <div class="mb-3">
                <div class="col-sm-2">
                        <button type="button" class="button-cadastrar" @click="adicionarPessoa">
                            <i class="fa-solid fa-plus"></i>&nbsp;&nbsp;Cadastrar</button>
                </div>
                <div class="col-lg-6 col-md-12">
                    <div class="input-group mt-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text">
                                <i class="fa-solid fa-magnifying-glass"></i>
                            </span>
                        </div>
                        <input v-model="filtroNome" @input="pesquisaComFiltro" type="text" placeholder="Pesquisar visitante por nome"
                            class="form-control" />
                    </div>
                </div>
            </div>
            <div class="d-flex row mb-3">
            </div>
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>CPF</th>
                            <th>Gênero</th>
                            <th>Celular</th>
                            <th>E-mail</th>
                            <th style="text-align: center;">Nova visita</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody style="text-align: center;">
                        <tr v-for="item in visitantesFiltrados" :key="item.id">
                            <td>{{ item.nomeCompleto }}</td>
                            <td>{{ item.CPF }}</td>
                            <td>{{ mostraGenero(item.sexo) }}</td>
                            <td>{{ item.celular }}</td>
                            <td>{{ item.email }}</td>
                            <td>
                                <div>
                                    <button type="button" class="button-visita" @click="abrirModal(item)"
                                        data-bs-toggle="tooltip" data-bs-placement="top"
                                        title="Clique para cadastrar visita">
                                        <i class="fa-solid fa-plus"></i>
                                    </button>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <button @click="editarPessoa(item)" class="btn btn-color-grey" style="margin-right: 20px;"
                                        data-bs-toggle="tooltip" data-bs-placement="top"
                                        title="Clique para editar visitante">
                                        <i class="fa fa-edit icones-tabela"
                                            style="font-size: 18px; color: var(--first-color); "></i>
                                    </button>
                                    <button type="button" class="btn btn-color-grey" data-bs-toggle="modal"
                                        data-bs-target="#staticBackdrop" data-bs-placement="top"
                                        title="Clique para excluir visitante" @click="excluirPessoa(item.id)">
                                        <i class="fa fa-trash icones-tabela"
                                            style="font-size: 18px; color: var(--first-color);"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <br>
                <nav>
                    <ul class="pagination">
                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                            <a class="page-link" href="#" aria-label="Previous" @click="buscarTodosVisitantes(page - 1)">
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>
                        <li v-for="n in totalPages" :key="n" class="page-item" :class="{ active: n === currentPage }">
                            <a class="page-link" href="#" @click="buscarTodosVisitantes(n)">{{ n }}</a>
                        </li>
                        <li class="page-item" :class="{ disabled: currentPage === totalPages - 1 }">
                            <a class="page-link" href="#" aria-label="Next" @click="buscarTodosVisitantes(totalPages)">
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
        <!-- Modal excluir -->
        <div class="modal fade" id="staticBackdrop" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">Confirmação</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>Confirma a exclusão do registro?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn button-cancel" data-bs-dismiss="modal" style="">Cancelar</button>
                        &nbsp;&nbsp;
                        <button type="button" class="btn btn-primary" @click="confirmarExclusao"
                            data-bs-dismiss="modal">Confirmar</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- fim modal excluir -->
        <!-- modal visitante -->
         <VisitanteModal :open="isOpen" @close="fecharModal" 
         :pessoaIDModal="pessoaIDModal || 0"
         :pessoaNomeModal="pessoaNomeModal || '' " 
         :pessoaCPFModal="pessoaCPFModal || '' "
         :pessoaEmail="pessoaEmail || '' "
         />        
        <!-- fim modal visitante -->
    </div>
</template>

<script>
import { createToaster } from "@meforma/vue-toaster";
import api from '../../services/api';
import MenuLSGP from '@/components/menuLateral/MenuLSGP.vue';
import { ref } from 'vue';
import VisitanteModal from '@/components/modalVisitante/VisitanteModal.vue';

const toaster = createToaster({
    position: "top-right",
});

export default {
    name: 'VisitanteView',
    components: {
        MenuLSGP,
        VisitanteModal,
    },

    setup() {
        const isOpen = ref(false)
        const openModal = () => {
            isOpen.value = true
            return isOpen.value
        }
        return {
            isOpen, openModal
        }
    },

    data() {
        return {
            showModal: false,
            pessoaIDModal: null,
            pessoaNomeModal: null,
            pessoaCPFModal: null,
            pessoaEmail: null,
            filtroNome: '',
            visitantes: [],           
            page: 1,
            lastPage: null,
            currentPage: null,
            totalPages: null,
        }
    },

    created() {
        const localSelecionado = localStorage.getItem('local');
        if (localSelecionado) {
            this.localSelecionado = localSelecionado;
        }
    },

    mounted() {
        this.buscarTodosVisitantes(this.page);
    },

    computed: {
        /* setoresFiltrados() {
            return this.setores.filter(setor => {
                const buscaSetor = this.filtroSetor.toLowerCase();
                return (
                    (setor.nome && setor.nome.toLowerCase().includes(buscaSetor))
                );
            });
        }, */

        visitantesFiltrados() {
            const buscaNome = this.filtroNome.toLowerCase();
            return this.visitantes.filter(item =>
                item.nomeCompleto.toLowerCase().includes(buscaNome)
            );
        },

        paginatedData() {
            const itemsPerPage = '';
            const startIndex = this.currentPage * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            return this.visitantes.slice(startIndex, endIndex);
        },
    },

    methods: {

        adicionarPessoa() {
            this.$router.push({ name: "VisitanteCadastro" })
        },

        editarPessoa(pessoa) {
            this.$router.push({ name: "EditarVisitante", params: { id: pessoa.id } })
        },

        excluirPessoa(id) {
            this.idToDelete = id;
        },

        confirmarExclusao() {
            const id = this.idToDelete;
            const index = this.visitantes.findIndex(item => item.id === id);
            if (index !== -1) {
                api.delete(`/visitante/${id}`)
                    .then(response => {
                        console.log('Response', response);
                        this.buscarTodosVisitantes(this.page);
                    })
                    .catch(error => {
                        console.error(`Error`, error);
                        toaster.show(`Erro. Não foi possível excluir o visitante`, { type: "error" });
                    });
            }
            toaster.show(`Visitante excluído`, { type: "success" });
        },

        async buscarTodosVisitantes(page) {
            try {
                const response = await api.get(`/visitante?page=${page}`);
                this.visitantes = response.data.data;
                this.totalPages = response.data.last_page;
                console.log(this.visitantes)
                //this.visitantes = this.visitantes.sort(this.ordenarPessoas).reverse();
            } catch (error) {
                console.error('Error:', error);
                toaster.show(`Erro ao buscar visitantes`, { type: "error" });
            }
        },

        ordenarPessoas(a, b) {
            return (a.id < b.id) ? -1 : (a.id > b.id) ? 1 : 0;
        },

        mostraGenero(generoAbreviado) {
            if (generoAbreviado === 'f') {
                return 'Feminino';
            } else if (generoAbreviado === 'm') {
                return 'Masculino';
            } else {
                return generoAbreviado;
            }
        },

        async pesquisaVisitantes(searchTerm = '') {
            try {
                const response = await api.get(`/visitante`);
                this.visitantes = response.data.data || [];
                this.lastPage = response.data.last_page || 1;
                this.page = 1;
                this.visitantes = this.visitantes.filter(item => item.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase())
                );
            } catch (error) {
                console.error('Error:', error);
            }
        },

        pesquisaComFiltro() {
            this.pesquisaVisitantes(this.filtroNome);
        },

        abrirModal(pessoa) { 
            this.pessoaIDModal = pessoa.id;
            this.pessoaNomeModal = pessoa.nomeCompleto;
            this.pessoaCPFModal = pessoa.CPF;
            this.pessoaEmail = pessoa.email;
            this.isOpen = true;
        },

        fecharModal() {            
            this.isOpen = false;
        },
    },
}
</script>