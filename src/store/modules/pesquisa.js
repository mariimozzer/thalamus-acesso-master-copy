export default {
    state: {
        filtro: {
            inicial: null,
            final: null,
            visitante: null,
            nome: null,
            setor: null,
            local: null,
        },
    },
   mutations: {
 atualizarFiltro(state, novoFiltro) {
        state.filtro.inicial = novoFiltro.inicial;
        state.filtro.final = novoFiltro.final;
        state.filtro.visitante = novoFiltro.visitante;
        state.filtro.nome = novoFiltro.nome;
        state.filtro.setor = novoFiltro.setor;
        state.filtro.local = novoFiltro.local;
    },
},
    actions: {
        atualizarFiltro({ commit }, novoFiltro) {
            commit('atualizarFiltro', novoFiltro);
        },
    },
    getters: {
        getFiltro: state => state.filtro,
    },
};