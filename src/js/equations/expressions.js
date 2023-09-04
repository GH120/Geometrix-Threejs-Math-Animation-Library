import { ExpoenteParaMult } from "../animacoes/expoenteParaMult";

class Expression{

    //Muda a variável com o nome escolhido para seu novo valor, que também pode ser uma expressão
    changeVariable(value, name){
        
        if(this.right && this.right.changeVariable(value, name)){
            this.right.substitute(value)
        }

        if(this.left && this.left.changeVariable(value, name)){
            this.left.substitute(value)
        }

        return false;
    }

    checkForAddition(){

    }

    get nodes(){

        const nodes = [this]

        if(this.left)  nodes.push(...this.left.nodes);

        if(this.right) nodes.push(...this.right.nodes);

        return nodes;
    }

    substitute(expression){

        if(this.father.right == this){
            this.father.right = expression;
            expression.father = this.father;
            this.father.checkForAddition();
        }
        else if(this.father.left == this){
            this.father.left = expression;
            expression.father = this.father;
            this.father.checkForAddition();
        }
    }

    update(){

        const window = document.getElementById("equationWindow");

        window.removeChild(this.element);

        window.appendChild(this.html);
    }

    get copy(){
        const nodes = [];

        if(this.left) nodes.push(this.left.copy);
        if(this.right) nodes.push(this.right.copy);

        return new this.constructor(...nodes);
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

        this.element    = span;
        span.expression = this;

        return span;
    }

    changeVariable(value, name){
        return this.name == name;
    }

    get copy(){
        return new this.constructor(this.name);
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

        this.element    = span;
        span.expression = this;

        return span;
    }

    get copy(){
        return new this.constructor(this.value);
    }
}

export class Addition extends Expression{

    constructor(leftOperand, rightOperand){
        super();
        this.left  = leftOperand;
        this.right = rightOperand;
        this.type  = "addition";

        this.left.father  = this;
        this.right.father = this;
    }

    get html(){


        const span = document.createElement("span");

        span.class = "equation-letter"

        span.appendChild(this.left.html);

        const plus = document.createElement("span");

        plus.textContent = (this.right.negative)? " " : " + ";

        span.appendChild(plus);

        span.appendChild(this.right.html)

        this.element    = span;
        span.expression = this;

        return span;
    }
}

export class Parenthesis extends Expression{

    constructor(expression){

        super();

        this.left = expression;
        this.type = "parenthesis";
        this.left.father  = this;
    }

    get html(){


        const span = document.createElement("span");

        span.class = "equation-letter"

        const createElement = (name) => {const e = document.createElement("span"); e.textContent = name; return e}

        span.appendChild(createElement("("));

        span.appendChild(this.left.html);

        span.appendChild(createElement(")"));

        this.element    = span;
        span.expression = this;
        
        return span;
    }
}

export class Multiplication extends Expression{

    constructor(leftOperand, rightOperand){
        super();
        this.left  = leftOperand;
        this.right = rightOperand;
        this.type  = "multiplication";

        
        this.left.father  = this;
        this.right.father = this;
        
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

        this.element    = span;
        span.expression = this;

        return span;
    }
}

export class Square extends Expression{

    constructor(leftOperand, rightOperand){

        super();
        this.left  = leftOperand;
        this.type  = "square";

        
        this.left.father  = this;
        
        this.checkForAddition();
    }

    checkForAddition(){

        if(this.left.type == "addition"){
            this.left = new Parenthesis(this.left);
        }
    }

    get html(){


        const span = document.createElement("span");

        span.class = "equation-letter"

        span.appendChild(this.left.html);

        const square = document.createElement("span");

        square.textContent = "²";

        span.appendChild(square);

        this.element    = span;
        span.expression = this;

        this.right = {element:square, changeVariable: () => false};
        this.right.nodes = [this.right];

        return span;
    }


}

export class Equality extends Expression{

    constructor(leftSide, rightSide){

        super();

        this.left = leftSide;
        this.right = rightSide;
        
        this.left.father  = this;
        this.right.father = this;

    }

    get html(){

        const span = document.createElement("span");

        span.class = "equation-letter"

        span.style.fontFamily = "Courier New, monospace";
        span.style.fontSize = "18px";

        span.appendChild(this.left.html);

        const equals = document.createElement("span");

        equals.textContent = " = ";

        span.appendChild(equals);

        span.appendChild(this.right.html)

        this.element    = span;
        span.expression = this;

        return span;
    }
}