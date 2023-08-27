import Equation from "./equations";
import {TextoAparecendo} from '../animacoes/textoAparecendo'
import { Clickable } from "../controles/clickable";
import { colorirAngulo } from "../animacoes/colorirAngulo";
import { AnimacaoSequencial, AnimacaoSimultanea } from "../animacoes/animation";

export default class Pythagoras extends Equation{

    constructor(programa){

        super();

        this.programa = programa;

        this.clickables = [];

        this.equation = "a² + b² = c²";

        this.variables = {
            'a': ['a', this.lado(false, 'a')],
            'b': ['b', this.lado(false, 'b')],
            'c': ['c', this.lado(true,  'c')]
        }

        this.updateEquationContent()

    }

    //Retorna uma função se diz se o lado é ou não hipotenusa/cateto
    lado(isHipotenusa, variavel){

        const triangulo = this.programa.triangulo;

        if(!triangulo.retangulo()) return this.falhou();

        return function(){

            if(!this.instancia) this.criarInstancia(variavel);

             //Colore a letra selecionada
            this.instancia.elements.map(element => (element.identity == variavel)? element.style.color = "red" : null)

            let index = 0;
            for(const lado of triangulo.edges){

                const anguloOposto = triangulo.angles[(index++ +2) % 3];

                this.criarControles(lado, anguloOposto, isHipotenusa, variavel)
                
            }
        }.bind(this);
    }

    //Cria os controles de um lado
    criarControles(lado, angulo, isHipotenusa, variavel){

        //Controle de click, aciona quando o lado é clicado
        const clickable = new Clickable(lado, this.programa.camera)
        
        const anguloReto = Math.round(angulo.degrees) == 90;

        const falhou = anguloReto && !isHipotenusa || !anguloReto && isHipotenusa;

        if(falhou){

            const atualizar = (estado) => (estado.clicado)? this.falhou() : null;

            clickable.addObserver({update: atualizar})
        }
        else{

            //Se for um cateto, seleciona ele apenas se ele não foi selecionado ainda
            const atualizar = (estado) => {

                if(estado.clicado){

                    return this.selecionar(lado, variavel);
                }

                return null;
            }

            clickable.addObserver({update:atualizar})
        }

        this.clickables.push(clickable);
    }

    falhou(){
        alert("falhou");

    }

    //Valores necessários => nome da instancia, botão da instância
    selecionar(lado, variavel){

        //Muda o lado se a variável já tiver um lado
        const ladoAntigo = this.variables[variavel][2];

        if(ladoAntigo && ladoAntigo != lado) ladoAntigo.selecionado = false;

        this.variables[variavel][2] = lado;


        //Se esse lado for selecionado, então recusa execução
        if(lado.selecionado) return this.falhou();

        //Em caso de sucesso, muda todas as ocorrências da variavel para o valor do lado
        //Por exemplo, todo "a" vira "x-1"
        //Remove os controles de selecionar lado e seta o lado para selecionado
        alert("lado escolhido com sucesso");

        const ocorrenciasDaVariavel = this.instancia.elements.filter(e => e.identity == variavel);

        ocorrenciasDaVariavel.map(x => x.textContent = lado.valor);

        ocorrenciasDaVariavel.map(x => x.style.color = "gray")

        ocorrenciasDaVariavel.map(x => x.valor = lado.valor);

        lado.selecionado = true;

        this.clickables.map(clickable => clickable.removeObserver())

        //Se a instância estiver completa, executa animação
        this.instancia.isComplete();

    }

    criarInstancia(variavel){

        if(this.instancia) return;

        const instancia = new Pythagoras(this.programa);

        const isVariavel = (e) => this.variables[e.textContent];

        //Transforma todas as letras em espaços em branco
        instancia.elements.map(element => (isVariavel(element))? element.textContent = "( )" : null)

        instancia.instancia = instancia;

        this.instancia = instancia;
    }

    isComplete(){

        const verdadeiro = this.elements.filter(x => x.identity)
                                        .map(x => !!x.valor)
                                        .reduce((a,b) => a && b, true)

        const colorirTexto = (texto) => colorirAngulo(texto)
                                        .setValorInicial(0x808080)
                                        .setValorFinal(0x000000)
                                        .voltarAoInicio(false)
                                        .setUpdateFunction(function(valor){
                                            
                                            for(const child of this.objeto.children){
                                                if(child.identity) child.style.color = `#${valor.toString(16)}`
                                            }
                                        })
                                        
        
        const mudarDialogo = new TextoAparecendo(this.programa.text.element)
                               .setDuration(600)
                               .setOnStart(() => this.programa.changeText("resolva a equação para encontrar x"))
        
        const animacao = new AnimacaoSimultanea(colorirTexto(this.equationContent), mudarDialogo);


        if(verdadeiro){
            this.programa.animar(animacao);
        }
    }
}