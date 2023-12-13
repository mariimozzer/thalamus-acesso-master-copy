<template>
     <div class="background" v-if="open">
        <div class="card">
          Hello World!!!
          <p>ID da Pessoa: {{ pessoaIDModal }}</p>
          <button @click="$emit('close')">Close</button>
        </div>
      </div>
</template>

<script>
export default {
    props: {

        open: {
            type: Boolean,
            required: true
        },

        pessoaIDModal: {
            type: Number,
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
    color: black;
    width: 500px;
    height: 300px;
    padding: 1rem;
    border-radius: 2rem;
    justify-content: space-between;
}
</style>

