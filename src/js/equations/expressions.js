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
}

export class Variable extends Expression{

    constructor(name){

        super();

        this.type = "variable";
        this.name = name;
    }

    get html() {

        const span = document.createElement("span");

        span.class = "equation-letter";

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

        span.class = "equation-letter";

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

        span.class = "equation-letter";

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

        span.class = "equation-letter";

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

        span.class = "equation-letter";

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


        const span = document.createElement("span");

        span.class = "equation-letter";

        span.appendChild(this.left.html);

        const square = document.createElement("span");

        square.textContent = "²";

        span.appendChild(square);

        this.element = span;

        return span;
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

        span.class = "equation-letter";

        span.appendChild(this.left.html);

        const equals = document.createElement("span");

        equals.textContent = " = ";

        span.appendChild(equals);

        span.appendChild(this.right.html)

        this.element = span;

        return span;
    }
}