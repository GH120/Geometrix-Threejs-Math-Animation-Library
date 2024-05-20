import * as THREE from 'three';
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';

//Obs: edit layout with google webtools later
export class Whiteboard {

    constructor(containerElement) {
        this.containerElement = containerElement;
        this.animacoes = [];
        this.frames = [];
        this.equationWindow = null; // Initialize as null

        this.equacoes = []
        this.variaveis = [];
        this.variaveisIguais = [];

        this.start();
    }

    start() {
        this.equationWindow = document.createElement("div");
        this.equationWindow.id = "equationWindow";

        this.createEquationList();
        this.createThreejsCanvas();

        // Append the equation window to the provided container element
        this.containerElement.appendChild(this.equationWindow);
    }

    createEquationList(){

        this.equationList = document.createElement("div");

        this.equationList.style.position = "absolute";
        this.equationList.style.display  = "flex";
        this.equationList.style.flexDirection = "column"
        this.equationList.style.alignitems = "center"
        this.equationList.style.marginLeft = "20px"
        this.equationList.style.marginTop  = "10px"

        this.equationList.style.zIndex = 2000;

        this.equationWindow.appendChild(this.equationList);
    }

    createThreejsCanvas(){

        const width = 5;
        const height = 4;

        const telaEquacao = this.equationWindow;

        const scene = new THREE.Scene();
        scene.background = new THREE.TextureLoader().load("https://st.depositphotos.com/1970689/3173/i/450/depositphotos_31734215-stock-photo-blank-whiteboard.jpg");
        // const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2+1, height / - 2 +1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.domElement.id = 'TELAEQUACAO';
        renderer.setSize(window.innerWidth * 0.4, window.innerHeight * 0.4); //Magic numebers, se o canvas ficar desconfigurado procurar aqui

        // renderer.domElement.style.position = "absolute";

        camera.position.z = 150;
        

        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.bottom = 0
        renderer.domElement.style.borderTop = "2px solid black";
        renderer.domElement.style.borderRight = "2px solid black";
        renderer.domElement.style.borderTopRightRadius = "15px";

        const labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(window.innerWidth * 0.4, window.innerHeight * 0.4);
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.bottom = '0px';
        labelRenderer.domElement.hidden = false;
        labelRenderer.domElement.id = "dialogoEquacao"
        labelRenderer.domElement.zindex = 10000;

        this.scene          = scene;
        this.camera         = camera;
        this.renderer       = renderer;
        this.labelRenderer  = labelRenderer;
        this.canvas         = renderer.domElement;
        this.dimensoes      = {width: width, height: height}

        camera.fase = this; //Gambiarra para acessar o canvas no input, refatorar depois


        

        const animate = () => {
            requestAnimationFrame(animate);
        
            // You can add animations or other updates here
            this.frames.map(frame => frame.next());
        
            // Render the scene
            renderer.render(scene, camera);

            // Render the labels
            labelRenderer.render(scene,camera);
        }

        animate();
        
        telaEquacao.appendChild(renderer.domElement);

    }


    //adiciona a equacao
    adicionarEquacao(equacao){

        const ListaEquacoes = this.equacoes;

        const htmlElement = equacao.html;

        htmlElement.style.zIndex = 2000;

        const elementoCSS2 = new CSS2DObject(htmlElement);

        //Atualiza a posição para não ter equações em cima das outras
        const position = new THREE.Vector3(-0.5, 2-ListaEquacoes.length*1, 0);

        elementoCSS2.position.copy(position);

        this.scene.add(elementoCSS2);

        ListaEquacoes.push(elementoCSS2);

        return elementoCSS2;
    }
    
    adicionarTexto(objetoCSS2D){

        const ListaEquacoes = this.equacoes;

        //Atualiza a posição para não ter equações em cima das outras
        const position = new THREE.Vector3(-0.5, 2-ListaEquacoes.length*1, 0);

        objetoCSS2D.position.copy(position);

        this.scene.add(objetoCSS2D);

        ListaEquacoes.push(objetoCSS2D);

        return objetoCSS2D;
    }

    removerEquacao(equacao){

        this.equacoes = this.equacoes.filter(equation => equation != equacao);

        return this;
    }

    removerTodasEquacoes(){

        this.equacoes.map(equacao => this.scene.remove(equacao));

        this.equacoes = [];

        return this;
    }

    addWhiteBoard(equationWindow){
        
        const rect = equationWindow.getBoundingClientRect();
    
        const bottomleft = this.pixelToCoordinates(rect.left, rect.bottom);
    
        const topright   = this.pixelToCoordinates(rect.right, rect.top) 
    
        const width = topright.x - bottomleft.x;
    
        const height = topright.y - bottomleft.y;
    
        //Gambiarra para os objetos estarem em cima do html, mas ter um fundo branco ao invés do background do threejs
        const planeGeometry = new THREE.PlaneGeometry(width,height); // Width, height
    
        // Create a white material
        const whiteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // White color
    
        // Create a mesh using the geometry and material
        const whitePlane = new THREE.Mesh(planeGeometry, whiteMaterial);
    
        whitePlane.position.x = bottomleft.x + width/2;
        whitePlane.position.y = bottomleft.y + height/2;
    
        return whitePlane;
    }
    
    pixelToCoordinates(x,y){
    
        const raycaster = new THREE.Raycaster();
    
        raycaster.setFromCamera(this.normalizar(x,y), this.camera);
        
        const intersects = raycaster.intersectObject(new THREE.Mesh(
        new THREE.PlaneGeometry(100,100),
        new THREE.MeshBasicMaterial({color:0xffffff})
        ));
    
        if (intersects.length > 0) {
        // Update the object's position to the intersection point
        return intersects[0].point;
        }
    
    }
    
    normalizar(x, y) {

        const canvas = this.canvas;

        const rect = this.canvas.getBoundingClientRect();
        const normalizedX = (x - rect.left) / canvas.width * 2 - 1;
        const normalizedY = -(y - rect.top) / canvas.height * 2 + 1;
        return new THREE.Vector2(normalizedX,normalizedY);
    }

    animar(animacao){

        animacao.animationFrames = animacao.getFrames();

        this.frames.push(animacao.animationFrames);

        this.animacoes.push(animacao);

        return this;
    }

    pixelToCoordinates(x,y){
    
        const raycaster = new THREE.Raycaster();
    
        raycaster.setFromCamera(this.normalizar(x,y), this.camera);
        
        const intersects = raycaster.intersectObject(new THREE.Mesh(
        new THREE.PlaneGeometry(100,100),
        new THREE.MeshBasicMaterial({color:0xffffff})
        ));
    
        if (intersects.length > 0) {
        // Update the object's position to the intersection point
        return intersects[0].point;
        }
    
    }
    
    normalizar(x, y) {

        const canvas = this.canvas;

        const rect = this.canvas.getBoundingClientRect();
        const normalizedX = (x - rect.left) / canvas.width * 2 - 1;
        const normalizedY = -(y - rect.top) / canvas.height * 2 + 1;
        return new THREE.Vector2(normalizedX,normalizedY);
    }

    //Talvez adicionar isso na classe operações
    adicionarVariavelDefinida(expressao){

        const igualdade = expressao.name == "equality";

        const temVariavel = expressao.right.type == "variable" || expressao.left.type == "variable"

        //MALDITA SEJA FALTA DE POLIMORFISMO!!!!
        if(igualdade && expressao.right.type == "variable" ){

            const variable = expressao.right;
            
            if(expressao.left.type == "value"){
                variable.valor = expressao.left
                this.variaveis.push(variable)
            }

            if(expressao.left.type == "variable"){
                this.variaveisIguais.push(variable)
            }
        }

        if(igualdade && expressao.left.type == "variable" ){

            const variable = expressao.right;
            
            if(expressao.right.type == "value"){
                variable.valor = expressao.right
                this.variaveis.push(variable)
            }

            if(expressao.right.type == "variable"){
                this.variaveisIguais.push(variable)
            }
        }
    }

}