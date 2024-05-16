import { ExpoenteParaMult } from "../animacoes/expoenteParaMult";

import { mathjax } from 'mathjax-full/js/mathjax.js';
import { TeX } from 'mathjax-full/js/input/tex.js';
import { SVG } from 'mathjax-full/js/output/svg.js';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages'
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";

//DEPRECATED: FALTOU MODIFICAR PARA USAR MATHJAX FULL

//Cria elementos css2d que renderizam MathJax a partir de um texto input
export class MathJaxTextBox extends CSS2DObject{


    constructor(inputTex,position=[0,0,0], tamanhoDaFonte=10){

        super();

        this.adaptor = liteAdaptor();
        RegisterHTMLHandler(this.adaptor);

        const tex = new TeX({ packages: AllPackages });
        const svg = new SVG();
        
        this.html = mathjax.document('', { InputJax: tex, OutputJax: svg });

        this.position.copy(position);

        // Função auxiliar para mudar texto renderizado pelo mathjax dinamicamente
        this.mudarTexto(inputTex, tamanhoDaFonte);
    }

    mudarTexto(text, fontsize=10){

        //Cria o html e coloca ele dentro do div
        const display = this.html.convert(text, { display: true });

        this.element.innerHTML = this.adaptor.innerHTML(display);

        //Configura tamanho da fonte
        this.element.children[0].style.width  = `${fontsize*text.length/10}em`;
        this.element.children[0].style.height = `${fontsize*text.length/10}em`;
        this.element.children[0].style.color  = 'black';

        return this;
    }
}

class Expression{

    //Muda a variável com o nome escolhido para seu novo valor, que também pode ser uma expressão
    changeVariable(value, name){
        
        if(this.right && this.right.changeVariable(value, name)){
            this.right.value = value;
            this.right.substitute(value)
        }

        if(this.left && this.left.changeVariable(value, name)){
            this.left.value = value;
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

    update(window){

        console.log(window)
        console.log(window.children)
        console.log(window.children[0])

        window.children[0].removeChild(this.element);

        window.children[0].appendChild(this.html);
    }

    get copy(){
        const nodes = [];

        if(this.left) nodes.push(this.left.copy);
        if(this.right) nodes.push(this.right.copy);

        return new this.constructor(...nodes);
    }

    get variables(){
        return this.nodes.filter(node => node.type == "variable");
    }

    get sibling(){
        return (this.father)? 
               (this.father.left == this)? 
               (this.father.right)?        this.father.right : 
                                           {type:null}       :
                                           this.father.left  : 
                                           {type:null}       ;
    }

    igual(termo2){
        
        if(this.left && !termo2.left) return false;
        if(this.right && !termo2.right) return false;

        if(this.left.igual(termo2.right) && this.right && this.right.igual(termo2.left)) return true;
        if(this.left.igual(termo2.left) && this.right && this.right.igual(termo2.right)) return true;

        return false;
    }


    getTextElement(){
        return new CSS2DObject(this.html);
    }
}

export class Variable extends Expression{

    constructor(name){

        super();

        this.type = "variable";
        this.name = name;
        this.content = name;
        this.value = null;
    }

    get html() {

        const span = document.createElement("span");

        span.textContent = this.content;

        this.element    = span;
        span.expression = this;

        return span;
    }

    assignValue(value){
        this.value = value;
        return this;
    }

    changeVariable(value, name){
        return this.name == name;
    }

    get copy(){
        return new this.constructor(this.name);
    }

    igual(termo2){
        return this.name == termo2.name;
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

    igual(termo2){
        return this.value == termo2.value;
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

export class Minus extends Expression{

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

        plus.textContent = " - ";

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

        span.class = "equation-letter";
        
        this.element    = span;
        span.expression = this;

        if(this.variableMultiplication){

            const variavel = (this.left.name)? this.left : this.right;

            const valor = variavel.sibling;

            if(valor && valor.type == "value"){
                span.appendChild(valor.html)
                span.appendChild(variavel.html);

                return span;
            }
        }


        span.appendChild(this.left.html);

        const mult = document.createElement("span");

        mult.textContent = " ⋅ ";

        span.appendChild(mult);

        span.appendChild(this.right.html)

        return span;
    }
}

export class VariableMultiplication extends Multiplication{

    constructor(leftOperand, rightOperand){
        super(leftOperand, rightOperand);
    }


    get html(){

        const span = document.createElement("span");

        span.class = "equation-letter";
        
        this.element    = span;
        span.expression = this;

        const variavel = (this.left.name)? this.left : this.right;

        const valor = variavel.sibling;

        span.appendChild(valor.html)
        span.appendChild(variavel.html);

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

        this.right = {element:square, changeVariable: () => false, sibling: this.left};
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

        this.type = "equality"

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