import * as THREE from 'three';

//Obs: edit layout with google webtools later
export class Whiteboard {

    constructor(){

        // this.camera = camera;
        // this.scene  = scene;
        // this.canvas = canvas;

        //Consegue o elemento html da tela para criar o quadro em branco nele
        this.equationWindow = document.getElementById("equationWindow");

        this.createThreejsCanvas();

    }

    createThreejsCanvas(){

        const width = 10;
        const height = 8;

        const telaEquacao = this.equationWindow;

        const scene = new THREE.Scene();
        // const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2+1, height / - 2 +1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.domElement.id = 'TELAEQUACAO';
        renderer.setSize(window.innerWidth * 0.7, window.innerHeight * 0.4); //Magic numebers, se o canvas ficar desconfigurado procurar aqui

        // renderer.domElement.style.position = "absolute";

        camera.position.z = 150;

        scene.background = new THREE.Color(0xffffff);
        

        renderer.domElement.style.zIndex = 2;

        this.scene    = scene;
        this.camera   = camera;
        this.renderer = renderer;

        function animate() {
            requestAnimationFrame(animate);
        
            // You can add animations or other updates here
        
            // Render the scene
            renderer.render(scene, camera);
        }

        animate();
        
        telaEquacao.appendChild(renderer.domElement);
    }


    //adiciona a equacao
    adicionarEquacao(equacao){

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
}