class Whiteboard {

    constructor(camera, scene, canvas){

        this.camera = camera;
        this.scene  = scene;
        this.canvas = canvas;

        //Consegue o elemento html da tela para criar o quadro em branco nele
        this.equationWindow = document.getElementById("equationWindow");

    }

    //adiciona a equacao
    adicionarEquacao(equacao){

    }

    addWhiteBoard(equationWindow){
        
        const rect = equationWindow.getBoundingClientRect();
    
        const bottomleft = pixelToCoordinates(rect.left, rect.bottom);
    
        const topright   = pixelToCoordinates(rect.right, rect.top) 
    
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
    
        raycaster.setFromCamera(normalizar(x,y), this.camera);
        
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
        const rect = canvas.getBoundingClientRect();
        const normalizedX = (x - rect.left) / canvas.width * 2 - 1;
        const normalizedY = -(y - rect.top) / canvas.height * 2 + 1;
        return new THREE.Vector2(normalizedX,normalizedY);
    }
}