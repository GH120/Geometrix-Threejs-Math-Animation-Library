import { ExpoenteParaMult } from "../animacoes/expoenteParaMult";

class Expression{

    //Muda a variável com o nome escolhido para seu novo valor, que também pode ser uma expressão
    changeVariable(value, name){

        if(this.right && this.right.changeVariable(value, name)){
            this.right = value;
        }

        if(this.left && this.left.changeVariable(value, name)){
            this.left = value;
        }

        return false;
    }

    getOptions(){
        const options = document.createElement("select");

        options.id = "openEquationWindow"

        options.class = "button-9";

        options.textContent = "opções";

        let texto = document.createElement("option");

        texto.textContent = "opção 1"

        options.append(texto);
        texto = document.createElement("option");

        texto.textContent = "opção 2"

        options.append(texto);
        texto = document.createElement("option");

        texto.textContent = "opção 3"

        options.append(texto);


        document.body.append(options);
    }

    animar(animacao){
        this.programa.animar(animacao);
    }

    setPrograma(programa){
        this.programa = programa;
        if(this.right) this.right.setPrograma(programa);
        if(this.left) this.left.setPrograma(programa);

        return this;
    }
}

export class Variable extends Expression{

    constructor(name){

        super();

        this.type = "variable";
        this.name = name;
    }

    get html() {

        const span = document.createElement("span");

        span.textContent = this.name;

        this.element = span;

        return span;
    }

    changeVariable(value, name){
        return this.name == name;
    }
}

export class Value extends Expression{
    
    constructor(value){

        super();

        this.type = "value"

        this.value = value;

        this.negative = (value < 0);
    }

    get html(){


        const span = document.createElement("span");

        span.class = "equation-letter"

        span.textContent = (this.negative)? "- " + (-this.value) : this.value;

        this.element = span;

        return span;
    }
}

export class Addition extends Expression{

    constructor(leftOperand, rightOperand){
        super();
        this.left  = leftOperand;
        this.right = rightOperand;
        this.type  = "addition";
    }

    get html(){


        const span = document.createElement("span");

        span.class = "equation-letter"

        span.appendChild(this.left.html);

        const plus = document.createElement("span");

        plus.textContent = (this.right.negative)? " " : " + ";

        span.appendChild(plus);

        span.appendChild(this.right.html)

        this.element = span;

        return span;
    }
}

export class Parenthesis extends Expression{

    constructor(expression){

        super();

        this.left = expression;
        this.type = "parenthesis";
    }

    get html(){


        const span = document.createElement("span");

        span.class = "equation-letter"

        const createElement = (name) => {const e = document.createElement("span"); e.textContent = name; return e}

        span.appendChild(createElement("("));

        span.appendChild(this.left.html);

        span.appendChild(createElement(")"));

        this.element = span;
        
        return span;
    }
}

export class Multiplication extends Expression{

    constructor(leftOperand, rightOperand){
        super();
        this.left  = leftOperand;
        this.right = rightOperand;
        this.type  = "multiplication";
        
        this.checkForAddition();
    }

    checkForAddition(){

        if(this.right.type == "addition"){
            this.right = new Parenthesis(this.right);
        }

        if(this.left.type == "addition"){
            this.left = new Parenthesis(this.left);
        }
    }

    get html(){


        const span = document.createElement("span");

        span.class = "equation-letter"

        span.appendChild(this.left.html);

        const mult = document.createElement("span");

        mult.textContent = " ⋅ ";

        span.appendChild(mult);

        span.appendChild(this.right.html)

        this.element = span;

        return span;
    }
}

export class Square extends Expression{

    constructor(leftOperand, rightOperand){

        super();
        this.left  = leftOperand;
        this.type  = "square";
        
        this.checkForAddition();
    }

    checkForAddition(){

        if(this.left.type == "addition"){
            this.left = new Parenthesis(this.left);
        }
    }

    get html(){

        if(this.element) return this.element


        const span = document.createElement("button");

        span.class = "equation-letter"

        span.appendChild(this.left.html);

        const square = document.createElement("span");

        square.textContent = "²";

        span.appendChild(square);

        span.onclick = () => this.animar(this.options[0].function());

        span.style = `background: none;
        border: none;
        padding: 0;
        margin: 0;
        font: inherit;
        cursor: pointer;
        outline: inherit;
        color: inherit;
        `

        span.style.pointerEvents = "all";

        this.element = span;

        this.right = square;

        return span;
    }

    get options(){
        return [
            {
                "name": "transformar em multiplicação", 
                "function": () => new ExpoenteParaMult(this.element, this.left.element, this.right)
            }
        ]
    }


}

export class Equality extends Expression{

    constructor(leftSide, rightSide){

        super();

        this.left = leftSide;
        this.right = rightSide;

    }

    get html(){

        console.log(this.left,this.right)


        const span = document.createElement("span");

        span.class = "equation-letter"

        span.appendChild(this.left.html);

        const equals = document.createElement("span");

        equals.textContent = " = ";

        span.appendChild(equals);

        span.appendChild(this.right.html)

        this.element = span;

        return span;
    }
}