<template>
    <div class="background" v-if="open">
        <div class="card">
            <div class="d-flex justify-content-between">
                <span>Cadastrar visita para 
                    <span style="color: var(--second-color); font-weight: 600;">{{ pessoaNomeModal }}</span> 
                   
                </span>
                <button type="button" class="btn-close" aria-label="Close" @click=closeModal></button>
            </div>
            <div style="margin-bottom: -15px; color: var(--second-color);">
                <hr>
            </div>
            <div style="display: flex; flex-flow: column;">
                <div style="display:flex; flex-flow: row;">
                    <div style="width: 45%; display: flex; flex-flow: column; padding: 15px 20px 0px 0px; ">
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
                        <div style="display: flex; flex-flow: column; padding-top: 45px;">
                            <div style="display: flex; flex-flow: row; margin-bottom: 15px;">
                                <span>Informações</span>
                            </div>
                            <div>
                                <textarea class="form-control" id="info" rows="5" for="info"></textarea>
                            </div>
                        </div>
                    </div>
                    <div style="display: flex; flex-flow: column;  padding: 15px 20px 0px 0px;">
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
                            style="display: flex; height: 210px; border: solid; border-color: lightgray; border-radius: 5px; border-width: 1px;">
                            <table class="table-responsive">
                                <tr v-for="item in setoresFiltrados" :key="item.id">
                                    <td>
                                        <input v-model="setoresVisitante" type="checkbox" :value="item.id" class="check2">
                                    </td>
                                    <td style="max-height: 40px; overflow-y: auto;">
                                        &nbsp;&nbsp;{{ item.nome }}
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div style="width:50%; display: flex; flex-flow: column;  padding: 15px 0px 0px 0px;">
                        <div class="mb-2">
                            <button @click="iniciaLeitor" class="btn btn-primary mr-3">
                                <i class="fa-regular fa-address-card"></i>&nbsp;&nbsp;Vincular QR Code</button>
                        </div>
                        <div class="camera" style="border: solid; border-width: 1px; border-color: lightgray; border-radius: 10px;">        
                            <qrcode-stream v-if="cameraAberta && !qrcodeWebcam"  @decode="onDecode" @init="onInit" />
                        </div>
                    </div>
                </div>
                <div style="display: flex; flex-flow: row; justify-content: center; margin-top: 10px;">
                    <button type="button" class="btn btn-primary float-end" @click="salvarVisita">
                        <i v-if="loading" class="fas fa-spinner fa-spin"></i> 
                        <span v-if="!loading">&nbsp;Salvar &nbsp;</span>
                        <span v-if="loading">&nbsp;Salvando... &nbsp;</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from '../../services/api';
import Setores from '../../models/Setor'
import setorService from '../../services/setor-service';
import WebSocketService from '../../services/websocketservice';
import { QrcodeStream } from 'vue-qrcode-reader';
import { createToaster } from "@meforma/vue-toaster";
const toaster = createToaster({
    position: "top-right",
});
export default {
    props: {

        open: {
            type: Boolean,
            required: true,
        },

        pessoaIDModal: {
            type: Number,
            required: true,
            default: null,
        },

        pessoaNomeModal: {
            type: String,
            required: true,
            default: null,
        },

        pessoaCPFModal: {
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
                this.qrodeCartao = '';
               
               
                emit('close', false)
            }
            return {
                
                closeModal  
            
            }
        },

    },

    components: {
        QrcodeStream
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
            wsService: new WebSocketService(),
            qrcodeWebcam: null,
            qrcodeCartao: '',
            cameraAberta: false,      
            dadosVisitaModal: {},
            qrCodeEmail: '',
            loading: false,
        }

    },

    created() {
        const localSelecionado = localStorage.getItem('localSelecionado');
        if (localSelecionado) {
            this.localSelecionado = localSelecionado;
        }

        const local = this.localSelecionado
        const pessoaID = this.pessoaIDModal
        const pessoaNome = this.pessoaNomeModal
        const pessoaCPF = this.pessoaCPFModal
        const pessoaEmail = this.pessoaEmail
        console.log('modal', 'local id:', local, 'id pessoa:', pessoaID, 'nome pessoa:', pessoaNome, 'cpf pessoa:', pessoaCPF, 'email:', pessoaEmail);
         
    },

    mounted() {  
       
        this.obterSetores();
        this.buscaLocal();
        const localSelecionadoStorage = localStorage.getItem('localSelecionado');
        if (localSelecionadoStorage) {
            this.localSelecionado = JSON.parse(localSelecionadoStorage);
            this.alterarLocal();
        }

       
    },

    beforeUnmount() {
        
        this.wsService.removeListener(this.handleMessage);
        this.wsService.close();
        
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
            } catch (error) {
                console.error('Error:', error);
            }
        },

        async alterarLocal() {
            if (this.localSelecionado !== null) {
                try {
                    const response = await api.get(`/local/${this.localSelecionado}/acessos`);
                    this.localData = response.data || [];
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
                    toaster.show(`Erro ao carregar lista de setores"`, { type: "error" });
                })
        },

        iniciaLeitor() {
            this.wsService.addListener(this.handleMessage);

            const chamaLeitorQrcode = JSON.stringify({ 
                mensagem: 'iniciar_leitor',
                local_id: this.localSelecionado
            });

            this.wsService.send(chamaLeitorQrcode);

            console.log('chamando websocket...', chamaLeitorQrcode);

            const timeout = 2000;
            const timeoutId = setTimeout(() => {
              
                console.log('tablet não respondeu, chamando webcam...') 
                this.wsService.removeListener(this.handleMessage);

                this.iniciarLeituraWebcam(); 

            }, timeout);

            this.wsService.addListener(() => {
                clearTimeout(timeoutId);
                this.wsService.removeListener(this.handleMessage);
            });

            this.qrCodeCartao = '';
            this.mostraAlerta = false;
        },


        handleMessage(event) {
            try {
                if (event && event.data) {
                    const message = event.data;
                    const messageData = JSON.parse(message);
                    if (messageData.mensagem === "qr_capturado") {
                        this.qrCodeCartao = messageData.qrcode;
                        console.log('leu no tablet:', this.qrCodeCartao);
                        this.mostraAlerta = true;
                        toaster.show(`Qr code capturado`, { type: "success" });
                        return;
                    }
                } else {
                    console.log('Sem resposta do websocket');
                }
            }
            catch (error) {
                console.error(error);
            }
        },

       iniciarLeituraWebcam() {
          
            if (this.cameraPermissaoConcedida()) {
                this.cameraAberta = true;
            } else {
                console.log('Permissão para a webcam não concedida');
                toaster.show(`Por favor, conceda permissão para acessar a webcam`, { type: "warning" });
            }
        },

        cameraPermissaoConcedida() {
            return navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
        },

        vincularCartaoWebcam() {
            this.onDetect()
        },

       async onDecode(result) {
            try {
                this.qrCodeCartao = '';
                this.mostraAlerta = false;
                console.log('tem qr code?', this.qrCodeCartao);

                this.qrCodeCartao = result;
                console.log('lido na webcam:', this.qrCodeCartao);
                this.cameraAberta = false;

                toaster.show(`Qr code capturado`, { type: "success" });

            } catch(error) {
                console.error('Erro onDecode: ', error)
            }
        },

        async onInit(promise) {
            try {
                await promise
                console.log('oninit ', promise)
            } catch (error) {
                if (error.name === 'NotAllowedError') {
                    this.error = "ERROR: you need to grant camera access permisson"
                    console.log(this.error)
                    toaster.show(`Sem permissão para acessar a webcam`, { type: "error" });
                    
                } else if (error.name === 'NotFoundError') {
                    this.error = "ERROR: no camera on this device"
                    console.log(this.error)
                    toaster.show(`Webcam não encontrada`, { type: "error" });
                    
                } else if (error.name === 'NotSupportedError') {
                    this.error = "ERROR: secure context required (HTTPS, localhost)"
                    console.log(this.error)
                    
                } else if (error.name === 'NotReadableError') {
                    this.error = "ERROR: is the camera already in use?"
                    console.log(this.error)
                    toaster.show(`Webcam está em uso`, { type: "error" });
                    
                } else if (error.name === 'OverconstrainedError') {
                    this.error = "ERROR: installed cameras are not suitable"
                    console.log(this.error)
                    
                } else if (error.name === 'StreamApiNotSupportedError') {
                    this.error = "ERROR: Stream API is not supported in this browser"
                    console.log(this.error)
                    
                }
            }
        },

        salvarVisita() {

            this.loading = true;

            const pessoaID = this.pessoaIDModal;
            const pessoaNome = this.pessoaNomeModal;
            const pessoaEmail = this.pessoaEmail;

            if (this.setoresVisitante.length === 0) {
                toaster.show(`Selecione um setor para a visita.`, { type: "error" });
                this.loading = false;
                return;
            }

            const dias = document.getElementById('dias').value;
            const horas = document.getElementById('horas').value;
            if ((!horas || horas <= 0) && (!dias || dias <= 0)) {
                toaster.show(`Informe a validade da visita`, { type: "error" });
                this.loading = false;
                return;
            }

            if (!pessoaEmail && !this.qrCodeCartao) {
              toaster.show(`Informe o e-mail ou leia um QR Code para a visita.`, { type: "warning" });
              this.loading = false;
                return;
            }

            const dataCapturada = new Date;
            const dataFormatada = dataCapturada.toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }).replace(/[^\d]/g, '');

            this.qrCodeEmail = 'VX' + pessoaID + pessoaNome.replace(/\s/g, '') + this.setoresVisitante.join('') + this.localSelecionado + dataFormatada.replace(/\s/g, '');

            this.dadosVisitaModal = {
                "pessoa_id": pessoaID,
                "qrcode": this.qrCodeEmail,
                "info": document.getElementById('info').value,
                "setor_id": this.setoresVisitante,
                "val_dias": document.getElementById('dias').value,
                "val_horas": document.getElementById('horas').value,
                "local_id": this.localSelecionado,
                "qrcode_fisico": this.qrCodeCartao,
                "base64": this.pessoaImgBase64
            };

            console.log('qrcodemail ', this.qrCodeEmail);

            api.post(`/visita`, this.dadosVisitaModal)
                .then(response => {
                    //console.log(response.data);
                    if (response.data.cod === 1) {
                       toaster.show(`QR Code de visitante inválido. Tente outro QR Code`, { type: "error" });
                        this.qrCodeCartao = '';
                    } else {
                        if (!this.pessoaEmail && this.qrCodeCartao) {
                             this.loading = false
                            toaster.show(`Visita cadastrada`, { type: "success" });
                        } else if (this.pessoaEmail && this.qrCodeCartao) {
                             this.loading = false
                            toaster.show(`Visita cadastrada. QR Code enviado para o e-mail cadastrado`, { type: "success" });
                        } else if (this.pessoaEmail && !this.qrCodeCartao) {
                             this.loading = false
                            toaster.show(`Visita cadastrada. QR Code enviado para o e-mail cadastrado`, { type: "success" });
                        } 
                    }

                    this.setoresVisitante = [];
                    this.qrcodeCartao = '';
                     this.loading = false;
                     this.cameraAberta = false;
                    
                    this.$emit('close');
                     
                })
                .catch(error => {
                    this.loading = false;
                    console.error(error);
                    toaster.show(`Erro ao cadastrar visita`, { type: "error" });

                });     
        },

        closeModal() {
            this.setoresVisitante = [];
            this.cameraAberta = false;
            this.$emit('close');
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
    width: 800px;
    height: 470px;
    padding: 30px;
    border-radius: 10px;
}
.camera {
        overflow: hidden;
        position: relative;
        height: 250px;
        width: 250px;
    }
</style>


