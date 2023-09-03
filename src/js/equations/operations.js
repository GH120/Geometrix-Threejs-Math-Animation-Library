import { Distributividade } from "../animacoes/distributividade";
import { ExpoenteParaMult } from "../animacoes/expoenteParaMult";

export class Operations{

    constructor(expression, programa){

        this.expression = expression;
        this.programa   = programa;

    }

    createSelector(){
        const options = document.createElement("select");
      
        options.id = "openEquationWindow"
      
        options.class = "button-9";
      
        options.textContent = "opções";

        return options;
    }

    getOptions(){

        const options = this.createSelector();
      
        const createOption = (content, tag) => {
            let texto = document.createElement("option");
          
            texto.textContent = content

            texto.value = tag;

            options.append(texto);
        }
      
        createOption("expoente para multiplicação", "square");
        createOption("distributividade", "distributive");
        createOption("mudar de lado", "subtraction");
        
      
        options.addEventListener("change", () => {

          const nome = options.value;
          
          // Operação escolhida das opções
          const operacaoEscolhida = this.operations[nome];
        
          //Para cada subexpressão da expressão, vê se ela se encaixa com os requerimentos da operação escolhida
          for(const expression of this.expression.nodes){

            const temOperacao = operacaoEscolhida.requirement(expression);

            if(temOperacao) {

                const html = expression.element;

                html.style =   `background: none;
                                border: none;
                                padding: 0;
                                margin: 0;
                                font: inherit;
                                cursor: pointer;
                                outline: inherit;
                                color: inherit;
                                pointer-events:all;
                                `;

                html.onclick = () => {
                    operacaoEscolhida.action(expression);
                    html.style = ""
                }

            }
              
          }
        });
      
      
        document.body.append(options);
    }

    get operations(){

        return {

            square: {

                requirement: (expression) => expression.type == "square",

                action:      (expression) => {

                    const base      = expression.left.element;
                    const exponent  = expression.right.element;

                    this.programa.animar(new ExpoenteParaMult(expression,base,exponent))
                }

            },

            distributive: {

                requirement: (expression) => expression.type            == "multiplication" &&
                                             expression.right.left.type == "addition"       && //Gambiarra pois o parentesis conta como expressão a esquerda
                                             expression.left.left.type  == "addition",         //Gambiarra pois o parentesis conta como expressão a esquerda

                action:      (expression) => {

                    const distributividade = new Distributividade(null)
                                            .addSettings(this.programa.scene,this.programa.camera, this.programa.canvas)
                                            .update(expression, document.body);

                    this.programa.animar(distributividade);
                }

            }
        }
    }
}