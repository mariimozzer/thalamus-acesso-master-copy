<template>
    <MenuLSGP>
    </MenuLSGP>
    <div class="container">
        <div class="row mb-3" style="text-align: center;">
            <div class="col-sm-12">
                <h2 class="titulo">{{ modoCadastro ? "Cadastrar" : "Editar" }} Visitante</h2>
                <hr>
            </div>
        </div>
        <div class="d-flex row flex-wrap">
            <!-- FORNMULÁRIO DE CADASTRO DE PESSOA -->
            <div class="col-6 col-md-6 col-sm-12">
                <div style="margin: 10px 0 10px 0;">
                    <div style="display: flex; flex-flow: row;">
                        <label for="nomeCompleto">Nome Completo</label>&nbsp;
                        <p style="color: red;">*</p>
                    </div>
                    <input type="text" id="nomeCompleto" v-model="nomeCompleto" autocomplete="off" required class="form-control">
                    <p v-if="nomeCompletoValidationError" style="color: red;">{{ nomeCompletoValidationError }}</p>
                </div>
                
    
                <div>
                    <label for="cpf">CPF</label>
                    <input type="text" id="CPF" v-model="CPF" @input="validarCPF" class="form-control" v-mask-cpf>
                    <p v-if="cpfValidationError" style="color: red;">{{ cpfValidationError }}</p>
                </div>
                <br>
                <div>
                    <label style="display: flex;" for="email">E-mail
                                <div style="width: min-content; margin-left: 0.5rem;" v-b-tooltip.hover.top title="E-mail será utilizado para envio do QR Code para o visitante">
                                    <i class="fa-solid fa-circle-info"></i>
                                </div>
                            </label>
                    <div class="input-group">
                        <input type="text" id="email" v-model="email" @input="validarEmail" class="form-control">
                        <div class="input-group-append">
                            <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        @{{ selectedDomain || 'Escolha o domínio' }}
                                    </button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" @click="selecioneDominio('gmail.com')">gmail.com</a>
                                <a class="dropdown-item" @click="selecioneDominio('hotmail.com')">hotmail.com</a>
                                <a class="dropdown-item" @click="selecioneDominio('yahoo.com.br')">yahoo.com.br</a>
                            </div>
                        </div>
                    </div>
                    <p v-if="emailValidationError" style="color: red;">{{ emailValidationError }}</p>
                </div>
                <div style="margin: 10px 0 10px 0;">
                    <label for="celular">Celular</label>
                    <input type="text" id="celular" v-model="celular" class="form-control" v-mask-phone.br>
                </div>
                <div style="margin: 10px 0 10px 0;">
                    <label for="info">Informações (Opcional)</label>
                    <textarea type="text" id="info" v-model="info" class="form-control" ></textarea>
                </div>
            
            </div>


            <!-- FOTO -->
            <div class="col-6 col-md-6 col-sm12">
                <div class="mt-2">
                    <label class="mr-3">Foto do visitante</label>
                    <button class="btn btn-primary rounded-pill" fab dark small @click="toggleCamera" v-if="!isCameraOpen">
                                                                                                    Abrir câmera
                                                                                                </button>
    
                    <button class="mx-2 btn btn-primary rounded-pill" fab dark small @click="toggleCamera" v-if="isCameraOpen && !isPhotoTaken">
                                                                                                    Fechar câmera
                                                                                                </button>
    
                    <button class="mx-2 btn btn-primary rounded-pill" fab dark small color="primary" @click="captureImage" v-if="isCameraOpen">
                                                                                                    Tirar foto
                                                                                                </button>
    
                    <button class="mx-2 btn btn-primary rounded-pill" fab dark small color="primary" @click="discardImage" v-if="isCameraOpen">
                                                                                                    Descartar foto
                                                                                                </button>
                </div>
                <!-- avatar / mostra se = fotoPessoa é vazia E não tem foto tirada E a camera esta fechada-->
                <div class="mt-3" v-if="!fotoPessoa && !isPhotoTaken && !isCameraOpen">
                    <img src="../../../public/img/user-avatar.png" alt="Imagem em Base64" style="border-radius: 10px; max-width: 400px; max-height: 500px; border: solid; border-color: lightgrey; border-width: 1px;">
                </div>
                <!-- camera -->
                <div>
                    <div class="mt-3">
                        <video ref="video" width="500" height="400" autoplay v-if="isCameraOpen && !isPhotoTaken"></video>
                        <img :src="imageBase64" alt="" v-if="isPhotoTaken" style="max-width: 100%; max-height: 400px;" />
                    </div>
                </div>
                <!-- mostra a foto salva -->
                <div v-if="fotoPessoa && !isCameraOpen && !isPhotoTaken" class="mt-3 mb-3">
                    <img :src="fotoPessoa" alt="foto visitante" style="border-radius: 10px; max-width: 100%; max-height: 400px;" />
                </div>
            </div>
        </div>
        <div class="d-flex justify-content-end">
            <button @click="cancelarAcao" class="btn button-cancel">Cancelar</button> &nbsp;&nbsp;
            <button @click="salvarVisitante" class=" btn btn-primary">Salvar</button>
        </div>
    </div>
</template>

<script>
import Visitante from '../../models/visitante.model';
import axios from 'axios';
import { createToaster } from "@meforma/vue-toaster";
import api from '../../services/api';
import MenuLSGP from '@/components/menuLateral/MenuLSGP.vue';

const toaster = createToaster({
    position: "top-right",
});

export default {

    name: "VisitanteCadastro",

    components: {
        MenuLSGP,
    },

    data() {
        return {
            visitante: new Visitante({ id_setor: null }),
            modoCadastro: true,
            imageBase64: '',
            isCameraOpen: false,
            isPhotoTaken: false,
            video: null,
            image: null,
            nomeCompleto: '',
            sexo: '',
            CPF: '',
            email: '',
            celular: '',
            path_image: '',
            fotoPessoa: '',
            mostraFoto: false,
            imagePath: '',
            showToast: false,
            fotoAtualizada: null,
            cpfValidationError: null,
            emailValidationError: null,
            selectedDomain: '',
            nomeCompletoValidationError: '',
            info: ''

        }
    },


    watch: {
        CPF: function(newCPF) {
            this.validarCPF(newCPF);
        },

        nomeCompleto: function(newNomeCompleto) {
            this.validarNomeCompleto(newNomeCompleto);
        }

    },

    created() {
        let id = this.$route.params.id;
        if (id) {
            this.modoCadastro = false;
            this.obterPessoaId(id);
        } else {
            this.modoCadastro = true;
        }
    },

    methods: {
        validarNomeCompleto(nomeCompleto) {
            this.nomeCompletoValidationError = null;

            const nomeCompletoArray = nomeCompleto.trim().split(' ');
            if (nomeCompletoArray.length < 2) {
                this.nomeCompletoValidationError = 'Nome completo inválido!';
            }
        },

        validarEmail() {
            this.emailValidationError = null;

            if (!this.selectedDomain || !this.email.trim()) {
                this.emailValidationError = 'E-mail não pode ser vazio';
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;

            const normalizedEmail = this.email
                .split('@')[0]
                .replace(/[\u00C0-\u017F]/g, match => String.fromCharCode(match.charCodeAt(0) - 32))
                .replace(/[^a-zA-Z0-9]/g, '');

            const fullEmail = `${normalizedEmail}@${this.selectedDomain}`;

            if (!emailRegex.test(fullEmail)) {
                this.emailValidationError = 'E-mail inválido';
            }
        },

        selecioneDominio(dominio) {
            this.email = this.email.split('@')[0] + '@' + dominio;
            this.selectedDomain = dominio;
            this.validarEmail();
        },

        validarCPF() {


            this.cpfValidationError = null;

            if (this.CPF == null) {
                return;
            }

            const cleanedCPF = this.CPF.replace(/\D/g, '');

            if (!cleanedCPF) {
                return;
            }

            if (cleanedCPF.length !== 11) {
                this.cpfValidationError = 'CPF deve conter 11 dígitos';
                return;
            }

            // Validate CPF algorithm
            let sum = 0;
            for (let i = 1; i <= 9; i++) {
                sum += parseInt(cleanedCPF.charAt(i - 1)) * (11 - i);
            }

            let remainder = (sum * 10) % 11;
            if (remainder === 10 || remainder === 11) {
                remainder = 0;
            }

            if (remainder !== parseInt(cleanedCPF.charAt(9))) {
                this.cpfValidationError = 'CPF inválido';
                return;
            }

            sum = 0;
            for (let i = 1; i <= 10; i++) {
                sum += parseInt(cleanedCPF.charAt(i - 1)) * (12 - i);
            }

            remainder = (sum * 10) % 11;
            if (remainder === 10 || remainder === 11) {
                remainder = 0;
            }

            if (remainder !== parseInt(cleanedCPF.charAt(10))) {
                this.cpfValidationError = 'CPF inválido';
                return;
            }
        },

        toggleCamera() {

            if (this.isCameraOpen) {
                this.closeCamera();
            } else {
                this.openCamera();
            }
        },

        openCamera() {
            this.isCameraOpen = true;
            this.$nextTick(() => {
                this.video = this.$refs.video;
                // Solicita acesso à webcam
                navigator.mediaDevices
                    .getUserMedia({
                        video: { width: 500, height: 400 }
                    })
                    .then((stream) => {
                        this.video.srcObject = stream;
                    })
                    .catch((error) => {
                        console.error('Erro ao acessar a webcam:', error);
                        toaster.show(`Acesso à webcam bloqueado. Permita o acesso à webcam`, { type: "error" });
                    });
            });
        },

        closeCamera() {
            this.isCameraOpen = false;
            if (this.video && this.video.srcObject) {
                const tracks = this.video.srcObject.getTracks();
                tracks.forEach(track => track.stop());
                this.video.srcObject = null;
            }
        },

        discardImage() {
            this.isPhotoTaken = false;
            this.imageBase64 = '';
            this.openCamera();
        },

        captureImage() {
            const canvas = document.createElement('canvas');
            canvas.width = this.video.videoWidth;
            canvas.height = this.video.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(this.video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob((blob) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    this.imageBase64 = reader.result;
                    this.isPhotoTaken = true;
                    this.fotoAtualizada = true;

                    if (this.modoCadastro || !this.fotoPessoa) {
                        this.imagePath = null;
                    }
                };
                reader.readAsDataURL(blob);
            }, 'image/png');
        },

        obterPessoaId(id) {
            axios.get(`${api.defaults.baseURL}/visitante/${id}`)
                .then(response => {
                    const pessoaData = response.data;
                    this.imagePath = response.data.path_image;
                    this.nomeCompleto = pessoaData.nomeCompleto;
                    this.CPF = pessoaData.CPF;
                    this.sexo = pessoaData.sexo;
                    this.email = pessoaData.email;
                    this.celular = pessoaData.celular;
                    this.mostraFotoPessoa();
                })
                .catch(error => {
                    console.log(error);
                });

        },

        cancelarAcao() {
            this.visitante = new Visitante();
            this.isCameraOpen = false;
            this.imageBase64 = null;
            this.$router.push({ name: "VisitanteView" })

        },

        cadastrarVisitante() {
            let requestData = {
                nomeCompleto: this.nomeCompleto,
                sexo: this.sexo,
                CPF: this.CPF,
                email: this.email,
                celular: this.celular,
            };
            if (this.imageBase64) {
                requestData.base64 = this.imageBase64;
            }
            axios.post(`${api.defaults.baseURL}/visitante`, requestData)
                .then(response => {
                    console.log('Visitante cadastrado', response);
                    this.$router.push({ name: "VisitanteView" });
                })
                .catch(error => {
                    console.error('Erro ao cadastrar visitante:', error);
                    toaster.show(`Erro ao cadastrar visitante`, { type: "error" });
                });

            toaster.show(`Visitante cadastrado`, { type: "success" });
            this.isCameraOpen = false;
        },

        atualizarVisitante() {
            const id = this.$route.params.id;
            if (this.imageBase64) {
                // se houver nova foto, atualiza foto
                axios.put(`${api.defaults.baseURL}/visitante/${id}`, {
                        nomeCompleto: this.nomeCompleto,
                        base64: this.imageBase64,
                        sexo: this.sexo,
                        CPF: this.CPF,
                        email: this.email,
                        celular: this.celular,
                    })
                    .then(response => {
                        console.log('Visitante atualizado:', response);
                        this.$router.push({ name: 'VisitanteView' });
                        toaster.show(`Visitante atualizado`, { type: "success" });
                    })
                    .catch(error => {
                        console.error('Erro ao atualizar visitante:', error);
                        toaster.show(`Erro ao atualizar visitante`, { type: "error" });
                    });
            } else {
                // se nao houver foto nova, atualiza outros campos sem alterar foto
                axios.put(`${api.defaults.baseURL}/visitante/${id}`, {
                        nomeCompleto: this.nomeCompleto,
                        sexo: this.sexo,
                        CPF: this.CPF,
                        email: this.email,
                        celular: this.celular,
                    })
                    .then(response => {
                        console.log('Visitante atualizado:', response);
                        this.$router.push({ name: "VisitanteView" });
                        toaster.show(`Visitante atualizado`, { type: "success" });
                    })
                    .catch(error => {
                        console.error('Erro ao atualizar visitante:', error);
                        toaster.show(`Erro ao atualizar visitante`, { type: "error" });
                    });
            }
            this.closeCamera();
        },

        salvarVisitante() {

            if (!this.nomeCompleto) {
                toaster.show(`Nome Completo não pode ser vazio`, { type: "error" });
                return;
            }

            if (this.modoCadastro) {
                this.cadastrarVisitante();
            } else {
                this.atualizarVisitante();
            }
        },

        mostraFotoPessoa() {
            try {
                if (this.imagePath) {

                    const urlfoto = 'http://192.168.0.5:8000/storage/';
                    this.fotoPessoa = urlfoto + this.imagePath;
                    this.mostraFoto = true;
                } else {
                    console.error('Cadastro sem foto');

                }
            } catch (error) {
                console.error(error);
            }
        },
    }
}
</script>

<style scoped>
.titulo {
    font-size: 25px;
    font-weight: 500;
    margin-top: 10px
}
</style>