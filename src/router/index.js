import { createRouter, createWebHistory } from 'vue-router'
//Login
import LoginView from "@/views/Login/LoginView.vue"
//Home
import HomeView from '../views/HomeView'
//Senha
import EsqueceuSenhaView from "@/views/Senha/EsqueceuSenhaView"
import ValidarSenhaView from "@/views/Senha/ValidarSenhaView"
import AlterarSenhaView from "@/views/Senha/AlterarSenhaView"
//Acesso
import AcessoView from '@/views/Acesso/AcessoView.vue'
import VisitanteView from '../views/Acesso/VisitanteView.vue'
import VisitanteCadastro from '../views/Acesso/VisitanteCadastro.vue'
import PesquisaView from '@/views/Acesso/PesquisaView.vue'
import AcessoHomeView from '@/views/Acesso/AcessoHomeView.vue'
import AcessoView2Vue from '@/views/Acesso/AcessoView2.vue'
//Permissão
import ColaboradorView from "@/views/Permissão/ColaboradorView"
import ControleDeColaborador from "@/views/Permissão/ControleDeColaborador"




const routes = [
  // Login
  {
    path: '/',
    name: 'Login',
    component: LoginView,
    meta: {
      hideMenu: true
    }
  },
 // Senha
  {
    path: '/alterarSenha',
    name: 'AlterarSenha',
    component: AlterarSenhaView,
   
  },

    {
    path: '/esqueceuSenha',
    name: 'EsqueceuSenha',
    component: EsqueceuSenhaView,
    meta: {
      hideMenu: true
    }
  },

  {
    path: '/validarSenha', 
    name: 'ValidarSenha',
    component: ValidarSenhaView,
    meta: {
      hideMenu: true
    }
  },
  //Home
  {
    path: '/home',
    name: 'HomeView',
    component: HomeView
  },
  //Acesso
  {
    path: '/acesso',
    name: 'AcessoView',
    component: AcessoView
  },
  {
    path: '/acesso2',
    name: 'AcessoView2',
    component: AcessoView2Vue
  },
  {
    path: '/acesso/home',
    name: 'AcessoHomeView',
    component: AcessoHomeView
  },
  {
    path: '/visitante',
    name: 'VisitanteView',
    component: VisitanteView
  },
  {
    path: '/visitante/novo',
    name: 'VisitanteCadastro',
    component: VisitanteCadastro
  },
  {
    path: '/visitante/editar/:id',
    name: 'EditarVisitante',
    component: VisitanteCadastro
  },
  {
    path: '/pesquisa',
    name: 'PesquisaView',
    component: PesquisaView
  },
  //Permissão
  {
    path: '/colaborador',
    name: 'ControleDeColaborador',
    component: ControleDeColaborador,
   
  },
  {
    path: '/colaboradores/novo',
    name: 'AdicionarColaborador',
    component: ColaboradorView,
    title: 'Adicionar Colaborador'   
  },
  {
    path: '/colaboradores/editar/:id',
    name: 'ColaboradorEditar',
    component: ColaboradorView,
    title: 'Editar Colaborador'   
  },
  {
    path: '/colaboradores/excluir',
    name: 'ExcluirColaborador',
    component: ColaboradorView,
    title: 'Excluir Colaborador'   
  },
]

const router = createRouter({
  mode: 'history',
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
