import Equation from "./equations";
import { Clickable } from "../controles/clickable";

export default class Pythagoras extends Equation{

    constructor(programa){

        super();

        this.programa = programa;

        this.equation = "a² + b² = c²";

        const cateto     = this.lado(false);
        const hipotenusa = this.lado(true);

        this.variables = {
            'a': ['a', cateto],
            'b': ['b', cateto],
            'c': ['c', hipotenusa]
        }

        this.updateEquationContent()
        this.updateEquationContent()
        this.updateEquationContent()
        this.updateEquationContent()
        this.updateEquationContent()

    }

    //Retorna uma função se diz se o lado é ou não hipotenusa/cateto
    lado(isHipotenusa){

        const triangulo = this.programa.triangulo;

        if(!triangulo.retangulo()) return this.falhou();

        return function(){
        
            let index = 0;
            for(const lado of triangulo.edges){

                const anguloOposto = triangulo.angles[(index++ +2) % 3];

                this.criarControles(lado, anguloOposto, isHipotenusa)

                
            }
        }.bind(this);
    }

    //Cria os controles de um lado
    criarControles(lado, angulo, isHipotenusa){

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

                    return this.selecionar(lado);
                }

                return null;
            }

            clickable.addObserver({update:atualizar})
        }
    }

    falhou(){
        alert("falhou");
    }

    selecionar(lado){
        alert("sucesso");
    }
}