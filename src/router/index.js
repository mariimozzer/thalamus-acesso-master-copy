
import { createRouter, createWebHashHistory } from 'vue-router'
//import { createRouter, createWebHistory } from 'vue-router'

//Login
import LoginView from "@/views/Login/LoginView.vue"
//Home
import HomeView from '../views/HomeView'
//Senha
import EsqueceuSenhaView from "@/views/Senha/EsqueceuSenhaView"
import ValidarSenhaView from "@/views/Senha/ValidarSenhaView"
import AlterarSenhaView from "@/views/Senha/AlterarSenhaView"
import ConfiguracaoUsuario from '@/views/Senha/ConfiguracaoUsuario.vue'
//Acesso
import AcessoView from '../views/Acesso/AcessoView.vue'
import VisitanteView from '../views/Acesso/VisitanteView.vue'
import VisitanteCadastro from '../views/Acesso/VisitanteCadastro.vue'
import PesquisaView from '../views/Acesso/PesquisaView.vue'
import AcessoHomeView from '../views/Acesso/AcessoHomeView.vue'
//Permissão
import ColaboradorView from "@/views/Permissão/ColaboradorView"
import ControleDeColaboradorRH from "@/views/Permissão/ControleDeColaborador"
import ColaboradorRecepcaoView from "@/views/Permissão/ColaboradorRecepcaoView"


function guardMyroute(to, from, next)
{
 var isAuthenticated= false;
if(localStorage.getItem('LoggedUser'))
  isAuthenticated = true;
 else
  isAuthenticated= false;
 if(isAuthenticated) 
 {
  next(); 
 } 
 else
 {
  next('/'); 
 }
}

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
    beforeEnter: guardMyroute,

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
  {
    path: '/configuracao', 
    name: 'Configuracao',
    component: ConfiguracaoUsuario,
    beforeEnter: guardMyroute,
  },
  //Home
  {
    path: '/home',
    name: 'HomeView',
    component: HomeView,
    // beforeEnter: guardMyroute,

  },
  //Acesso
  {
    path: '/acesso',
    name: 'AcessoView',
    component: AcessoView,
    beforeEnter: guardMyroute,

  },

  {
    path: '/acesso/home',
    name: 'AcessoHomeView',
    component: AcessoHomeView,
    beforeEnter: guardMyroute

  },
  {
    path: '/visitante',
    name: 'VisitanteView',
    component: VisitanteView,
    beforeEnter: guardMyroute
  },
  {
    path: '/visitante/novo',
    name: 'VisitanteCadastro',
    component: VisitanteCadastro,
    beforeEnter: guardMyroute
  },
  {
    path: '/visitante/editar/:id',
    name: 'EditarVisitante',
    component: VisitanteCadastro,
    beforeEnter: guardMyroute

  },
  {
    path: '/pesquisa',
    name: 'PesquisaView',
    component: PesquisaView,
    beforeEnter: guardMyroute

  },
  //Permissão
  {
    path: '/colaboradores-rh',
    name: 'ControleDeColaboradorRH',
    component: ControleDeColaboradorRH,
    beforeEnter: guardMyroute

   
  },
  {
    path: '/colaboradores/novo',
    name: 'AdicionarColaborador',
    component: ColaboradorView,
    title: 'Adicionar Colaborador',
    beforeEnter: guardMyroute
   
  },
  {
    path: '/colaboradores/editar/:id',
    name: 'ColaboradorEditar',
    component: ColaboradorView,
    title: 'Editar Colaborador',
    beforeEnter: guardMyroute
   
  },
  {
    path: '/colaboradores/excluir',
    name: 'ExcluirColaborador',
    component: ColaboradorView,
    title: 'Excluir Colaborador',
    beforeEnter: guardMyroute
   
  },
  {
    path: '/colaboradores',
    name: 'ControleDeColaborador',
    component: ColaboradorRecepcaoView,
    title: 'Colaborador Recepção',
    // beforeEnter: guardMyroute
   
  },


  //  { 
  //   path: '/:pathMatch(.*)*', redirect: '/home' 
  // }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

/* router.beforeEach((to, from, next) => {
  console.log(`Navigating from: ${from.name}`)
  console.log(`Navigating to: ${to.name}`);
 
  next();
}); */


export default router
