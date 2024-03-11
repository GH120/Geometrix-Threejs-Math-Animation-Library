import { Fase } from "./fase";

export class PrimeiraFase extends Fase{

    constructor(){
    
        super();

        this.setupTextBox();

        this.progresso = 0;
        this.setupObjects();
        this.createInputs();
        this.createOutputs();
        this.levelDesign();
    }

    //Objetos básicos
    setupObjects(){
        
    }

    //Objetos temporários ou secundários
    setupObjects2(){
    }

    //Onde toda a lógica da fase é realizada, a sequência de animações/texto
    levelDesign(){

        const dialogo1 = [
            "Vimos que dois poligonos são semelhantes quando seus ângulos são congruentes(iguais  overtext )",
            "e seus respectivos lados são proporcionais.", 
            "Como os triângulos são os polígonos mais simples,",
            "também são os mais fáceis de ver se são semelhantes."
        ]

        const dialogo2 = [
            "Usando a carta dos 180°, sabemos que os ângulos tem que somar 180°.",
            "Logo, se temos dois ângulos, o terceiro é o que resta para chegar nos 180°."
        ]

        const dialogo3 = [
            "Arraste os ângulos para os buracos perto do tracejado",
            "Muito bom!",
            "Agora faça o mesmo para o ângulo restante"
        ]

        const dialogo4 = [
            "Como pode ver, os ângulos somam 180°, como a carta já dizia",
            "Agora clique nos ângulos vermelhos para apagá-los"
        ]

        const dialogo5 = [
            "Como acabou de ver, dois ângulos determinam um terceiro no triângulo",
            "E com três ângulos temos um único tipo de triângulo",
            "Agora use a carta de proporcionalidade para ver o que isso significa"
        ]

        const dialogo6 = [
            "Está vendo o triângulo maior, ele tem os mesmos ângulos que o primeiro",
            "Tente arrastar o slider para aumentar o tamanho do primeiro"
        ]

        const dialogo7 = [
            "Como pode ver, o segundo triângulo é apenas uma versão maior do primeiro",
            "Eles são semelhantes",
            "Todo triângulo com os mesmos três ângulos é o um só, apenas mudando a escala",
            "Como dois ângulos determinam o terceiro,", //Glow nos dois vermelho, glow azul no terceiro, revesar entre os três
            "Dois ângulos iguais significam triângulos semelhantes", //Mostra parte da carta aparecendo 
            "Esse é o primeiro caso de semelhança, AA (Ângulo Ângulo), vamos ver os outros"
        ]

        const dialogo8 = [
            "O segundo caso de semelhança de triângulos é bem simples",
            "LLL (três lados proporcionais)", //glowup dos lados mostrando a razão entre eles
            "Como pode ver, ele também é só uma escala",
            "Arraste o slider e observe a proporcionalidade",
            "Conseguimos então o segundo caso" //Mostra outra parte da carta aparecendo 
        ]

        const dialogo9 = [
            "O terceiro caso é o de dois lados do mesmo angulo proporcionais, LAL.", //Glow up dos lados do ângulo
            "Perceba, é possível pegar esses dois lados e prolongá-los",
            "e assim se obtem o segundo triângulo",
            "Tente arrastar os lados",
            "Conseguimos o ultimo caso" //Mostra a ultima parte da carta
        ]

        const dialogo10 = [
            "Com isso temos nossa nova carta, semelhança de triângulos.", //(mostra a carta) 
            "Se satisfazer algum dos três casos, então dois triângulos são semelhantes.", //Rapidamente ilustra cada um ao lado
            "Use ela livremente para resolver os problemas a seguir"
        ]
    }

    //Criação dos controles, input e output
    createInputs(){

        // new Hoverable(this.ponto2,this.camera);
        // new Draggable(this.ponto2, this.camera);
    }

    createOutputs(){
        // this.mostrarAngulo    = new MostrarAngulo(this.angle);
        // this.colorirPonto     = new ColorirOnHover(this.ponto2,0xaa0000,0xffff33).setCanvas(this);
        // this.colorirTracejado = new ColorirOnHover(this.ponto2.tracejado, 0xaa0000, 0xffff33).setCanvas(this);

        // //Função auxiliar para incrementar o contador do ângulo começando de 0
        // //Retorna uma closure
        // this.mostrarAngulo.increment = (() => {
        //     let a = 0; 
        //     return () => {
        //         this.mostrarAngulo.text.elemento.element.textContent = `${Math.round(this.angle.degrees)}° = ${a++} segmentos`
        //     }
        // })();

    }

    //Configurações, nesse caso o controle de arrastar o ponteiro
    Configuracao1(){
    }

    update(){
        // this.atualizarOptions();

        super.update();

        // if(options.atualizar) triangle.update();

        const problema = this.problemas[this.progresso];

        if(!problema) return console.log("Finalizado");

        if(problema.satisfeito(this)){
            problema.consequencia(this);
            this.progresso++;
        }
    }

    //Adicionar equação 4 horas = 120 graus, onde graus e horas são variáveis
    //Adicionar possibilidade de resolver equação por meios algébricos
    //Adicionar menu de perguntas
    problemas = {

        0: {
            satisfeito(fase){

                return fase.dialogoTerminado && Math.round(30 - fase.angle.degrees) == 0;
            },

            consequencia(fase){

                const dialogo1 = `Uma hora tem 30°, como acabou de demonstrar`

                const animacao1 = new TextoAparecendo(fase.text.element).setOnStart(() => fase.changeText(dialogo1))

                const dialogo2 = `Agora, consegue mostrar quanto vale 5 horas?`

                const animacao2 = new TextoAparecendo(fase.text.element).setOnStart(() => fase.changeText(dialogo2))

                fase.animar(new AnimacaoSequencial(animacao1,animacao2))
            }
        },
    }

    //Cria a equação da regra de 3, útil para os problemas
    createEquationBox(equation, position){

        const container = document.createElement('p');
        container.style.fontSize = "25px";
        container.style.fontFamily = "Courier New, monospace";
        container.style.fontWeight = 500;
        container.style.display = 'inline-block';

        // Split the text into individual characters
        const characters = equation.split('');

        // Create spans for each character and apply the fading effect
        characters.forEach((character,index) => {
            const span = document.createElement('span');
            span.textContent = character;
            container.appendChild(span);
        });

        // Create the CSS2DObject using the container
        const cPointLabel = new CSS2DObject(container);       

        cPointLabel.position.x = position[0];
        cPointLabel.position.y = position[1];
        cPointLabel.position.z = position[2];

        this.scene.add(cPointLabel);

        return cPointLabel;
    }


    //Animações dos problemas

}
