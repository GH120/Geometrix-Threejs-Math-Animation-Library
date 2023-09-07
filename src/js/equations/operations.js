import { Distributividade } from "../animacoes/distributividade";
import { ExpoenteParaMult } from "../animacoes/expoenteParaMult";
import { TextoAparecendo } from "../animacoes/textoAparecendo";
import { Addition, Minus, Multiplication, Parenthesis, Square, Value, VariableMultiplication } from "./expressions";


class Somar {

    constructor(equation, expression){
        
        this.expression = expression;
        this.escopo = this.obterEscopo(expression);

        console.log(this.escopo);
    }
    //Check if scope is not empty, like -1x
    static requirement(expression){                                         //Alterar esse daqui, eliminar apenas variable multiplication ou escopos vazios
        return expression.father && expression.father.type != "equality" && expression.father.type != "multiplication" && expression.type != "addition";
    }

    somaValida(termo2){

        const foraDoEscopo = !this.estaNoEscopo(termo2);

        if(foraDoEscopo) return false;

        const termo1 = this.expression;

        if(termo1.igual(termo2)) return [termo1, new Value(1), new Value(1)];

        if(termo1.type == "multiplication"){
            
            if(termo2.igual(termo1.left)) return [termo1.left, new Value(1), termo1.left.sibling];

            if(termo2.igual(termo1.right)) return [termo1.right, new Value(1), termo1.right.sibling];
        }

        if(termo2.type == "multiplication"){
            
            if(termo1.igual(termo2.left)) return [termo2.left, new Value(1), termo2.left.sibling];

            if(termo1.igual(termo2.right)) return [termo2.right, new Value(1), termo2.right.sibling];
        }

        if(termo1.type == termo2.type && termo2.type == "multiplication"){

            if(termo2.left.igual(termo1.left)) return [termo1.left, termo2.left.sibling, termo1.left.sibling];

            if(termo2.left.igual(termo1.right)) return [termo1.left, termo2.right.sibling, termo1.left.sibling];

            if(termo2.right.igual(termo1.left)) return [termo1.right, termo2.left.sibling, termo1.left.sibling];

            if(termo2.right.igual(termo1.left)) return [termo1.right, termo2.right.sibling, termo1.left.sibling];
        }

        //Resultado => new Multiplication(first, new Addition(second, third)) 
    }

    obterEscopo(expression){

        if(expression.father.type == "multiplication") return expression.father;
        if(expression.father.type == "square") return expression.father;
        if(expression.father.type == "addition"){
            if(expression.father.father.type != "equality") // se a adição não for filha da igualdade, seu escopo é maior
                return this.obterEscopo(expression.father)
            else
                return expression.father;
        }

    }

    estaNoEscopo(expression){
        return this.escopo.nodes.filter(node => node == expression).length;
    }
}
export class Operations{

    constructor(expression, programa){

        this.expression = expression;
        this.programa   = programa;

        this.basicOperations = ["toSquare", "parenthesis", "simplify", "variableMultiplication"]
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
        createOption("simplificar", "toSquare")
        createOption("somar", "somar")

        options.addEventListener("change", () => this.chooseOption(options.value));
      
        return options;
    }

    chooseOption(nome, recursion=true){

        const isBasicOperation = this.basicOperations.filter(name => name == nome).length;

        if(isBasicOperation && recursion) this.basicOperations.map(operation => this.chooseOption(operation, false));

        // Operação escolhida das opções
        const operacaoEscolhida = this.operations[nome];
    
        //Para cada subexpressão da expressão, vê se ela se encaixa com os requerimentos da operação escolhida
        for(const expression of this.expression.nodes){

            const temOperacao = operacaoEscolhida.requirement(expression);

            if(temOperacao) {

                const html = expression.element;

                html.classList.add("selectable")

                //Create on click as a method of the operations that takes in values and returns an on click function
                //Works for addition and other more complex click operations with states
                html.onclick = () => {
                    const action = operacaoEscolhida.action(expression);

                    const result = operacaoEscolhida.result(expression);

                    expression.substitute(result);

                    this.programa.animar(action);

                    action.onStart(() => this.animando = true)

                    action.setOnTermino(() => {
                        if(!this.animando){
                            this.expression.update();
                            this.eliminarZero(result);
                            this.chooseOption(nome);
                        }
                        return this.animando = false;
                    });

                    html.classList.remove("selectable");

                }

            }
            
        }
    }

    //Consertar a eliminação da opção escolhida
    eliminarZero(result, nome) {

        if(result.type == "value" && result.value == 0 && result.father != "equation"){

            result.father.substitute(result.sibling)

            const fadeOut = new TextoAparecendo(result.father.element)
                                .setValorInicial(10)
                                .setValorFinal(-2)
                                .setOnTermino(() => this.expression.update());

            this.programa.animar(fadeOut);
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

                requirement: function isFree(expression, index = 0){
                    if(!expression.father) return false;
                    if(expression.father.type == "addition") return isFree(expression.father, index+1);
                    if(expression.type == "addition" && index == 0) return false;
                    if(expression.father.type == "equality") return true;
                } ,

                action: (expression) => new TextoAparecendo(expression.element).setValorInicial(10).setValorFinal(-10),

                result: (expression) => {

                    function ladoOposto(expression){
                        if(expression.father.type == "equality"){
                            return expression.sibling;
                        }
                        return ladoOposto(expression.father);
                    }

                    const oposto = ladoOposto(expression);
                    
                    oposto.substitute(new Minus(oposto.copy, expression.copy));

                    return new Value(0)
                }
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
                                    expression.left.left.left.copy,
                                    expression.right.left.left.copy
                                )
                            ),
                            new Parenthesis(
                                new Multiplication(
                                    expression.left.left.left.copy,
                                    expression.right.left.right.copy
                                )
                            )
                           
                        ),
                        new Addition(
                            new Parenthesis(
                                new Multiplication(
                                    expression.left.left.right.copy,
                                    expression.right.left.left.copy,
                                )
                            ),
                            new Parenthesis(
                                new Multiplication(
                                    expression.left.left.right.copy,
                                    expression.right.left.right.copy,
                                )
                            )
                        )
                    )

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

            parenthesis: {
                //Corrigir requirement, father pode ser addition ou equality, mas não multiplicação e exponenciação
                requirement: (expression) => expression.type == "parenthesis",
                                            
                action: (expression) => new TextoAparecendo(expression.element).setValorInicial(10).setValorFinal(-10),
                
                result: (expression) => expression.left
            },

            toSquare: {

                requirement: (expression) => expression.type         == "multiplication" && 
                                             expression.left.type    == "variable"       &&
                                             expression.left.name    == expression.right.name,

                action: (expression) => new TextoAparecendo(expression.element).setValorInicial(10).setValorFinal(-10),

                result:     (expression) => {
                    return new Square(expression.left);
                }
            },

            variableMultiplication:{

                requirement: (expression) => expression.type == "multiplication" &&
                                             ((expression.left.type == "variable" && expression.right && expression.right.type == "value") ||
                                              (expression.left.type == "value" && expression.right && expression.right.type == "variable")),

                action: (expression) => new TextoAparecendo(expression.element).setValorInicial(10).setValorFinal(-10),

                result: (expression) => new VariableMultiplication(expression.left, expression.right)
            },
            somar: {
                requirement: (expression) => { console.log(expression, Somar.requirement(expression));return Somar.requirement(expression)},

                action: (expression) => new TextoAparecendo(expression.element).setValorInicial(1).setValorFinal(0),

                result: expression => {

                    const soma = new Somar(this.expression, expression);

                    this.expression.nodes.map(node => console.log(soma.somaValida(node), node));

                    return expression;
                }
            }

            //TODO: Somar, ou seja, ao selecionar um elemento, ele tem de estar em uma soma
            //Mas essa soma tem de ser válida, ou seja, livre e com elemento de mesma qualidade
            //Somas válidas são aquelas entre expressões do mesmo tipo 
            //Diferenciar de soma de elementos com multiplicação? => inicialmente não, depois detalhar
            //Nesse caso, vamos verificar se também é multiplicação com coeficientes iguais => confuso pra somas complexas
            //No futuro, criar soma complexa, onde transforma b*a + c*a em (b+c)*a
        }
    }
}

