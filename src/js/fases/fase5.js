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

        //Adiciona o draggable ao angulo, agora todo angulo tem angulo.draggable
        angles.map((angle) => new Draggable(angle, this.camera));

    }

    createOutputs(){
        //Outputs
        this.outputClickVertice = this.triangulo.vertices.map(vertex => this.criarTracejado(vertex))
        this.outputDragAngle = this.triangulo.angles.map(angle => this.criarMovimentacaoDeAngulo(angle))
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

    criarMovimentacaoDeAngulo = (angle) => {


        //Inputs: hoverable do ângulo invisível -> {dentro: bool}, 
        //                                      -> diz se o mouse está dentro do invisível
        //
        //        draggable do ângulo real      -> {posicao: vetor, dragging: bool}, 
        //                                      -> diz a posição do mouse e se ele está arrastando o angulo real

        let estado = {}

        const fase = this;

        return new Output()
               .setUpdateFunction(
                    (estadoNovo) => {

                        estado = {...estado, ...estadoNovo}

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
                            console.log("finalizado")
                            estado.finalizado = true;

                            //Roda a animação de movimentar ângulo, é uma função auxiliar abaixo
                            moverAnguloAnimacao(angle);

                            return;
                        }

                        if (!estado.dragging) {
                            angle.mesh.position.copy(angle.position);
                            
                        }

                        estado.valido = false;
                    }
               )

        //Funções auxiliares
        function moverAnguloAnimacao(angle){

            const anguloInicial = angle;
            const anguloFinal   = angle.correspondente;
    
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
    
            const moveAngulo = new Animacao()
                            .setValorInicial(anguloInicial.mesh.position.clone())
                            .setValorFinal(anguloFinal.mesh.position.clone())
                            .setInterpolacao(new THREE.Vector3().lerpVectors)
                            .setUpdateFunction(function(posicao){
                                    anguloInicial.mesh.position.copy(posicao)
                            })
                            .voltarAoInicio(false)
                            .setDuration(75)
                            .setCurva(function easeInOutSine(x) {
                                    return -(Math.cos(Math.PI * x) - 1) / 2;
                                })
            
            fase.animar(animacaoRodaeMoveAngulo);
            fase.animar(moveAngulo)
        }
    }

    criarTracejado = (vertex) => {

        //Input: clickable do vertice, diz se foi o vertice clicado ou não

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
                    function(estado){
                        if (estado.clicado && !ativado){
                            
                            ativado = !ativado

                            const posicao = vertex.mesh.position.clone();
                            const vetorTracejado1 = outros_dois[0].mesh.position.clone().sub(outros_dois[1].mesh.position.clone());
                            const vetorTracejado2 = outros_dois[1].mesh.position.clone().sub(outros_dois[0].mesh.position.clone());
                            
                            const tracejadoJaExistente = fase.hoverInvisivel1 != null;

                            if(tracejadoJaExistente) desativarTracejados(this) //Se já tiver um tracejado existe, desativa ele

                            //Função auxiliar, está logo abaixo do return
                            criarHitboxAngulos(posicao, vetorTracejado1, vetorTracejado2);

                            ligarHitboxHoverInputAoOutputDragAngle()

                            animacaoTracejado(posicao,vetorTracejado1,vetorTracejado2);
                            

                        } else if (estado.clicado) {
                            
                            ativado = !ativado
                            
                            desenharTracejado.stop = true;
                            tracejado.removeFromScene(fase.scene)
                            anguloInvisivel1.removeFromScene(fase.scene)
                            anguloInvisivel2.removeFromScene(fase.scene)

                            //Desativa efeito dos outputs de passar por cima dos angulos invisíveis
                            //Hover não alimenta mais o dragOutput
                            fase.hoverInvisivel1.removeObservers();
                            fase.hoverInvisivel2.removeObservers();
                        }

                        this.ativado = ativado; //Sinaliza se o output foi ativado
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
        function ligarHitboxHoverInputAoOutputDragAngle(){
            fase.outputDragAngle.forEach((output,index) => {

                //Apenas liga se o ângulo for o mesmo
                const angle = fase.triangulo.angles[index];

                if(angle.igual(anguloInvisivel1)) {
                    anguloInvisivel1.hoverable.addObserver(output); //liga o input hoverable do angulo invisivel ao output drag do angulo real
                    angle.correspondente = anguloInvisivel1;
                }
                if(angle.igual(anguloInvisivel2)) {
                    anguloInvisivel2.hoverable.addObserver(output); //liga o input hoverable do angulo invisivel ao output drag do angulo real
                    angle.correspondente = anguloInvisivel2;
                    
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
    }

    animar(animacao){

        animacao.animationFrames = animacao.getFrames();

        this.frames.push(animacao.animationFrames);

        this.animacoes.push(animacao);

        return this;
    }

    update(){

        this.frames.map(frame => frame.next()); //Roda as animações do programa

        // if(options.atualizar) triangle.update();

        if (this.triangulo.equilatero()) {
            this.changeText("VITORIA!!!");
            // botar notif
        }
    }
}