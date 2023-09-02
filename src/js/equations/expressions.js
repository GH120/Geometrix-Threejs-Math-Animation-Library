export class Variable{

    constructor(name){
        this.type = "variable";
        this.name = name;
    }

    get html() {
        if(this.element) return this.element;

        const span = document.createElement("span");

        span.class = "equation-letter";

        span.textContent = this.name;

        this.element = span;

        return span;
    }
}

export class Value{
    
    constructor(value){

        this.type = "value"

        this.value = value;

        this.negative = (value < 0);
    }

    get html(){

        if(this.element) return this.element;

        const span = document.createElement("span");

        span.class = "equation-letter";

        span.textContent = (this.negative)? "- " + (-this.value) : this.value;

        this.element = span;

        return span;
    }
}

export class Addition{

    constructor(leftOperand, rightOperand){
        this.left  = leftOperand;
        this.right = rightOperand;
        this.type  = "addition";
    }

    get html(){

        if(this.element) return this.element;

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

export class Parenthesis{

    constructor(expression){
        this.expression = expression;
        this.type = "parenthesis";
    }

    get html(){

        if(this.element) return this.element;

        const span = document.createElement("span");

        span.class = "equation-letter";

        const createElement = (name) => {const e = document.createElement("span"); e.textContent = name; return e}

        span.appendChild(createElement("("));

        span.appendChild(this.expression.html);

        span.appendChild(createElement(")"));

        this.element = span;
        
        return span;
    }
}

export class Multiplication{

    constructor(leftOperand, rightOperand){
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

        if(this.element) return this.element;

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

export class Square{

    constructor(leftOperand, rightOperand){
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

        if(this.element) return this.element;

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

export class Equality{

    constructor(leftSide, rightSide){

        this.left = leftSide;
        this.right = rightSide;

    }

    get html(){

        if(this.element) return this.element;

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