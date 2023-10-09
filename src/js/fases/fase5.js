import {Draggable} from '../inputs/draggable';
import {Hoverable} from '../inputs/hoverable';
import {MostrarAngulo} from '../outputs/mostrarAngulo';
import { ColorirIsoceles } from '../outputs/colorirIsoceles';
import { MostrarTipo } from '../outputs/mostrarTipo';
import  MoverVertice  from '../outputs/moverVertice';
import { MostrarBissetriz } from '../outputs/mostrarBissetriz';
import { Clickable, MultipleClickable } from '../inputs/clickable';
import {CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer';

import * as dat from 'dat.gui';
import * as THREE from 'three';
import { TextoAparecendo } from '../animacoes/textoAparecendo';
import Animacao, { AnimacaoSequencial, AnimacaoSimultanea } from '../animacoes/animation';
import { colorirAngulo } from '../animacoes/colorirAngulo';
import { Tracejado } from '../objetos/tracejado';
import MostrarTracejado from '../animacoes/mostrarTracejado';
import { Divisao } from '../animacoes/divisao';
import { Triangle } from '../objetos/triangle';
import { Fase } from './fase';
import { Angle } from '../objetos/angle';
import { Output } from '../outputs/Output';
import Circle from '../objetos/circle';
import DesenharMalha from '../animacoes/desenharMalha';

export class Fase5  extends Fase{

    constructor(){

        super();

        this.triangulo = new Triangle([
            [-1,-1,0],
            [1,2.5,0],
            [4,1.6,0]
        ])
        .render()
        .addToScene(this.scene);


        this.trigonometria = [];

        this.createInputs();
        this.createOutputs();
        this.ligarInputAoOutput();
        this.setupTextBox();

        this.levelDesign();
    }

    //Onde toda a lógica da fase é realizada, a sequência de animações/texto
    levelDesign(){

        
        const dialogo = ['Mostraremos como a soma dos ângulos de um triângulo é 180°',
                         'Clique em um dos vértices do triângulo']

        const anim1 = this.firstAnim(dialogo);

        this.animar(new AnimacaoSequencial(anim1));

    }

    // primeiros dialogos
    firstAnim(textos) {

        const animacoesTextos = [];

        textos.forEach((texto) => {
            animacoesTextos.push(
                new TextoAparecendo(this.text.element)
                    .setOnStart(
                        () => {
                            this.changeText(texto);
                        })
                    .setDelay(100)
            )
        })
        
        //Bug de threads consertado, usar setAnimações toda vez que lidar com listas de animações
        //Do tipo [anim1,anim2,anim3,anim4...]
        const sequencial = new AnimacaoSequencial().setAnimacoes(animacoesTextos);
        
        return sequencial;
            
    }


    createInputs(){
        //Inputs
        const vertices = this.triangulo.vertices;
        const angles   = this.triangulo.angles;

        //Adiciona o clickable ao vertice, agora todo vertice tem vertice.clicable
        vertices.forEach((vertice) => new Clickable(vertice, this.camera));
        vertices.forEach((vertice) => new Draggable(vertice, this.camera));

        //Adiciona o draggable ao angulo, agora todo angulo tem angulo.draggable
        angles.map((angle) => new Draggable(angle, this.camera));

    }

    createOutputs(){
        //Outputs
        this.outputClickVertice   = this.triangulo.vertices.map(vertex =>   this.criarTracejado(vertex))
        this.outputDragAngle      = this.triangulo.angles.map(  angle =>    this.criarMovimentacaoDeAngulo(angle))
        this.outputEscolheuErrado = this.triangulo.angles.map(  angle =>    this.outputAnguloErrado(angle))
        this.outputMoverVertice   = this.triangulo.vertices.map(vertice => new MoverVertice(vertice));

    }

    ligarInputAoOutput(){

        const vertices = this.triangulo.vertices;
        const angles   = this.triangulo.angles;

        //Liga o vertice.clickable input ao output
        for (let i = 0; i < 3; ++i) {

            const vertice = vertices[i];

            vertice.clickable.addObserver(this.outputClickVertice[i])
        }

        //Liga o angulo.draggable ao output do draggable
        for (let i = 0; i < 3; ++i) {

            const angulo = angles[i];

            angulo.draggable.addObserver(this.outputDragAngle[i]);
        }
    }

    desligarOutputs(){
        //Desliga os outputs dos inputs
        this.outputClickVertice.map(  output => output.removeInputs());
        this.outputDragAngle.map(     output => output.removeInputs());
        this.outputEscolheuErrado.map(output => output.removeInputs());
        this.outputMoverVertice.map(  output => output.removeInputs());


        //Reseta os estados dos outputs
        this.outputClickVertice.map(  output => output.estado = {})
        this.outputDragAngle.map(     output => output.estado = {})
        this.outputEscolheuErrado.map(output => output.estado = {})

    }

    criarMovimentacaoDeAngulo = (angle) => {


        //Inputs: hoverable do ângulo invisível -> {dentro: bool}, 
        //                                      -> diz se o mouse está dentro do invisível
        //
        //        draggable do ângulo real      -> {posicao: vetor, dragging: bool}, 
        //                                      -> diz a posição do mouse e se ele está arrastando o angulo real

        const fase = this;

        return new Output()
               .setUpdateFunction(
                    function(estadoNovo){

                        this.estado = {...this.estado, ...estadoNovo}


                        const estado = this.estado;

                        if(estado.finalizado) return;

                        if(estado.dragging){
                            let posicao = estado.position.clone();

                            if(posicao) angle.mesh.position.copy((posicao))
                        }

                        //Se arrastou e está em cima do ângulo invisível, estado é valido
                        if(estado.dragging && estado.dentro){
                            estado.valido = true;
                            return;
                        }

                        //Se o estado for valido e soltar o mouse, então finaliza a execução
                        if(estado.valido && !estado.dragging){
                            estado.finalizado = true;

                            const copia = angle.copia().render();

                            const invisivel = angle.correspondente;

                            //Roda a animação de movimentar ângulo, é uma função auxiliar abaixo
                            //Move e gira a copia
                            moverAnguloAnimacao(copia, estado.position.clone(), invisivel.getPosition());
                            girarAngulo(copia);

                            //Retorna o ângulo a sua posição original
                            moverAnguloAnimacao(angle, angle.getPosition(), angle.position);

                            animarMudarDeCor(copia);
                            animarMudarDeCor(angle);

                            //Adicona output update copia e desativa drag
                            fase.triangulo.vertices.map(vertice => vertice.draggable.addObserver({update: () => copia.removeFromScene()}));

                            fase.outputEscolheuErrado[angle.index].removeInputs();
                            // console.log(fase)

                            return;
                        }

                        if (!estado.dragging) {
                            angle.mesh.position.copy(angle.position);
                            
                        }

                        estado.valido = false;
                    }
               )

        //Funções auxiliares
        function moverAnguloAnimacao(angle, origem, destino){

            console.log(origem, destino);

            const anguloInicial = angle;
            
    
            const moveAngulo = new Animacao()
                            .setValorInicial(origem)
                            .setValorFinal(destino)
                            .setInterpolacao(new THREE.Vector3().lerpVectors)
                            .setUpdateFunction(function(posicao){
                                    anguloInicial.mesh.position.copy(posicao)
                            })
                            .voltarAoInicio(false)
                            .setDuration(75)
                            .setCurva(function easeInOutSine(x) {
                                    return -(Math.cos(Math.PI * x) - 1) / 2;
                                })
            
            fase.animar(moveAngulo)
        }

        function girarAngulo(angulo){

            const anguloInicial = angulo;
    
            const quaternionInicial = anguloInicial.mesh.quaternion.clone(); 
            const quaternionFinal = new THREE.Quaternion();
            quaternionFinal.setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI);
    
            const tempoInterpolacao = 0.5; // Define o tempo de duração da interpolação (ajuste conforme necessário)
            const quaternionInterpolado = new THREE.Quaternion();
            quaternionInterpolado.slerp(quaternionInicial, quaternionFinal, tempoInterpolacao);
    
            // animação
            const animacaoRodaeMoveAngulo = new Animacao()
                .setValorInicial(quaternionInicial)
                .setValorFinal(quaternionFinal)
                .setDuration(75)
                .setInterpolacao(function(inicial, final, peso) {
                    return new THREE.Quaternion().slerpQuaternions(inicial, final, peso)
                })
                .setUpdateFunction(function(quaternum) {
                    anguloInicial.mesh.quaternion.copy(quaternum)
                })
                .voltarAoInicio(false) //Pra não resetar quando terminada a animação
                .setCurva(function easeInOutSine(x) {
                    return -(Math.cos(Math.PI * x) - 1) / 2;
                })
                .setOnStart(() => angulo.addToScene(fase.scene))

            fase.animar(animacaoRodaeMoveAngulo);

        }

        function animarMudarDeCor(angle){

            const corFinal = 0x00ffff;

            const colorir = colorirAngulo(angle)
                            .setValorInicial(0xff0000)
                            .setValorFinal(corFinal)
                            .setDuration(100)
                            //Gambiarra pois a classe angle foi mal feita, ignorar
                            .setUpdateFunction(valor => {
                                angle.material = new THREE.MeshBasicMaterial({color: valor})
                                angle.position.copy(angle.mesh.position);
                                const quaternion = angle.mesh.quaternion.clone();
                                angle.removeFromScene();
                                angle.renderMalha();
                                angle.mesh.quaternion.copy(quaternion)
                                angle.addToScene(fase.scene)
                            })
                            .voltarAoInicio(false)
                            .filler(100)
                            .setOnStart(() => fase.amareloUsado = true)
            
            fase.animar(colorir);               
        }
    }

    criarTracejado = (vertex) => {

        //Input: clickable do vertice, diz se foi o vertice clicado ou não
        //Input: draggable dos outros vertices, diz se outros vértices se arrastaram

        //Para usar nas funções auxiliares
        const fase = this;

        // pegar outros dois vertices:
        const outros_dois = this.triangulo.vertices.filter((vertice) => vertice != vertex);

        let ativado = false;
        let tracejado = null;
        let desenharTracejado = null;

        let trianguloInvisivel1 = null;
        let trianguloInvisivel2 = null;

        let anguloInvisivel1 = null;
        let anguloInvisivel2 = null;
        

        return new Output()
                .setUpdateFunction(
                    function(novoEstado){

                        this.estado = {...this.estado, ...novoEstado}

                        const estado = this.estado;

                        // console.log(novoEstado)

                        //Se um dos outros vértices tiver sendo arrastado, remove tudo e desenha de novo
                        if(estado.dragging){

                            desenharTracejado.stop = true;
                            tracejado.removeFromScene(fase.scene)
                            anguloInvisivel1.removeFromScene(fase.scene)
                            anguloInvisivel2.removeFromScene(fase.scene)

                            fase.desligarOutputs(); 
                            fase.ligarInputAoOutput();

                            const posicao = vertex.mesh.position.clone();
                            const vetorTracejado1 = outros_dois[0].mesh.position.clone().sub(outros_dois[1].mesh.position.clone());
                            const vetorTracejado2 = outros_dois[1].mesh.position.clone().sub(outros_dois[0].mesh.position.clone());

                            //Funções auxiliares, estão logo abaixo do return
                            criarHitboxAngulos(posicao, vetorTracejado1, vetorTracejado2);

                            ligarHitboxHoverInputAoOutputDragAngle();

                            ativarMoverOutrosVertices(this);

                            tracejado = new Tracejado(posicao.clone().sub(vetorTracejado1.multiplyScalar(3)), posicao.clone().add(vetorTracejado1.multiplyScalar(3)))

                            tracejado.addToScene(fase.scene);

                            estado.arraste = true;

                            console.log(1)

                            return;
                        }

                        if (estado.clicado && !ativado){

                            ativado = !ativado

                            const posicao = vertex.mesh.position.clone();
                            const vetorTracejado1 = outros_dois[0].mesh.position.clone().sub(outros_dois[1].mesh.position.clone());
                            const vetorTracejado2 = outros_dois[1].mesh.position.clone().sub(outros_dois[0].mesh.position.clone());
                            
                            const tracejadoJaExistente = fase.hoverInvisivel1 != null;

                            if(tracejadoJaExistente) desativarTracejados(this) //Se já tiver um tracejado existe, desativa ele

                            //Funções auxiliares, estão logo abaixo do return
                            criarHitboxAngulos(posicao, vetorTracejado1, vetorTracejado2);

                            ligarHitboxHoverInputAoOutputDragAngle()

                            animacaoTracejado(posicao,vetorTracejado1,vetorTracejado2);

                            ativarMoverOutrosVertices(this);

                        } else if (estado.clicado) {

                            ativado = !ativado
                            
                            desenharTracejado.stop = true;
                            tracejado.removeFromScene(fase.scene)
                            anguloInvisivel1.removeFromScene(fase.scene)
                            anguloInvisivel2.removeFromScene(fase.scene)
                            
                            //Reseta outputs para sua configuração inicial
                            fase.desligarOutputs(); 
                            fase.ligarInputAoOutput();
                            
                            fase.triangulo.vertices.map(vertice => vertice.draggable.removeObservers())

                            fase.triangulo.removeFromScene();
                            fase.triangulo.addToScene(fase.scene);
                        }

                        estado.ativado = ativado; //Sinaliza se o output foi ativado
                        estado.clicado = false;
                    }
                )

        //Funções auxiliares
        //SEMPRE USAR "FASE" AO INVÉS DE THIS
        //o this no javascript quando usado em functions se refere a própria function
        //é como se as functions fossem objetos
        //isso não acontece com as setinhas

        //Cria os inputs das hitboxes invisíveis
        function criarHitboxAngulos(posicao, vetorTracejado1, vetorTracejado2) {
            const vtov1 = outros_dois[0].mesh.position.clone().sub(posicao);
            const vtov2 = outros_dois[1].mesh.position.clone().sub(posicao);

            const posVtov1 = vtov1.clone().normalize().add(posicao);
            const posVtov2 = vtov2.clone().normalize().add(posicao);

            const posVtracejado1 = vetorTracejado1.clone().normalize().add(posicao);
            const posVtracejado2 = vetorTracejado2.clone().normalize().add(posicao);

            trianguloInvisivel1 = new Triangle();
            trianguloInvisivel1.positions = [posicao, posVtov1, posVtracejado1].map((vetor) => vetor.toArray());
            
            trianguloInvisivel2 = new Triangle();
            trianguloInvisivel2.positions = [posicao, posVtov2, posVtracejado2].map((vetor) => vetor.toArray());

            trianguloInvisivel1.render();
            trianguloInvisivel2.render();

            anguloInvisivel1 = new Angle(trianguloInvisivel1.vertices);
            anguloInvisivel2 = new Angle(trianguloInvisivel2.vertices);
            anguloInvisivel1.angleRadius = 1;
            anguloInvisivel2.angleRadius = 1;

            anguloInvisivel1.render();
            anguloInvisivel1.addToScene(fase.scene);
            anguloInvisivel2.render();
            anguloInvisivel2.addToScene(fase.scene)


            anguloInvisivel1.mesh.visible = false;
            anguloInvisivel2.mesh.visible = false;


            fase.hoverInvisivel1 = new Hoverable(anguloInvisivel1, fase.camera)
            fase.hoverInvisivel2 = new Hoverable(anguloInvisivel2, fase.camera)
        }

        //liga os inputs hover dos ângulos invisíveis ao output dragAngle
        //liga os inputs hover dos ângulos invisiveis errados ao output ERRADO(tremedeira)
        function ligarHitboxHoverInputAoOutputDragAngle(){
            fase.outputDragAngle.forEach((output,index) => {

                //Apenas liga se o ângulo for o mesmo
                const angle             = fase.triangulo.angles[index];
                const escolheuErrado    = fase.outputEscolheuErrado[index];

                if(angle.igual(anguloInvisivel1)) {
                    anguloInvisivel1.hoverable.addObserver(output); //liga o input hoverable do angulo invisivel ao output drag do angulo real
                    angle.correspondente = anguloInvisivel1;
                }
                else{
                    anguloInvisivel1.hoverable.addObserver(escolheuErrado) // se não for, liga para o output "ERRADO"
                    angle.draggable.addObserver(escolheuErrado);
                }

                if(angle.igual(anguloInvisivel2)) {
                    anguloInvisivel2.hoverable.addObserver(output); //liga o input hoverable do angulo invisivel ao output drag do angulo real
                    angle.correspondente = anguloInvisivel2;            
                }
                else{
                    anguloInvisivel2.hoverable.addObserver(escolheuErrado) // se não for, liga para o output "ERRADO"
                    angle.draggable.addObserver(escolheuErrado);
                }
            })
        }

        //Anima o desenhar tracejado
        function animacaoTracejado(posicao,vetorTracejado1,vetorTracejado2){

            tracejado = new Tracejado(posicao.clone().sub(vetorTracejado1), posicao.clone().add(vetorTracejado1))
            tracejado.addToScene(fase.scene);

            // animação
            desenharTracejado = new Animacao(tracejado)
                .setValorInicial(0)
                .setValorFinal(2)
                .setDuration(200)
                .setInterpolacao((inicial, final, peso) => inicial * (1 - peso) + final*peso)
                .setUpdateFunction((progresso) => {
                    tracejado.origem = posicao.clone().sub(vetorTracejado1.clone().multiplyScalar(progresso))
                    tracejado.destino = posicao.clone().add(vetorTracejado1.clone().multiplyScalar(progresso))
                    tracejado.update();
                })
                .setCurva((x) => 1 - (1 - x) * (1 - x))
                .voltarAoInicio(false);
            
            fase.animar(desenharTracejado);
        }


        function desativarTracejados(outputAtual){

            //Tira o output dos hoversInvisíveis antigos
            fase.hoverInvisivel1.removeObservers();
            fase.hoverInvisivel2.removeObservers();

            for(const output of fase.outputClickVertice){
                
                if(output == outputAtual) continue; //ignora se é o vertice clicado atual
                
                //Desativa o ultimo vértice selecionado, 
                //como se tivesse clicado de novo
                //Já que clicar duas vezes desativa
                if(output.ativado) output.update({clicado:true}) 
            }

        }

        //Ativa o arraste dos outros vértices e desativa seus click tracejado
        function ativarMoverOutrosVertices(outputCriarTracejado){
            
            fase.triangulo.vertices.map((vertice,index) => {

                if(vertice != vertex){

                    vertice.clickable.removeObservers()

                    //Vértice não selecionado pode ser arrastado
                    vertice.draggable.addObserver(fase.outputMoverVertice[index]);

                    vertice.draggable.addObserver(fase.triangulo);

                    //Vértice arrastado notifica esse criarTracejado
                    vertice.draggable.addObserver(outputCriarTracejado);

                }

            })
        }
    }

    //Criar output negar ângulo errado (tremedeira + voltar ao inicio)
    //Se ele colocar o angulo no lugar errado, faz uma animação e devolve o ângulo para o lugar original
    outputAnguloErrado(angle){

        //Inputs: arraste do ângulo real (angle.draggable)
        //        hoverable do ângulo invisível errado (anguloInvisivel.hover)

        const fase = this;

        return new Output()
               .setUpdateFunction(function(estado){

                    this.estado = {...this.estado, ...estado};

                    if(estado.dragging) this.estado.ativado = true;
                    
                    if(this.estado.ativado && !this.estado.dragging && this.estado.dentro) {
                        animarGiro(this.estado.position);
                        this.estado.ativado = false;
                    }

               })

        //Função auxiliar////
        /////////////////////
        function animarGiro(posicao){

            const quaternionInicial = new THREE.Quaternion();
            const quaternionFinal   = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,-1), 0.3);

            function easeInOutBack(x) {
                const c1 = 1.70158;
                const c2 = c1 * 1.525;
                
                return x < 0.5
                  ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
                  : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
                
            }
            
            const giro =  new Animacao(angle)
                        .setValorInicial(quaternionInicial)
                        .setValorFinal(quaternionFinal)
                        .setDuration(30)
                        .setInterpolacao(function(inicial,final,peso){
                            return new THREE.Quaternion().slerpQuaternions(inicial,final,peso);
                        })
                        .setCurva(x => (y => Math.sin(y*2*Math.PI))(easeInOutBack(x + 0.03*Math.random())))
                        .setUpdateFunction(function(quaternion){
                            angle.mesh.quaternion.copy(quaternion);
                        });

            const mover = new Animacao()
                            .setValorInicial(posicao)
                            .setValorFinal(angle.position.clone())
                            .setInterpolacao(new THREE.Vector3().lerpVectors)
                            .setUpdateFunction(function(posicao){
                                    angle.mesh.position.copy(posicao)
                            })
                            .voltarAoInicio(false)
                            .setDuration(75)
                            .setCurva(x => (y => (-(Math.cos(Math.PI * y) - 1) / 2))(x === 0 ? 0 : Math.pow(2, 10 * x - 10)))

            fase.animar(giro);
            fase.animar(mover);
        }
    }

    animar(animacao){

        animacao.animationFrames = animacao.getFrames();

        this.frames.push(animacao.animationFrames);

        this.animacoes.push(animacao);

        return this;
    }

    update(){

        this.frames.map(frame => frame.next()); //Roda as animações do programa

        if(!this.progresso) this.progresso = "start";

        const problemaAtual = this.problemas[this.progresso];

        if(problemaAtual.satisfeito(this)){

            problemaAtual.consequencia(this);

            this.progresso = problemaAtual.proximo(this);
        }
    }

    problemas = {

        start:{
            satisfeito: (fase) => true,

            consequencia: (fase) =>{

                // desativa o arraste inicialmente, até clicar no vértice
                fase.outputDragAngle.map(output => output.removeInputs());

                //Muda texto quando o player clica no primeiro vértice e ativa o arraste
                fase.clicouPrimeiroVertice  = fase.primeiroClick();   
            },

            proximo: (fase) => "clicouVertice"

        },

        clicouVertice: {
            satisfeito: (fase) => fase.clicouPrimeiroVertice.estado.finalizado,

            consequencia: (fase) => null,

            proximo: (fase) => 180
        },

        180: {
            //Se dois outputs de arraste tiverem finalizado(posições corretas), então 180° está satisfeito
            satisfeito: (fase) => fase.outputDragAngle.filter(output => output.estado.finalizado).length == 2,

            consequencia: (fase) => {

                fase.animar180Graus();

                fase.outputDragAngle.map(output => output.removeInputs());

            },

            proximo: (fase) => "finalizado"
        },

        finalizado:{
            satisfeito: () => false
        }
    }

    //Funções, outputs etc. usados nos problemas

    //No primeiro click dos vértices, muda o texto
    //Roda apenas uma vez
    primeiroClick(){

        //Inputs: os 3 criarTracejados -> quando um deles atualiza, notifica esse output também

        const fase = this;

        return new Output(fase.outputClickVertice)
               .setUpdateFunction(function(novoEstado){


                    this.estado = {...this.estado, ...novoEstado}

                    const estado = this.estado;

                    // console.log(estado, "this")

                    if(estado.finalizado) return;

                    if(estado.ativado){

                        estado.finalizado = true;

                        mudarTexto();
                        // ativarArraste(); feito dentro do mudar texto
                    }
               })

        //Funções auxiliares
        function mudarTexto(){
            
            const dialogo = ["Veja o tracejado paralelo a aresta oposta ao vértice",
                             "Ele tem buracos onde se encaixam ângulos",
                             "Tente arrastar os ângulos para esses buracos"]

            const anim1 = new TextoAparecendo(fase.text.element).setOnStart(() => fase.changeText(dialogo[0]));
            const anim2 = new TextoAparecendo(fase.text.element).setOnStart(() => fase.changeText(dialogo[1]));
            const anim3 = new TextoAparecendo(fase.text.element).setOnStart(() => fase.changeText(dialogo[2]));


            anim2.setOnTermino(ativarArraste); // ativa o arraste quando terminar o dialogo

            fase.animar(new AnimacaoSequencial(anim1,anim2,anim3));
        }

        function ativarArraste(){

            //Liga os outputs do arraste aos inputs do angle
            for (let i = 0; i < 3; ++i) {

                const angulo = fase.triangulo.angles[i];

                angulo.draggable.addObserver(fase.outputDragAngle[i]);
            }
        }
    }

    animar180Graus(){


        const fase = this;

        const objetos = fase.triangulo.vertices.concat(fase.triangulo.edges);


        const apagarTrianguloAnimacao = new Animacao()
                                        .setValorInicial(1)
                                        .setValorFinal(0)
                                        .setInterpolacao((inicial,final,peso) => inicial*(1-peso) + final*peso)
                                        .setUpdateFunction(function(valor){

                                            objetos.map(objeto => objeto.mesh.material = new THREE.MeshBasicMaterial({color: objeto.material.color, transparent:true, opacity: valor}))
                                        })
                                        .setCurva(x => x < 0.5
                                            ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
                                            : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2)
                                        .setDuration(200)
                                        .voltarAoInicio(false)


        fase.animar(apagarTrianguloAnimacao);


        const dialogo = ["Veja o ângulo resultante da soma dos ângulos do triângulo,",
                         "Ele forma metade de um círculo",
                        "Se um círculo tem 360°, então quantos graus tem metade de um círculo?"]
        
        //Clica automaticamente no vértice, desligando seu output e resetando o triângulo
        const desligarTracejado = () => fase.outputClickVertice.forEach(output => (output.ativado)? output.update({clicado:true}) : null);

        const anim1 = new TextoAparecendo(fase.text.element).setOnStart(() => fase.changeText(dialogo[0]))
        const anim2 = new TextoAparecendo(fase.text.element).setOnStart(() => fase.changeText(dialogo[1]))
        const anim3 = new TextoAparecendo(fase.text.element)
                          .setOnStart(() => fase.changeText(dialogo[2]))
                          .setOnTermino(desligarTracejado)
                          .setDelay(100)

                          
        const index   = fase.outputClickVertice.map((output,indice) => (output.estado.ativado)? indice : false)
                                               .filter(indice => !!indice)[0];
                          
        const vertice = fase.triangulo.vertices[index];

        const circulo = new Circle(vertice.getPosition(), 0.714);
        
        const desenharCirculo = new DesenharMalha(circulo, fase.scene).setDuration(250);
        
        fase.animar(new AnimacaoSequencial(anim1,new AnimacaoSimultanea(anim2,desenharCirculo),anim3))
        
    }
}