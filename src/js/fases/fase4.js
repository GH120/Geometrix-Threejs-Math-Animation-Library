import {Draggable} from '../inputs/draggable';
import {Hoverable} from '../inputs/hoverable';
import {MostrarAngulo} from '../outputs/mostrarAngulo';
import { ColorirIsoceles } from '../outputs/colorirIsoceles';
import { MostrarTipo } from '../outputs/mostrarTipo';
import  MoverVertice  from '../outputs/moverVertice';
import { MostrarBissetriz } from '../outputs/mostrarBissetriz';
import { Clickable, MultipleClickable } from '../inputs/clickable';
import {CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';
import {TGALoader} from 'three/examples/jsm/loaders/TGALoader';
import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import FixarAoCirculo from '../outputs/fixarAoCirculo';



import * as dat from 'dat.gui';
import * as THREE from 'three';
import { TextoAparecendo } from '../animacoes/textoAparecendo';
import Animacao, { AnimacaoSequencial, AnimacaoSimultanea, animacaoIndependente } from '../animacoes/animation';
import { colorirAngulo } from '../animacoes/colorirAngulo';
import { Tracejado } from '../objetos/tracejado';
import MostrarTracejado from '../animacoes/mostrarTracejado';
import { Divisao } from '../animacoes/divisao';
import { Triangle } from '../objetos/triangle';
import Bracket from '../objetos/bracket';
import Pythagoras from '../equations/pythagoras';
import { Addition, Equality, Value, Variable, VariableMultiplication } from '../equations/expressions';
import Circle from '../objetos/circle';
import DesenharMalha from '../animacoes/desenharMalha';
import RelogioGLB from '../../assets/Relogio.glb'
import { Angle } from '../objetos/angle';
import ColorirOnHover from '../outputs/colorirOnHover';
import { Fase } from './fase';
import { apagarObjeto } from '../animacoes/apagarObjeto';
import MostrarTexto from '../animacoes/MostrarTexto';
import MoverTexto from '../animacoes/moverTexto';
import { apagarCSS2 } from '../animacoes/apagarCSS2';
import ElementoCSS2D from '../objetos/elementocss2d';
import JuntarEquacoes from '../outputs/juntarEquacoes';
import { Output } from '../outputs/Output';
import ResolverEquacao from '../outputs/resolverEquacao';
  

export class Fase4 extends Fase{

    constructor(){
    
        super();

        this.setupTextBox();

        this.progresso = 0;
        this.setupObjects();
        this.createInputs();
        this.createOutputs();
        this.aula1();

        this.text.position.copy(new THREE.Vector3(0,3.7,0))

        this.problema = 10

        this.debug = true;
    }

    //Objetos básicos
    setupObjects(){

        const circulo = new Circle(new THREE.Vector3(0,0,0), 3).addToScene(this.scene);

        this.circulo = circulo;

        const pontoDoCirculo1 = new Circle(new THREE.Vector3(0,3,0), 0.1, 0.2);
              pontoDoCirculo1.material = new THREE.MeshBasicMaterial({color:0x960000});

        this.ponto1 = pontoDoCirculo1;


        const pontoDoCirculo2          = new Circle(new THREE.Vector3(3*Math.sin(Math.PI*0.3),3*Math.cos(Math.PI*0.3),0), 0.1, 0.2);
              pontoDoCirculo2.material = new THREE.MeshBasicMaterial({color:0x960000});

        this.ponto2 = pontoDoCirculo2;


        this.angle = new Angle([circulo, this.ponto2, this.ponto1]).render();


        const tracejadoPonto1 = new Tracejado(circulo.position, this.ponto1.position);

        this.ponto1.tracejado = tracejadoPonto1;


        const tracejadoPonto2 = new Tracejado(circulo.position, this.ponto2.position);

        this.ponto2.tracejado = tracejadoPonto2;

        //Atualizar o ponteiro como um todo ao mover a ponta dele
        const criarAtualizadorDeObservers = (ponto, tracejado) => {

            //Função para dar update em todos os observadores dependetes do ponto
            ponto.updateObservers = () => {
                tracejado.destino = ponto.position.clone().multiplyScalar(0.95);
                ponto.update(); //Refatorar circulo, update deve ser apenas update
                tracejado.update();
                this.angle.update()
                this.mostrarAngulo.update({dentro:true})
            }
        }

        criarAtualizadorDeObservers(this.ponto1, this.ponto1.tracejado);
        criarAtualizadorDeObservers(this.ponto2, this.ponto2.tracejado);
    }

    //Objetos temporários ou secundários
    setupObjects2(){

        //Cria 360 tracejados que servirão como os graus no círculo
        const getPoint = angulo => new THREE.Vector3(3.1*Math.sin(angulo), 3.1*Math.cos(angulo), 0);

        const tracejados = new Array(360)
                                    .fill(0)
                                    .map((e,index) => index*Math.PI/180)
                                    .map(angulo => new Tracejado(getPoint(angulo).multiplyScalar(0.95), getPoint(angulo),0.01))
        
        tracejados.map(tracejado => tracejado.material = new THREE.MeshBasicMaterial({color:0x000000}))

        this.tracejados = tracejados;
    }

    aula1(){

        const dialogo = ["O círculo é uma das figuras geométricas mais básicas",
                         "Ele tem um centro",
                         "e um raio",
                         "Como pode ver, todos os pontos no círculo estão na mesma distância do raio",
                         "Então a única diferença entre dois pontos é o giro entre eles",
                         "Esse giro é o chamado ângulo,",
                         "Por padrão, dividimos o círculo em 360 partes, em graus",
                         "e o ângulo é medido neles.",
                         "Quantos graus tem uma hora no relógio?"]

        //Desenha o círculo
        const circulo         = this.circulo;
        const desenharCirculo = new DesenharMalha(circulo, this.scene)
                                    .setDuration(300)
                                    .setOnTermino(() => null);


        //Efeito de popIn do position
        const position           = new Circle(new THREE.Vector3(0,0,0), 0.1, 0.2);
              position.material  = new THREE.MeshBasicMaterial({color:0x960000});
        const circuloCrescendo = this.circuloCrescendoAnimacao(position);

        //Animações de mostrarTexto de cada diálogo
        const animacoes = dialogo.map(texto => new TextoAparecendo(this.text.element).setOnStart(() => this.changeText(texto)));

        const anim1 = new AnimacaoSimultanea(animacoes[0], desenharCirculo);
        const anim2 = new AnimacaoSimultanea(animacoes[1], circuloCrescendo);
        const anim3 = this.thirdDialogue(animacoes[2], position, circulo);
        const anim4 = animacoes[3].setValorFinal(100);
        const anim5 = this.fifthDialogue( animacoes[4].setValorFinal(120), circulo);
        const anim6 = animacoes[5];
        const anim7 = this.seventhDialogue(animacoes[6]);
        const anim8 = this.eigthDialogue(animacoes[7].setValorFinal(120).setDuration(200)).setDelay(50);
        const anim9 = this.ninthDialogue(animacoes[8]);

        //Quando começar a animação 4, ativa os controles para mover o ponteiro
        anim4.setOnTermino(() => this.Configuracao1());

        anim9.setOnTermino(() => this.Configuracao1());

        const animacaoPrincipal = new AnimacaoSequencial(anim1,anim2,anim3,anim4,anim5,anim6,anim7,anim8,anim9);

        animacaoPrincipal.setNome("Execução Principal");

        this.animar(animacaoPrincipal);

    }

    //Animações junto com os diálogos
    thirdDialogue(dialogue){

        const pontoDoCirculo = this.ponto1;
        const tracejado      = this.ponto1.tracejado;
        const criarPonto     = this.circuloCrescendoAnimacao(pontoDoCirculo);

        const moverPonto = (posicaoFinal) => new Animacao(pontoDoCirculo)
                                        .setValorInicial(0)
                                        .setValorFinal(2*Math.PI)
                                        .setInterpolacao((inicial, final, peso) => inicial*(1-peso) + final*peso)
                                        .setDuration(200)
                                        .setCurva(x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
                                        .setUpdateFunction((angulo) => {
                                            const posicao = new THREE.Vector3(3*Math.sin(angulo), 3*Math.cos(angulo), 0)
                                            pontoDoCirculo.position = posicao;
                                            tracejado.destino = posicao.clone().multiplyScalar(0.95);
                                            pontoDoCirculo.update(); //Refatorar circulo, update deve ser apenas update
                                            tracejado.update();
                                        })
        
        const demonstrarRaio = new AnimacaoSequencial(
                                    new AnimacaoSimultanea(criarPonto, new MostrarTracejado(tracejado, this.scene)),
                                    moverPonto(new THREE.Vector3(3,0,0)).setOnStart(() => tracejado.addToScene(this.scene))
                                )

        return new AnimacaoSimultanea(dialogue, demonstrarRaio)
    }

    fifthDialogue(dialogue){

        const pontoDoCirculo = this.ponto2;
        const tracejado      = this.ponto2.tracejado;
        const angle          = this.angle;

        this.mostrarAngulo.addToScene(this.scene); //Mostrar ângulo agora visível

        const criarPonto = this.circuloCrescendoAnimacao(pontoDoCirculo);
        
        //Consertar desenhar malha do angulo
        const desenharAngulo = new DesenharMalha(angle, this.scene)

        const moverPonto = (posicaoFinal) => new Animacao(pontoDoCirculo)
                                        .setValorInicial(Math.PI*0.3)
                                        .setValorFinal(Math.PI*2/3)
                                        .setInterpolacao((inicial, final, peso) => inicial*(1-peso) + final*peso)
                                        .setDuration(200)
                                        .setCurva(x => {
                                            const n1 = 7.5625;
                                            const d1 = 2.75;
                                            
                                            if (x < 1 / d1) {
                                                return n1 * x * x;
                                            } else if (x < 2 / d1) {
                                                return n1 * (x -= 1.5 / d1) * x + 0.75;
                                            } else if (x < 2.5 / d1) {
                                                return n1 * (x -= 2.25 / d1) * x + 0.9375;
                                            } else {
                                                return n1 * (x -= 2.625 / d1) * x + 0.984375;
                                            }
                                            }
                                        )
                                        .setUpdateFunction((angulo) => {
                                            const posicao = new THREE.Vector3(3*Math.sin(angulo), 3*Math.cos(angulo), 0)
                                            pontoDoCirculo.position = posicao;
                                            pontoDoCirculo.update(); //Refatorar circulo, update deve ser apenas update
                                            pontoDoCirculo.updateObservers();
                                        })
                                        .setOnTermino(() => {
                                            const texto = this.createMathJaxTextBox("Ponteiro~arrastável", 
                                                                                    pontoDoCirculo.position.clone()
                                                                                                           .add(new THREE.Vector3(1, 0, 0))
                                                                                                           .toArray(), 
                                                                                    5           
                                                                                  );

                                            const mostrarTexto = new MostrarTexto(texto)
                                                                .setCurva(x => {
                                                                    x = 1 - Math.abs(1 - 2*x)

                                                                    return -(Math.cos(Math.PI * x) - 1) / 2
                                                                })
                                                                .setDelay(50)
                                                                .setOnStart(() => {
                                                                    this.scene.add(texto);
                                                                    this.ponto2.hoverable.observers.map(observer => observer.update({dentro:true}));
                                                                 })
                                                                .setOnTermino(() => {
                                                                    this.scene.remove(texto);
                                                                    this.ponto2.hoverable.observers.map(observer => observer.update({dentro:false}))
                                                                });

                                            this.animar(mostrarTexto)

                                        })
        
        const demonstrarRaio = new AnimacaoSequencial(
                                    new AnimacaoSimultanea(criarPonto, new MostrarTracejado(tracejado, this.scene)),
                                    desenharAngulo,
                                    moverPonto(new THREE.Vector3(3,0,0)).setOnStart(() => tracejado.addToScene(this.scene))
                                )

        return new AnimacaoSimultanea(dialogue, demonstrarRaio)
    }

    seventhDialogue(dialogue){

        const scene = this.scene;

        this.setupObjects2(); //Criando os tracejados para serem usados nos graus

        const tracejados = this.tracejados;

        //Adiciona um por um os retângulos dos graus
        const sequencial = new Animacao(tracejados)
                           .setValorInicial(0)
                           .setValorFinal(360)
                           .setDuration(360)
                           .setInterpolacao((a,b,c) => a*(1-c) + b*c)
                           .setUpdateFunction(function(index){
                                const inicio = (this.counter)? this.counter : 0;

                                for(let i = inicio; i < index; i++){

                                    const tracejado = this.objeto[i];
                                    tracejado.addToScene(scene);
                                    tracejado.update();
                                }

                                this.counter = Math.ceil(index);
                           })

        //Transformar isso em apenas uma animação, usar um array de tracejados que dá pop
        //Deletar os angulos maiores que 120
        //Juntar os tracejados em um contador que vira depois 120 graus

        const descolorir = tracejados.map(tracejado => apagarObjeto(tracejado)
                                                       .setUpdateFunction((valor) => {
                                                            tracejado.material = new THREE.MeshBasicMaterial({color: tracejado.material.color, transparent:true, opacity: valor});
                                                            tracejado.update();
                                                       })
                                                       .setDuration(45)
                                                       );

        const simultanea = new AnimacaoSimultanea();

        simultanea.setDuration(50);

        simultanea
        .setOnStart(() => {
            this.Configuracao2();
            const graus          = Math.round(this.angle.degrees);
            simultanea.animacoes = descolorir.slice(graus, 360)
            this.tracejados      = tracejados.slice(0, graus + 1);
        })

        return new AnimacaoSimultanea(dialogue, new AnimacaoSequencial(sequencial,simultanea));
    }

    eigthDialogue(dialogue){

        const mostrarAngulo = this.mostrarAngulo;

        const simultanea = new AnimacaoSimultanea();

        //Vai esperar a animação ser executada antes de pegar os tracejados
        simultanea.setOnStart(() => {
            const animacoes = this.tracejados.map((tracejado, index) => this.moverTracejado(tracejado,index));

            animacoes.map(tracejado => tracejado.setOnTermino(function(){
                                            mostrarAngulo.increment();
                                            mostrarAngulo.text.elemento.position.x = 1.8
                                        })
                        )

            simultanea.animacoes = animacoes;
        })

        simultanea.frames = 240;

        return new AnimacaoSimultanea(dialogue, simultanea);
    }

    ninthDialogue(dialogue){

        const fase = this;


        const light = new THREE.AmbientLight(0xffffff,10);

        dialogue.setOnTermino(() =>{

            this.mostrarAngulo.update({dentro:true})

            var loader = new GLTFLoader();
            loader.load(
                RelogioGLB,
                ( gltf ) =>  {
                    const relogio = gltf.scene.children[0];
                    relogio.scale.set(7,7,1)
                    relogio.position.z = -0.5
                    gltf.scene.add(light);
                    fase.circulo.removeFromScene();
                    fase.scene.add(gltf.scene);
                },
            );

            fase.dialogoTerminado = true; //Avisa para os problemas saberem que terminou o diálogo
        })

        return new AnimacaoSimultanea(dialogue);
    }

    aula2(){

        //Veja, quanto mais horas maior a quantidade de graus, pois elas são ** proporcionais **
        //Por isso que se 1 hora tem 30°, então 5 horas tem 5 vezes o tanto de graus (Mostra animação incrementando a hora e somando 30°)
        //Então chamamos de **razão** o valor de proporção, que nesse caso é 30°/1 hora '30 graus para cada hora' (adiciona razão na whiteboard)
        //Usamos essa razão para calcular graus a partir da hora (transforma razão em função graus(hora) = hora * razao)
        //Dado uma hora, basta multiplicar por ela para conseguir o resultado (aparece texto 'arraste horas para essa equação', na junção joga pra fora o valor em graus)
        //(Depois de mostrar todas as horas na função) Com isso, aprendemos proporcionalidade.
        //Razão horas pra minutos
        //42 minutos são 60 * 360/12 graus

        this.whiteboard.ativar(false);

        const dialogos = [
            "Veja, quanto mais horas maior a quantidade de graus, pois são diretamente proporcionais",
            "Por isso que se 1 hora tem 30°, então 5 horas tem 5 vezes (150°) o tanto de graus",
            "A razão entre as duas grandezas diretamente proporcionais sempre é a mesma,", //que nesse caso é 30°/1 hora '30 graus para cada hora' na parte direita da tela,
            "Usamos essa razão para calcular graus a partir da hora",
            "Dada uma hora, basta multiplicar por ela para conseguir o resultado",
            "Mova os todos os valores das horas para testar isso",
            "Isso vale até para valores quebrados, digamos 0,4 horas",
            "Podemos expressar também razões entre grandezas, como 60 minutos / 1 hora"
        ]
        .map(texto => this.animacaoDialogo(texto));

        const anim1 = this.aula2Dialogo1(dialogos[0]);
        const anim2 = dialogos[1];
        const anim3 = this.aula2Dialogo3(dialogos[2]);
        const anim4 = this.aula2Dialogo4(dialogos[3]);
        const anim5 = this.aula2Dialogo5(dialogos[4]);
        const anim6 = dialogos[5];

        const animacao = new AnimacaoSequencial(
                            anim1,
                            anim2,
                            anim3,
                            anim4,
                            anim5,
                            // anim6
                        )

        this.animar(animacao)




        //-> Criar carta verificar proporcionalidade => pega duas comparações e verifica se são proporcionais, retorna a razão
        //Todos os lados proporcionais é uma carta que coloca na lousa uma equação que precisa ser preenchida com todos os lados
        //Todos os angulos iguais basta clicar nos dois polígonos com angulos iguais e retorna a propriedade na lousa
    }

    aula2Dialogo1(dialogo){

        //Animar incrementação 
        const equacoes = {
           proporcao: (fator) => ` ( \\color{purple} ${fator}~ \\cdot ~ \\color{red} 1 \\color{black} )\\color{red} ~h ~ \\color{black} ~tem~ (\\color{purple} ~${fator}~ \\cdot \\color{blue} ~30 \\color{black}) \\color{blue} ° `,
        }

        const equacao = this.createMathJaxTextBox(equacoes.proporcao(2), [5,0,0], 1);

        const mostrarEquacao1 = new MostrarTexto(equacao)
                                .setValorFinal(400)
                                .setCurva(x => {

                                    x = (x > 0.25)? (x < 0.75)? 0.25 : x/2 : x;

                                    x = 1 - Math.abs(1 - 4*x);

                                    return -(Math.cos(Math.PI * x) - 1) / 2
                                })
                                .setDuration(400)
                                .setOnStart(() => this.scene.add(equacao));

        const mostrarEquacao2 = new MostrarTexto(equacao)
                                .setValorFinal(400)
                                .setCurva(x => {

                                    x = (x > 0.25)? (x < 0.75)? 0.25 : x/2 : x;

                                    x = 1 - Math.abs(1 - 4*x);

                                    return -(Math.cos(Math.PI * x) - 1) / 2
                                })
                                .setDuration(400)
                                .setOnStart(() => equacao.mudarTexto(equacoes.proporcao(4), 1)) 

        const mostrarEquacao3 = new MostrarTexto(equacao)
                                .setValorFinal(400)
                                .setCurva(x => {

                                    x = (x > 0.25)? (x < 0.75)? 0.25 : x/2 : x;

                                    x = 1 - Math.abs(1 - 4*x);

                                    return -(Math.cos(Math.PI * x) - 1) / 2
                                })
                                .setDuration(400)
                                .setOnStart(() => equacao.mudarTexto(equacoes.proporcao(5), 1)) 


        const moverPonteiro1 = this.moverPonteiro(30,60)
                                   .setCurva(x => -(Math.cos(Math.PI * x) - 1) / 2)
                                   .setDelay(200)
        const moverPonteiro2 = this.moverPonteiro(60,120)
                                   .setCurva(x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
                                   .setDelay(200)

        const moverPonteiro3 = this.moverPonteiro(120,150)
                                   .setCurva(x => {
                                        const c1 = 1.70158;
                                        const c2 = c1 * 1.525;
                                        
                                        return x < 0.5
                                        ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
                                        : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
                                    })
                                   .setDelay(200)


        const movimentacaoDePonteiro = new AnimacaoSequencial(
                                        new AnimacaoSimultanea(moverPonteiro1, mostrarEquacao1), 
                                        new AnimacaoSimultanea(moverPonteiro2, mostrarEquacao2), 
                                        new AnimacaoSimultanea(moverPonteiro3, mostrarEquacao3)
                                    )


        const animacao = new AnimacaoSimultanea(dialogo, movimentacaoDePonteiro);

        return animacao;
    }

    aula2Dialogo3(dialogo){

        //"Então chamamos de Razão o valor de proporção,", //que nesse caso é 30°/1 hora '30 graus para cada hora' na parte direita da tela,

        const texto1 = `\\displaylines{ que~nesse~caso~é~ \\large{\\color{purple} RAZ \\tilde{A} O ~ = ~ \\frac{\\color{blue} 30°} {\\color{red} 1h~}} \\\\ ela~serve~para~conseguir~os~ \\color {blue}{graus}~ \\color{black} {~a~partir~das~} \\color{red}{horas}}`

        const sidenote = this.createMathJaxTextBox(texto1, [5.5, 0, 0], 1.1);

        const mostrarSidenote = new MostrarTexto(sidenote).setDuration(100).setOnStart(() => this.scene.add(sidenote));
        
        const animacao = new AnimacaoSequencial(dialogo, mostrarSidenote)
                            .setOnTermino(() => this.animar(apagarCSS2(sidenote, this.scene)));

        return animacao;
    }

    aula2Dialogo4(dialogo){
        //Usamos essa razão para calcular graus a partir da hora (transforma razão em função graus(hora) = hora * razao)

        const equacoes = {
            formula: '\\color{blue} graus( \\color{red} {hora} \\color{blue}) \\color{black} = \\color{red} {hora} \\cdot \\color{purple} {RAZ \\tilde{A}O}',
            fatorada: '\\color{blue} graus( \\color{red} hora \\color{blue}) \\color{black} = \\color{red} hora  \\color{blue} \\cdot \\frac{\\color{blue} 30°} {\\color{red} 1h~}',
            instanciada: (hora) => `\\color{blue} graus( \\color{red} ${hora} \\color{blue}) \\color{black} = \\color{red} ${hora}  \\color{blue} \\cdot \\frac{\\color{blue} 30°} {\\color{red} 1h~}`
        } 

        const equacaoInicial = this.createMathJaxTextBox(equacoes.formula, [5, 0, 0], 1);

        const aparecerEquacao = apagarCSS2(equacaoInicial)
                                .reverse()
                                .setOnDelay(() => this.debug = false)
                                .setDelay(150)
                                .setOnStart(() => this.scene.add(equacaoInicial));

        const mudarEquacao = new AnimacaoSequencial(
                                new MostrarTexto(equacaoInicial)
                                .setValorInicial(400)
                                .setValorFinal(140)
                                .setOnTermino(() => equacaoInicial.mudarTexto(equacoes.fatorada, 0.9)),
                                new MostrarTexto(equacaoInicial)
                                .setValorInicial(170)
                                .setValorFinal(400)
        )

        const moverEquacao = animacaoIndependente(
                                () =>{

                                    this.animar(
                                        this.moverEquacao({
                                            elementoCSS2: equacaoInicial,
                                            duration1: 0,
                                            duration2: 100,
                                        })
                                    )
                                }
                            )

        //Criar objeto que contem equação na whiteboard, quando arrastar para perto uma variável hora retornar uma resposta


        const animacao = new AnimacaoSimultanea(
                            dialogo, 
                            new AnimacaoSequencial(
                                aparecerEquacao,
                                mudarEquacao,
                                moverEquacao
                            )
                        );

        return animacao;
    }

    aula2Dialogo5(dialogo){

        //Criar controle

        const valor = this.createMathJaxTextBox(`\\color{red} 5h`, [5,0,0], 1.3)

        const aparecer = apagarCSS2(valor)
                        .reverse()
                        .setOnStart(()=> {
                            this.scene.add(valor);
                            this.whiteboard.ativar(false);
                        })

        const mover = this.moverEquacao({
                        duration1:0,
                        duration2:100,
                        elementoCSS2: valor
                    });

        const sidenote = this.createTextBox(`Arraste o valor para a função na lousa`, [-5.6, 0.6, 0], 17, false);

        const mostrarSidenote = new MostrarTexto(sidenote).setOnStart(() => this.scene.add(sidenote));


        mover.setOnTermino(() => 
            this.Configuracao3({
                valor: this.whiteboard.equacoes[1], 
                funcao:this.whiteboard.equacoes[0],
                sidenote: sidenote
            })
        )


        const animacao = new AnimacaoSimultanea(
                            dialogo, 
                            new AnimacaoSequencial(
                                aparecer, 
                                mover,
                                mostrarSidenote
                            )
                        );

        return animacao;

    }

    moverTracejado(tracejado, filler){


        const translation = new THREE.Vector3();

        tracejado.mesh.children[0].getWorldPosition(translation);

        const posicaoFinal = new THREE.Vector3(1.5,0.5,0).add(translation.negate())

        return new Animacao(tracejado.mesh)
               .setValorInicial(new THREE.Vector3(0,0,0))
               .setValorFinal(posicaoFinal)
               .setDuration(100)
               .setInterpolacao((inicial,final,peso) => new THREE.Vector3().lerpVectors(inicial,final,peso))
               .setUpdateFunction(function(posicao){

                    tracejado.mesh.position.copy(posicao);
               })
               .voltarAoInicio(false)
               .setOnTermino(() => this.scene.remove(tracejado.mesh))
               .filler(filler)
    }

    circuloCrescendoAnimacao(circulo){

        return new Animacao(circulo)
                .setValorInicial(0.001)
                .setValorFinal(0.1)
                .setDuration(140)
                .setInterpolacao((inicial,final,peso) => inicial*(1 - peso) + final*peso)
                .setCurva((x) => {
                    const c5 = (2 * Math.PI) / 4.5;
                    
                    return x === 0
                        ? 0
                        : x === 1
                        ? 1
                        : x < 0.5
                        ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
                        : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
                    })
                .setUpdateFunction((valor) => {
                    circulo.raio = valor;
                    circulo.update();
                })
                .setOnStart(() => circulo.addToScene(this.scene))
    }

    //Criação dos controles, input e output
    createInputs(){

        new Hoverable(this.ponto2,this.camera);
        new Draggable(this.ponto2, this.camera);
    }

    createOutputs(){
        this.mostrarAngulo    = new MostrarAngulo(this.angle);
        this.colorirPonto     = new ColorirOnHover(this.ponto2,0xaa0000,0xffff33).setCanvas(this);
        this.colorirTracejado = new ColorirOnHover(this.ponto2.tracejado, 0xaa0000, 0xffff33).setCanvas(this);

        //Função auxiliar para incrementar o contador do ângulo começando de 0
        //Retorna uma closure
        this.mostrarAngulo.increment = (() => {
            let a = 0; 
            return () => {
                this.mostrarAngulo.text.elemento.element.textContent = `${Math.round(this.angle.degrees)}° = ${a++} segmentos`
            }
        })();

    }

    //Configurações, nesse caso o controle de arrastar o ponteiro
    Configuracao1(){

        //Atualiza a posição do ponto no arraste para ficar restrita ao círculo
        this.ponto2.draggable.addObserver(new FixarAoCirculo(this.circulo, this.ponto2))

        //Atualiza todos os objetos dependentes da posição do ponto
        this.ponto2.draggable.addObserver({
            update: this.ponto2.updateObservers
        })

        const colorirPonto     = this.colorirPonto;
        const colorirTracejado = this.colorirTracejado;

        this.ponto2.hoverable.addObserver(colorirPonto)
        this.ponto2.hoverable.addObserver(colorirTracejado)
        this.ponto2.draggable.addObserver(colorirPonto)
        this.ponto2.draggable.addObserver(colorirTracejado)
    }

    //Desativa o controle de arrastar o ponteiro temporariamente
    Configuracao2(){

        this.ponto2.draggable.observers.map(output => output.update({dragging: false}));
        this.ponto2.hoverable.observers.map(output => output.update({dentro:false}));
        this.ponto2.removeAllOutputs();
    }

    //Arraste e instanciação de equações
    Configuracao3(informacao){

        this.informacao = {...this.informacao, ...informacao};

        const equacoes = {
            formula: '\\color{blue} graus( \\color{red} {hora} \\color{blue}) \\color{black} = \\color{red} {hora} \\cdot \\color{purple} {RAZ \\tilde{A}O}',
            fatorada: '\\color{blue} graus( \\color{red} hora \\color{blue}) \\color{black} = \\color{red} hora  \\color{blue} \\cdot \\frac{\\color{blue} 30°} {\\color{red} 1h~}',
            instanciada: (hora) => `\\color{blue} graus( \\color{red} ${hora} \\color{blue}) \\color{black} = \\color{red} ${hora}  \\color{blue} \\cdot \\frac{\\color{blue} 30°} {\\color{red} 1h~}`
        } 

        //Vai ser a função que vai instanciar as equações
        const funcao = new ElementoCSS2D(informacao.funcao, this.whiteboard);
        const valor  = new ElementoCSS2D(informacao.valor,  this.whiteboard);

        console.log(funcao, valor);


        //Criar controle de juntar funcao com valores

        const juntar = new JuntarEquacoes(valor,[funcao], this);

        juntar.equacaoResultante = equacoes.instanciada("5h");

        this.controleEquacoes("5h").addInputs(juntar);
    }

    controleEquacoes(valor){

        //Refatorar depois a parte das equações, esse trabalho aqui é desnecessário
        const equacoes = {
            formula: '\\color{blue} graus( \\color{red} {hora} \\color{blue}) \\color{black} = \\color{red} {hora} \\cdot \\color{purple} {RAZ \\tilde{A}O}',
            fatorada: '\\color{blue} graus( \\color{red} hora \\color{blue}) \\color{black} = \\color{red} hora  \\color{blue} \\cdot \\frac{\\color{blue} 30°} {\\color{red} 1h~}',
            instanciada: (hora) => `\\color{blue} graus( \\color{red} ${hora} \\color{blue}) \\color{black} = \\color{red} ${hora}  \\color{blue} \\cdot \\frac{\\color{blue} 30°} {\\color{red} 1h~}`,
            resolvidaParcialmente:   (hora) => `\\color{blue} graus(\\color{red} ${hora} \\color{blue}) \\color{black} = \\color{blue} ${hora} \\cdot 30°`,
            resolvida:   (hora) => `\\color{blue} graus(\\color{red} ${hora} \\color{blue}) \\color{black} = \\color{blue} ${parseInt(hora) * 30}°`

        } 

        const fase = this;

        return new Output()
               .setUpdateFunction(function(novoEstado){

                    const estado = this.estado;

                    const novaEquacao = novoEstado.novaEquacao;

                    if(novaEquacao && estado.etapa == 1){
                        const objetoEquacao = new ElementoCSS2D(novaEquacao, fase.whiteboard);

                        const mudarSidenote = fase.animacaoDialogo("Clique na equação para resolvê-la", fase.informacao.sidenote)

                        fase.animar(mudarSidenote)

                        const resolverEquacao = new ResolverEquacao(objetoEquacao, fase, null, equacoes.resolvidaParcialmente(estado.valor))

                        this.addInputs(resolverEquacao);

                        estado.etapa++;
                    }

                    if(novaEquacao && estado.etapa == 2){
                        const objetoEquacao = new ElementoCSS2D(novaEquacao, fase.whiteboard);

                        const mudarSidenote = fase.animacaoDialogo("Clique mais uma vez na equação para resolvê-la", fase.informacao.sidenote)

                        fase.animar(mudarSidenote)

                        const resolverEquacao = new ResolverEquacao(objetoEquacao, fase, null, equacoes.resolvidaParcialmente(estado.valor))

                        this.addInputs(resolverEquacao);

                        estado.etapa++;
                    }
               })
               .setEstadoInicial({
                    valor: valor,
                    etapa: 1
               })

    }

    update(){
        // this.atualizarOptions();

        super.update();
        if(this.debug) super.update();
        if(this.debug) super.update();
        if(this.debug) super.update();

        if(this.debug && this.problema > this.progresso){

            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
        }

        // if(options.atualizar) triangle.update();

        const problema = this.problemas[this.progresso];

        if(!problema) return console.log("Finalizado");

        if(problema.satisfeito(this)){
            problema.consequencia(this);
            this.progresso++;
        }
    }

    //Adicionar equação 4 horas = 120 graus, onde graus e horas são variáveis
    //Adicionar possibilidade de resolver equação por meios algébricos
    //Adicionar menu de perguntas
    problemas = {

        0: {
            satisfeito(fase){

                return fase.dialogoTerminado && Math.round(30 - fase.angle.degrees) == 0;
            },

            consequencia(fase){

                fase.Configuracao2();

                const dialogo1 = fase.animacaoDialogo(`Uma hora tem 30°, como acabou de demonstrar`);

                fase.equacaoUmaHora = fase.createMathJaxTextBox(`\\color{red}{1~h}~\\color{black}{tem}~\\color{blue}{30°}`, [4,2.5,0], 1);

                const mostrarEquacao = fase.moverEquacao({
                    elementoCSS2: fase.equacaoUmaHora,
                    duration1: 100,
                    duration2: 50,
                    delaydoMeio: 50,
                });

                const dialogo2 = fase.animacaoDialogo(`Agora, consegue mostrar quanto vale 5 horas?`);

                const animacao2 = new AnimacaoSequencial(dialogo2).setOnStart(() => {
                                                                            fase.Configuracao1();
                                                                        });

                const animacao = new AnimacaoSequencial(dialogo1,mostrarEquacao,animacao2);

                animacao.setOnTermino(() => fase.whiteboard.ativar(false));

                animacao.setNome("Execução Principal");

                fase.animar(animacao)
            }
        },

        1: {
            satisfeito(fase){

                console.log(fase.angle.degrees)

                return Math.round(150 - fase.angle.degrees) == 0;
            },

            consequencia(fase){

                fase.Configuracao2();

                fase.equacaocincoHoras = fase.createMathJaxTextBox(`\\color{red}{5~h}~\\color{black}{tem}~\\color{blue}{150°}`, [4,2.5,0], 1);

                const mostrarEquacao = fase.moverEquacao({
                                            elementoCSS2: fase.equacaocincoHoras,
                                            duration1: 100,
                                            duration2: 50,
                                            delaydoMeio: 50,
                                        });

                const dialogo1 = `5 horas tem 150°, como acabou de demonstrar`

                const animacao1 = new TextoAparecendo(fase.text.element).setOnStart(() => fase.changeText(dialogo1))

                const dialogo2 = `Mas será que é preciso medir os graus toda vez?`

                const animacao2 = new TextoAparecendo(fase.text.element).setOnStart(() => fase.changeText(dialogo2))

                const dialogo3 = "Veja, você sabe que uma hora tem 30°"

                const animacao3 = new TextoAparecendo(fase.text.element).setOnStart(() => fase.changeText(dialogo3));

                const mostrarHora = fase.mostrarHora();

                const animacao = new AnimacaoSequencial(animacao1,mostrarEquacao,animacao2, new AnimacaoSimultanea(mostrarHora));

                fase.animar(animacao.setOnTermino(() => fase.progresso = 3));
            }
        },

        3: {
            satisfeito(){
                return true;
            },

            consequencia(fase){

                fase.whiteboard.removerTodasEquacoes();

                fase.aula2();
            }
        }
    }

    //Trabalhar na carta proporcionalidade
    //Cria a equação da regra de 3, útil para os problemas
    createEquationBox(equation, position){

        const container = document.createElement('p');
        container.style.fontSize = "25px";
        container.style.fontFamily = "Courier New, monospace";
        container.style.fontWeight = 500;
        container.style.display = 'inline-block';

        // Split the text into individual characters
        const characters = equation.split('');

        // Create spans for each character and apply the fading effect
        characters.forEach((character,index) => {
            const span = document.createElement('span');
            span.textContent = character;
            container.appendChild(span);
        });

        // Create the CSS2DObject using the container
        const cPointLabel = new CSS2DObject(container);       

        cPointLabel.position.x = position[0];
        cPointLabel.position.y = position[1];
        cPointLabel.position.z = position[2];

        this.scene.add(cPointLabel);

        return cPointLabel;
    }


    //Animações dos problemas

    moverPonteiro(anguloInicial, anguloFinal){

        return new Animacao(this.ponto2)
                .setValorInicial(Math.PI*anguloInicial/180)
                .setValorFinal(Math.PI*anguloFinal/180)
                .setInterpolacao((inicial, final, peso) => inicial*(1-peso) + final*peso)
                .setDuration(200)
                .voltarAoInicio(false)
                .setCurva(x => -(Math.cos(Math.PI * x) - 1) / 2)
                .setUpdateFunction((angulo) => {
                    const posicao = new THREE.Vector3(3*Math.sin(angulo), 3*Math.cos(angulo), 0)
                    this.ponto2.position = posicao;
                    this.ponto2.update(); //Refatorar circulo, update deve ser apenas update
                    this.ponto2.updateObservers();
                });

    }

    mostrarHora(){

        const moverPonteiro = this.moverPonteiro(this.angle.degrees,30);


        //Forma algébrica, desenvolver animações para lidar com isso (criar carta e mover)
        //Adicionar carta (círculo tem 360°)
        //Adicionar carta (relógio tem 12 horas)
        //Adicionar carta (relógio é um círculo)
        //Resolução: 12 horas tem 360°
        //Então 6 horas tem 180°
        //e 1 hora tem 30°
        //Shortcut,adicionar bônus se resolver por essa maneira

        // const anguloText = this.mostrarAngulo.text.elemento

        // const moverAngulo = new Animacao(anguloText)
        //                         .setValorInicial(anguloText.position.clone())
        //                         .setValorFinal(new THREE.Vector3(5,2,0))
        //                         .setDuration(200)
        //                         .voltarAoInicio(false)
        //                         .setInterpolacao((inicial,final,peso) => new THREE.Vector3().lerpVectors(inicial,final,peso))
        //                         .setUpdateFunction(value => {
        //                             anguloText.position.copy(value);
        //                         })
        //Animação desativar mostrarÂngulo, mover texto do ângulo
        //Criar texto 1 hora = {Angulo}

        return new AnimacaoSequencial(
                    moverPonteiro
                    
                );
    }

    //Transformar isso numa classe?
    moverEquacao(configs){

        let {elementoCSS2, equacao, spline, duration1, duration2, delayDoMeio} = configs;

        if(!spline){
            spline = [
                new THREE.Vector3(1.473684210526315, -2.2692913385826774, 0),
                new THREE.Vector3(-0.39766081871345005, -0.6944881889763783, 0),
            ]
        }

        if(!equacao){

            const novoElemento = document.createElement("div");

            novoElemento.innerHTML = elementoCSS2.element.innerHTML;

            // novoElemento.style.width = '400px'; // Set width to 200 pixels
            // novoElemento.style.height = '40px'; // Set height to 150 pixels
            // novoElemento.style.top = '10px'; // Set top position to 50 pixels from the top of the parent element

            novoElemento.style.position = 'relative';

            // novoElemento.children[0].style.width = '400px';
            novoElemento.children[0].style.height = 'auto';

            equacao = {html: novoElemento}
        }

        if(!duration1){
            duration1 = 50
        }

        if(!duration2){
            duration2 = 50;
        }

        if(!delayDoMeio){
            delayDoMeio = 0;
        }

        const fase = this;

        //Consertar depois, está debaixo da whiteboard
        // novoElemento.element.style.zIndex = 10000;

        const mostrarTexto = new MostrarTexto(elementoCSS2)
                                .setValorFinal(300)
                                .setProgresso((duration1)? 0 : 1)
                                .setDelay(delayDoMeio)
                                .setDuration(duration1)
                                .setValorFinal(3000)
                                .setOnStart(() => {
                                    fase.scene.add(elementoCSS2);
                                    fase.whiteboard.adicionarEquacao(equacao)
                                });

        const moverEquacaoParaDiv = new MoverTexto(elementoCSS2)
                                    .setOnStart(function(){
                                        const equacaoDiv   = fase.whiteboard.equacoes[0].element;

                                        const dimensoes    = equacaoDiv.getBoundingClientRect();

                                        const posicaoFinal = fase.pixelToCoordinates((dimensoes.right + dimensoes.left)/2, (dimensoes.top + dimensoes.bottom)/2)

                                        this.setSpline([
                                            elementoCSS2.position.clone(),
                                            ...spline,
                                            posicaoFinal
                                        ])

                                        // fase.whiteboard.equationList.children[0].style.display = "none"
                                        

                                    })
                                    .setOnTermino(() =>{
                                        fase.scene.remove(elementoCSS2);
                                        // fase.whiteboard.equationList.children[0].style.display = "block"
                                        fase.whiteboard.ativar(true);
                                    })
                                    .setDuration(duration2)


        const animacao = new AnimacaoSequencial( 
                            mostrarTexto, 
                            moverEquacaoParaDiv
                        )

        animacao.setCheckpointAll(false);

        return animacao

        
    }

}
