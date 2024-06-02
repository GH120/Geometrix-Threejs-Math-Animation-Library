import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { MostrarAngulo } from "../outputs/mostrarAngulo";
import Animacao, { AnimacaoSimultanea , AnimacaoSequencial} from "./animation";
import MoverTexto from "./moverTexto";
import { Addition, Equality, Value, Variable } from "../equations/expressions";
import MostrarTexto from "./MostrarTexto";
import * as THREE from 'three';


export class MoverGrausParaPosicaoEquacao extends AnimacaoSimultanea{


    constructor(angulos, fase){

        super();
        this.angulos = angulos; 
        this.fase    = fase;

        this.setAnimacoes([this.moverGrausParaPosicaoEquacao(angulos)]);
    }

    mostrarGrausAparecendo(angle, updateMostrarAnguloCadaFrame = false, mostrarEdesaparecer=true){


        if(!angle.mostrarAngulo){

            angle.mostrarAngulo = new MostrarAngulo(angle).addToFase(this.fase);
        }

        const mostrarAngulo = angle.mostrarAngulo;

        const aparecerTexto = new Animacao()
                                .setValorInicial(0)
                                .setValorFinal(1)
                                .setInterpolacao((a,b,c) => a*(1-c) + b*c)
                                .setUpdateFunction((valor) => {

                                    mostrarAngulo.text.elemento.element.style.opacity = valor

                                    if(updateMostrarAnguloCadaFrame) mostrarAngulo.update({dentro:true});
                                })
                                .setDuration(55)
                                .setDelay(5)
                                .setCurva(x => {

                                    x = 1 - Math.abs(1 - x*2)

                                    return -(Math.cos(Math.PI * x) - 1) / 2;
                                })
                                .voltarAoInicio(false)
                                .manterExecucao(false)
                                .setOnDelay(() => mostrarAngulo.update({dentro:false}))
                                .setOnStart(() => {
                                    mostrarAngulo.update({dentro:true});
                                })

        if(!mostrarEdesaparecer){
            aparecerTexto.setCurva(x => -(Math.cos(Math.PI * x) - 1) / 2)
            aparecerTexto.setOnTermino(() => null)
        }

        return aparecerTexto;

    }

    mostrarGrausDesaparecendo(angle){
        return  this.mostrarGrausAparecendo(angle)
                    .reverse()
                    .voltarAoInicio(false)
                    .setCurva(x => -(Math.cos(Math.PI * x) - 1) / 2)
                    .setOnStart(() => null)
    }

    moverGrausParaPosicaoEquacao(angulos){

        const fase = this.fase;

        const moverGraus = this;

        console.log(angulos.map(angulo => angulo.mostrarAngulo));

        angulos.forEach(angulo => {
            console.log(angulo.mostrarAngulo)
            angulo.mostrarAngulo.text.elemento.element.style.fontFamily = "Courier New, monospace";
            angulo.mostrarAngulo.text.elemento.element.style.fontSize   = "18px";
        })

        const moverTexto = (angulo) => {
                                        const mover = new MoverTexto().voltarAoInicio(true)
                                        
                                        
                                        const elementoCSS2 = angulo.mostrarAngulo.text.elemento;

                                        mover.setText(elementoCSS2)

                                        return mover;
                                    }

        const spline = [
            new THREE.Vector3(1.473684210526315, -2.2692913385826774, 0),
            new THREE.Vector3(-0.39766081871345005, -0.6944881889763783, 0),
            // new THREE.Vector3(3.5,2,0)
        ]

        const mover1 = moverTexto(angulos[0]);
        const mover2 = moverTexto(angulos[1]);
        const mover3 = moverTexto(angulos[2]);

        var novoElemento = null;

        return  new AnimacaoSimultanea(
                    mover1,
                    mover2,
                    mover3
                )
                .setOnStart(criarEquacao)
                .setOnTermino(mostrarEquacaoEMoverParaWhiteboard)


        //Funções auxiliares

        function criarEquacao(){
            const valores = angulos.map( angulo => angulo.variable.getValue());

            const x = new Variable(valores[0]);
            const y = new Value(valores[1]);
            const z = new Value(valores[2]);

            const equacao = new Equality(
                                new Addition(
                                    new Addition(
                                        x,
                                        y
                                    ),
                                    z
                                ),
                                new Value("180°")
                            )

            fase.informacao.equacao = {equacao:equacao, angulos:[x,y,z]}

            novoElemento = new CSS2DObject(equacao.html);

            novoElemento.nome = "SOMADOSANGULOS"

            novoElemento.position.copy(new THREE.Vector3(0,0,0));

            novoElemento.equacao = equacao;

            

            // fase.scene.add(novoElemento);

            fase.equacao = equacao;

            fase.operadores.expression = equacao;

            for(const node of equacao.nodes){

                node.comeco = equacao.element.textContent.indexOf(node.element.innerText);
            }

            const getPosition = (subelemento) => {
                const deslocamento = calcularDeslocamento(equacao,subelemento);

                const posicao = novoElemento.position.clone().add(deslocamento)

                return posicao;
            }

            mover1.setSpline([
                mover1.elementoTexto.position.clone(),
                ...spline,
                getPosition(x)
            ])

            mover2.setSpline([
                mover2.elementoTexto.position.clone(),
                ...spline,
                getPosition(y)

            ])

            mover3.setSpline([
                mover3.elementoTexto.position.clone(),
                ...spline,
                getPosition(z)
            ])
        }


        function calcularDeslocamento(equacao, subequacao){

            const tamanho      = equacao.element.textContent.length;
            const deslocamento = subequacao.comeco + subequacao.element.innerText.length/2;

            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            context.font = '18px Courier New, monospace'

            console.log(context.measureText(equacao.element.textContent))

            const medidas = context.measureText(equacao.element.textContent)

            const width = medidas.width;

            const height = medidas.actualBoundingBoxAscent;

            const offset = (deslocamento/tamanho - 0.5)*width;

            const point = fase.pixelToCoordinates(fase.width/2 + offset, fase.height/2 - 18); //18 é o tamanho da fonte em pixeis

            console.log(point)

            //VERIFICAR BUGS, MODIFICAR CENTRO DA CÂMERA PROVAVELMENTE É DESVIO
            return new THREE.Vector3(point.x,point.y - 1, 0); // por algum motivo o y é 1 se for metade da altura
        }

        function mostrarEquacaoEMoverParaWhiteboard(){

            fase.whiteboard.adicionarEquacao(novoElemento.equacao)

            //Consertar depois, está debaixo da whiteboard
            // novoElemento.element.style.zIndex = 10000;

            fase.scene.add(novoElemento);


            // console.log(novoElemento)

            
            const spline = [
                new THREE.Vector3(-2, -0.3937007874015752, 0),
                new THREE.Vector3(-4.432748538011696,  0.36771653543307, 0),
                // new THREE.Vector3(3.5,2,0)
            ]


            const mostrarTexto = new MostrarTexto(novoElemento)
                                    .setValorFinal(300)
                                    .setProgresso(0);

            const voltarAngulos = angulos.map(angulo => moverGraus.mostrarGrausAparecendo(angulo,false,false))

            const voltarAngulosAnimacao = new AnimacaoSimultanea()
                                            .setAnimacoes(voltarAngulos)
                                            .setOnStart(() =>{

                                                    angulos.map(angulo => angulo.mostrarAngulo.update({dentro:true}));

                                                    //Mudar se tornar escolha de ângulo geral
                                                    angulos[2].mostrarAngulo.text.elemento.element.textContent = '?';
                                            })

            const moverEquacaoParaDiv = new MoverTexto(novoElemento)
                                        .setOnStart(function(){
                                            const equacaoDiv   = fase.whiteboard.equacoes.slice(-1)[0].element;

                                            const dimensoes    = equacaoDiv.getBoundingClientRect();

                                            const posicaoFinal = fase.pixelToCoordinates((dimensoes.right + dimensoes.left)/2, (dimensoes.top + dimensoes.bottom)/2)

                                            this.setSpline([
                                                novoElemento.position.clone(),
                                                ...spline,
                                                posicaoFinal
                                            ])

                                            // fase.whiteboard.equationList.children[0].style.display = "none"
                                            

                                        })
                                        .setOnTermino(() =>{
                                            fase.scene.remove(novoElemento);
                                            // fase.whiteboard.equationList.children[0].style.display = "block"
                                            fase.whiteboard.ativar(true);
                                        })


            const animacao = new AnimacaoSequencial(
                                mostrarTexto, 
                                voltarAngulosAnimacao,
                                moverEquacaoParaDiv
                            )

            animacao.setCheckpointAll(false);

            fase.animar(animacao);
        }

    }

}