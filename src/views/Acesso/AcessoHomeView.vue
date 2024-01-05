<template>
    <MenuLSGP></MenuLSGP>
    <div class="container">
        <div class="d-flex justify-content-center">
            <img src="../../../public/img/acesso.png" alt="" >
        </div>
        
    </div>
</template>

<script>

import MenuLSGP from '@/components/menuLateral/MenuLSGP.vue';



export default {
    name: 'AcessoHomeView',

    components: {
        MenuLSGP,
    },
   
};
</script>

<style scoped>
img{
    opacity: 15%;
   object-fit:fill;
   height: 60vh;
} 

</style>