import { createStore } from 'vuex';
import pesquisa from './modules/pesquisa';

export default createStore({
    modules: {
        pesquisa,
    },
});