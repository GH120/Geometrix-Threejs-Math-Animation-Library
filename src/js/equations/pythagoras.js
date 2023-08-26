import Equation from "./equations";
import { Clickable } from "../controles/clickable";

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

            //this.instancia.elements.filter(e => e.identity == variavel).map(e => e.style.color == "red");

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

                    if(lado.selecionado) return this.falhou();

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
        alert("sucesso");

        const ladoAntigo = this.variables[variavel][2];

        if(ladoAntigo && ladoAntigo != lado) ladoAntigo.selecionado = false;

        this.variables[variavel][2] = lado;



        if(lado.selecionado) return;

        const ocorrenciasDaVariavel = this.instancia.elements.filter(e => e.identity == variavel);

        ocorrenciasDaVariavel.map(x => x.textContent = lado.valor);

        ocorrenciasDaVariavel.map(x => x.style.color = "gray")

        lado.selecionado = true;

        this.clickables.map(clickable => clickable.removeObserver())

        console.log(this.clickables)

    }

    criarInstancia(variavel){

        if(this.instancia) return;

        const instancia = new Pythagoras(this.programa);

        //Colore a letra selecionada
        instancia.elements.map(element => element.style.color = (element.textContent == variavel)? "red" : "black")

        const isVariavel = (e) => this.variables[e.textContent];

        //Transforma todas as letras em espaços em branco
        instancia.elements.map(element => (isVariavel(element))? element.textContent = "( )" : null)

        instancia.instancia = instancia;

        this.instancia = instancia;
    }
}