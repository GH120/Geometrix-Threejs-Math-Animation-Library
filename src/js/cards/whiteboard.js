import * as THREE from 'three';

//Obs: edit layout with google webtools later
export class Whiteboard {

    constructor(){

        // this.camera = camera;
        // this.scene  = scene;
        // this.canvas = canvas;

        this.animacoes  = [];
        this.frames     = [];

        //Consegue o elemento html da tela para criar o quadro em branco nele
        try{
            this.start();

            this.initialized = true;
        }
        catch(e){

        }

    }

    start(){

        // linha abaixo: antigamente possuia um elemento ja criado
        // this.equationWindow = document.getElementById("equationWindow");
        // agora o elemento está sendo criado na funcao start
        this.equationWindow = document.createElement("div"); 
        this.equationWindow.id = "equationWindow";
        console.log(this.equationWindow);

        this.createEquationList();

        this.createThreejsCanvas();
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

        const width = 10;
        const height = 8;

        const telaEquacao = this.equationWindow;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);
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

        this.scene    = scene;
        this.camera   = camera;
        this.renderer = renderer;

        

        const animate = () => {
            requestAnimationFrame(animate);
        
            // You can add animations or other updates here
            this.frames.map(frame => frame.next());
        
            // Render the scene
            renderer.render(scene, camera);
        }

        animate();
        
        telaEquacao.appendChild(renderer.domElement);
    }


    //adiciona a equacao
    adicionarEquacao(equacao){

        const ListaEquacoes = this.equationList;

        const htmlElement = equacao.html;

        htmlElement.style.zIndex = 2000;

        ListaEquacoes.appendChild(htmlElement);
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
}