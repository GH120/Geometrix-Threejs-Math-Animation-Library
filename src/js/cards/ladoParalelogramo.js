import { TextoAparecendo } from "../animacoes/textoAparecendo";
import { Addition, Equality, Square, Value } from "../equations/expressions";
import { Hoverable } from "../inputs/hoverable";
import { Output } from "../outputs/Output";

export class LadoParalogramo {


    constructor(whiteboard){

        this.whiteboard = whiteboard;

        this.a = null;
        this.b = null;
        this.c = null;

        this.outputs = [];
    }

    //Quando a carta for arrastada, pega os triângulos da scene
    //Torna eles hoverable e adiciona um output quando estiverem em cima
    trigger(fase){

        const triangulos = fase.objetos;

        for(const triangulo of triangulos){

            //Por algum motivo, precisa sempre criar novos outputs

            if(!triangulo.hoverable){
                new Hoverable(triangulo, fase.camera);
            }

            // if(!this.verificadorDeHover)
                this.criarVerificadorDeHover(triangulo, fase.scene, fase.camera);
        }
    }
    
    accept(){

        const trianguloValido    = this.outputs.filter(output => output.estado.valido);

        const trianguloRetangulo = trianguloValido.length;

        alert(`Triangulo ${(trianguloValido.length)? "encontrado" : "não encontrado"}`);

        alert(`Triangulo ${trianguloRetangulo? "retângulo: ACEITO" : "não retângulo: REJEITADO"}`);

        return trianguloRetangulo;
    }

    process(){

        // Criar novo output para selecionar lado e arrastar ele
        // Retorna uma equação de igualdade dos lados
        // Mudar texto da caixa de diálogos para ensinar jogador
    }

    criarVerificadorDeHover(triangulo, scene, camera){

        const carta = this;

        const verificador = new Output()
                            .setUpdateFunction(function(novoEstado){

                                const trianguloRenderizado = triangulo.renderedInScene();

                                this.estado.valido = novoEstado.dentro && trianguloRenderizado;

                                carta.trianguloSelecionado = triangulo;

                            })
                            .addInputs(triangulo.hoverable);

        this.outputs.push(verificador);

        this.verificadorDeHover = verificador; 
    }

    criarMoverLados(lado, ladoOposto){

        //Criar um suboutput para verificar se sobrevoa sobre um elemento?

        const carta = this;

        const moverLados = new Output()
                           .setUpdateFunction(function(novoEstado){

                                const estado = this.estado;

                                //Tratar seleção do lado principal
                                //Transformar em suboutput?
                                if(novoEstado.alvo == lado){

                                    if(novoEstado.dentro){
                                        estado.mouseSobreLadoPrincipal = true;
                                    }
                                    
                                    if(novoEstado.dentro == false){
                                        estado.mouseSobreLadoPrincipal = false;
                                    }
                                }
                                
                                if(estado.mouseSobreLadoPrincipal && novoEstado.dragging && !estado.arrastando){

                                    estado.arrastando    = true;
                                    estado.ultimaPosicao = lado.getPosition();
                                }

                                //Arrastar lado principal
                                if(estado.arrastando && novoEstado.dragging){
                                    
                                    lado.mesh.position.copy(novoEstado.position);
                                }

                                //Fim do arraste

                                if(estado.arrastando && novoEstado.dragging == false){
                                    
                                    estado.verificar  = true;
                                }

                                //Verificar se está dentro do lado paralelo

                                if(novoEstado.alvo == ladoOposto){
                                        
                                    if(novoEstado.dentro){
                                        estado.ladoOpostoSelecionado = true;
                                    }

                                    if(estado.dentro == false){
                                        estado.ladoOpostoSelecionado = false;
                                    }
                                }

                                if(estado.verificar){

                                    if(estado.ladoOpostoSelecionado == true){
                                        carta.criarEquacao();
                                    }

                                    if(estado.ladoOpostoSelecionado == false){
                                        carta.voltarAoInicio();
                                    }
                                }

                                //Se sim, retornar a equação
                           });
    }


    voltarAoInicio(){
        alert("Falhou");
    }

    criarEquacao(){
        alert("Sucesso");
    }
}