import Equation from "./equations";
import { Clickable } from "../controles/clickable";

export default class Pythagoras extends Equation{

    constructor(programa){

        super();

        this.programa = programa;

        this.equation = "a² + b² = c²";

        this.variables = {
            'a': ['a', this.lado(false, 'a')],
            'b': ['b', this.lado(false, 'b')],
            'c': ['c', this.lado(true,  'c')]
        }

        this.updateEquationContent()

    }

    //Retorna uma função se diz se o lado é ou não hipotenusa/cateto
    lado(isHipotenusa, name){

        const triangulo = this.programa.triangulo;

        if(!triangulo.retangulo()) return this.falhou();

        return function(){

            if(!this.instancia) this.criarInstancia(name);
        
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

    //Valores necessários => nome da instancia, botão da instância
    selecionar(lado){
        alert("sucesso");
        
        //Pegar valor do lado e substituir na instancia
        this.instancia.adicionar(lado);
    }

    criarInstancia(name){
        const equationContent = document.createElement("div");
        equationContent.id = "equationContent";

        equationContent.style.fontFamily = "Courier New, monospace";
        equationContent.style.fontSize = "25px";
        equationContent.style.fontWeight ="italic";
      
        const equationWindow = document.getElementById("equationWindow");
      
        equationWindow.insertBefore(equationContent, equationWindow.firstChild);
      
        this.equation.split(/([abc])/)
                  .map(letters => {

                          if(this.variables[letters]){
                            const button = this.addButtonToEquation("(  )", () => console.log("yes"))

                            if(name == letters) button.style.color = "red";

                            return button;
                          }
                          const span = document.createElement("span");
      
                          span.textContent = letters;
      
                          return span;
                      })
                  .map(element => equationContent.append(element))
    }
}