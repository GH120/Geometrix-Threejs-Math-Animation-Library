import { Distributividade } from "../animacoes/distributividade";
import { ExpoenteParaMult } from "../animacoes/expoenteParaMult";
import { TextoAparecendo } from "../animacoes/textoAparecendo";
import { Addition, Minus, Multiplication, Parenthesis, Value } from "./expressions";

export class Operations{

    constructor(expression, programa){

        this.expression = expression;
        this.programa   = programa;

    }

    createSelector(){
        const options = document.createElement("select");
      
        options.id = "options"

        options.classList.add('button-9', 'hidden');
      
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
        createOption("simplificar", "simplify")
        
      
        options.addEventListener("change", () => this.chooseOption(options));
      
        return options;
    }

    chooseOption(options){

        const nome = options.value;
          
        // Operação escolhida das opções
        const operacaoEscolhida = this.operations[nome];
    
        //Para cada subexpressão da expressão, vê se ela se encaixa com os requerimentos da operação escolhida
        for(const expression of this.expression.nodes){

            const temOperacao = operacaoEscolhida.requirement(expression);

            // console.log(expression, temOperacao)

            if(temOperacao) {

                const html = expression.element;

                html.classList.add("selectable")

                html.onclick = () => {
                    const action = operacaoEscolhida.action(expression);

                    const result = operacaoEscolhida.result(expression);

                    expression.substitute(result);

                    this.programa.animar(action);

                    action.onStart(() => this.animando = true)

                    action.setOnTermino(() => {
                        if(!this.animando){
                            this.expression.update();
                            this.chooseOption(options);
                        }
                        return this.animando = false;
                    });

                    html.classList.remove("selectable");

                }

            }
            
        }
    }

    get operations(){

        return {

            square: {

                requirement: (expression) => expression.type == "square",

                action:      (expression) => {

                    const base      = expression.left.element;
                    const exponent  = expression.right.element;

                    return new ExpoenteParaMult(expression,base,exponent);
                },

                result:     (expression) => {
                    return new Multiplication(expression.left, expression.left.copy);
                }

            },

            subtraction: {

                requirement: function isFree(expression){
                    if(!expression.father) return false;
                    if(expression.father.type == "addition") return isFree(expression.father);
                    if(expression.father.type == "equality") return true;
                } ,

                action: (expression) => new TextoAparecendo(expression.element).setValorInicial(10).setValorFinal(-10),

                result: (expression) => {
                    this.expression.left = new Minus(this.expression.left, expression.copy);
                    return new Value(0)
                }
            },

            simplify: {

                requirement: (expression) => //expression.type in ["parenthesis", "addition", "multiplication"] &&
                                            //( 
                                              //  expression.type == "parenthesis" && expression.left.type != "addition" || //Parentesis desnecessário
                                                
                                                (
                                                    expression.type == "multiplication" && 
                                                    expression.left.type == "value" && expression.right.type == "value" //Multiplicação e adição de valores
                                                ),
                                            //),
                action: (expression) => new TextoAparecendo(expression.element).setValorInicial(10).setValorFinal(-10),
                
                result:     (expression) => new Value(expression.right.value * expression.left.value)
            },

            distributive: {

                requirement: (expression) => expression.type            == "multiplication" &&
                                             expression.right.left.type == "addition"       && //Gambiarra pois o parentesis conta como expressão a esquerda
                                             expression.left.left.type  == "addition",         //Gambiarra pois o parentesis conta como expressão a esquerda

                action:      (expression) => {

                    //Cria uma equação auxiliar para mostrar os valores da distributividade
                    const equationWindow = document.getElementById("equationWindow");
                    const auxiliary      = document.createElement("div");
                    equationWindow.append(auxiliary);

                    const distributividade = new Distributividade(null)
                                            .addSettings(this.programa.scene,this.programa.camera, this.programa.canvas)
                                            .update(expression, auxiliary)
                                            .setOnTermino(() => equationWindow.removeChild(auxiliary));

                    //Quando a última animação terminar, deleta a equação auxiliar
                    const lastAnimation = distributividade.animacoes.slice(-1)[0];
                    lastAnimation.setOnTermino(() => equationWindow.removeChild(auxiliary))

                    return distributividade;
                },

                result:       (expression) => 
                    new Addition(
                        new Addition(
                            new Parenthesis(
                                new Multiplication(
                                    expression.left.left.left,
                                    expression.right.left.left
                                )
                            ),
                            new Parenthesis(
                                new Multiplication(
                                    expression.left.left.left,
                                    expression.right.left.right
                                )
                            )
                           
                        ),
                        new Addition(
                            new Parenthesis(
                                new Multiplication(
                                    expression.left.left.right,
                                    expression.right.left.left,
                                )
                            ),
                            new Parenthesis(
                                new Multiplication(
                                    expression.left.left.right,
                                    expression.right.left.right,
                                )
                            )
                        )
                    )

            }
        }
    }
}