import { AnimacaoSequencial, AnimacaoSimultanea } from "../animacoes/animation";
import { apagarCSS2 } from "../animacoes/apagarCSS2";
import { colorirAngulo } from "../animacoes/colorirAngulo";
import { Addition, Equality, Square, Value } from "../equations/expressions";
import { Draggable } from "../inputs/draggable";
import { Hoverable } from "../inputs/hoverable";
import Bracket from "../objetos/bracket";
import { Output } from "../outputs/Output";
import * as THREE from 'three';
import InsideElipse from "../outputs/insideElipse";
import MostrarTexto from "../animacoes/MostrarTexto";

export class CriarTriangulo {


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

        const paralelogramos = fase.objetos;

        this.fase = fase;

        for(const paralelogramo of paralelogramos){

            //Por algum motivo, precisa sempre criar novos outputs

            if(!paralelogramo.hoverable){
                new Hoverable(paralelogramo, fase.camera);
            }

            // if(!this.verificadorDeHover)
                this.criarVerificadorDeHover(paralelogramo, fase.scene, fase.camera);
        }
    }
    
    accept(){

        const paralelogramo    = this.paralelogramoSelecionado
        
        alert(`Poligono ${(paralelogramo)? "encontrado" : "não encontrado"}`);

        return paralelogramo;
    }

    process(){

        // Criar novo output para selecionar lado e arrastar ele

        const fase = this.fase;

        //Pede para o usuário escolher os vértices do triângulo

        const dialogo = ["Clique nos vértices para desenhar o triângulo"]

        fase.animar(fase.animacaoDialogo(dialogo[0]));
        //Cria o triângulo baseado nos vértices escolhidos

        //Criar outputs para todos os vértices
    }



    //OUTPUTS

    criarVerificadorDeHover(paralelogramo, scene, camera){

        const carta = this;

        const verificador = new Output()
                            .setUpdateFunction(function(novoEstado){

                                const paralelogramoRenderizado = paralelogramo.renderedInScene();

                                this.estado.valido = novoEstado.dentro && paralelogramoRenderizado;

                                carta.paralelogramoSelecionado = paralelogramo;

                            })
                            .addInputs(paralelogramo.hoverable);

        this.outputs.push(verificador);

        this.verificadorDeHover = verificador; 
    }

    //Output clicar nos vertices criar Tracejado
    //Cria triângulo e manda de volta para os objetos da fase
    //Adiciona essa carta na pilha quando terminar a execução

    controleGeral(){


        return new Output()
               .setUpdateFunction(function(novoEstado){

                    const estado = this.estado;

                    if(novoEstado.dentro){

                        const vertice = novoEstado.alvo;

                        if(estado.verticesSelecionados.includes(vertice)){

                        }
                    }
               })
               .setEstadoInicial({
                    verticesSelecionados: []
               })
    }

    //Transformar em um output só:
    selecionarVertice(vertice){

        const fase = this;
        
        return new Output()
               .setUpdateFunction(function(estadoNovo){

                    this.estado = {...this.estado, ...estadoNovo};

                    const estado = this.estado;



                    if(estado.clicado){

                        console.log("aquiiii",vertice,fase.informacao.verticesUsados.includes(vertice))


                        const cor = corAleatoria()

                        fase.Configuracao2({
                            VerticesSelecionados: [vertice, ],
                            cor: cor,
                            trianguloAtual: fase.informacao.trianguloAtual+1
                        });

                         vertice.mesh.material = new THREE.MeshBasicMaterial({color:cor});

                    }
               })

        //Funções auxiliares
        //Essa função vai ser usada para escolher a cor do novo triângulo a ser criado
        //Isso inclui tanto seus vértices quanto suas arestas
        function corAleatoria() {   

            const inteiroAleatorio = (fator) => Math.round(Math.random() * fator);

            return [0xff0000,0x00ff00,0x0000ff]
                    .map(cor => inteiroAleatorio(cor))
                    .reduce((a,b) => a + b);
            
        } 
    }

    //Adiciona vértices ao triângulo sendo construido
    adicionarVertice(vertice){

        const fase = this;

        return new Output()
               .setUpdateFunction(function(estadoNovo){

                    this.estado = {...this.estado, ...estadoNovo};

                    const estado = this.estado;

                    const selecionados = fase.informacao.VerticesSelecionados;

                    const cor = fase.informacao.cor;
                
                    //Adiciona vértice ao triangulo a ser formado
                    if(estado.clicado){

                        vertice.mesh.material = new THREE.MeshBasicMaterial({color:cor});

                        fase.Configuracao2b({
                            VerticesSelecionados: [...selecionados, vertice]
                        })
                    }

                    //Três vértices selecionados, então triangulo está pronto para ser desenhado
                    if(selecionados.length >= 3){

                        const triangulo = desenharTriangulo();

                        fase.Configuracao3({
                            trianguloDesenhado: triangulo
                        });

                    }
               })

        function desenharTriangulo(){

            const vertices  = fase.informacao.VerticesSelecionados;

            const posicoes  = vertices.map(vertice => vertice.getPosition())

            //Verifica se está no sentido anti-horário
            const v1 = new THREE.Vector3().copy(posicoes[1]).sub(posicoes[0]);
            const v2 = new THREE.Vector3().copy(posicoes[2]).sub(posicoes[0]);
            const crossProduct = v1.cross(v2);

            if(crossProduct.z < 0){
                const temporario = posicoes[1];
                posicoes[1] = posicoes[0];
                posicoes[0] = temporario
            }

            //Constrói a malha
            const cor      = fase.informacao.cor;
            const geometry = new THREE.BufferGeometry().setFromPoints(posicoes);
            const material = new THREE.MeshBasicMaterial({ color: cor });  

            const trianguloTransparente = new THREE.Mesh(geometry, material);
            
            fase.scene.add(trianguloTransparente);

            const animarAparecendo = apagarObjeto(Objeto.fromMesh(trianguloTransparente))
                                    .reverse()
                                    .setDuration(100)
                                    .setValorFinal(0.5)

            fase.animar(animarAparecendo)

            return trianguloTransparente;
        }
    }

    removerVertice(vertice){
        
    }

    desenharTracejado(vertice, tracejado){

        //Input hover do plano, diz a posição do mouse

        const fase = this;

        return new Output()
               .setUpdateFunction(function(novoEstado){

                    this.estado = {...this.estado, novoEstado};

                    const estado = novoEstado;

                    //Pega tracejado e desenha ele do vértice até a posição do mouse
                    //Desenha um tracejado desse vértice até o ponto

                    tracejado.origem  = vertice.getPosition();

                    tracejado.destino = estado.position;

                    tracejado.update();
               })
    }
}