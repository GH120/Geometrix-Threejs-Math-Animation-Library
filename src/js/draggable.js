import * as THREE from 'three';

export class Draggable {

  constructor(object,camera) {
    this.camera = camera;
    this.object = object;
    this.dragging = false;

    this.raycaster = new THREE.Raycaster();

    this.plane = new THREE.Mesh(
      new THREE.PlaneGeometry(100,100),
      new THREE.MeshBasicMaterial({color:0xffffff})
    );

    // Add event listeners for mouse down, move, and up events
    window.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    window.addEventListener('mouseup', this.onMouseUp.bind(this), false);

  }

  onMouseDown(event) {

    const point = this.intersectouObjeto(event, this.object);

    if(point) this.dragging = true;
  }

  onMouseMove(event) {

    if (this.dragging) {

      const point = this.intersectouObjeto(event, this.plane);

      if(!point) return;

      this.object.position.copy(point);

      //Manda o triangulo atualizar a cena
      this.notify();
    }
    
  }
  

  
  intersectouObjeto(event, objeto){

    // Calculate the mouse position in normalized device coordinates (-1 to +1)
    const mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
    

    // Raycast to determine the intersection point between the mouse and the object's plane
    this.raycaster.setFromCamera(mouse, this.camera);
    
    const intersects = this.raycaster.intersectObject(objeto);

    if (intersects.length > 0) {
      // Update the object's position to the intersection point
      return intersects[0].point;
    }

    return null;
  }

  onMouseUp() {
    this.dragging = false;
  }

  notify(){

    if(this.observer)

    this.observer.update();
  }

  addObserver(observer){
    this.observer = observer;
    return this;
  }
}
