import * as THREE from 'three';

export class Hoverable {

  constructor(object, camera) {

    this.object = object;
    this.camera = camera;
    this.raycaster = new THREE.Raycaster();
    this.observers = [];

    this.onMouseMove = this.onMouseMove.bind(this);

    window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
  }

  onMouseMove(event) {

    const isInside = !!this.intersectouObjeto(event);

    //Ignora se continua no mesmo estado
    if(this.isInside == isInside) return;

    //Manda os observadores atualizarem
    this.notify(isInside)

    this.isInside = isInside;
  }

  intersectouObjeto(event, objeto){

    // Calculate the mouse position in normalized device coordinates (-1 to +1)
    const mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
    

    // Raycast to determine the intersection point between the mouse and the object's plane
    this.raycaster.setFromCamera(mouse, this.camera);
    
    const intersects = this.raycaster.intersectObject(this.object);

    if (intersects.length > 0) {
      // Update the object's position to the intersection point
      return intersects[0].point;
    }

    return null;
  }

  notify(isInside){
    for(const observer of this.observers) {
      if(observer == null) continue;
      observer.onHover(isInside);
      observer.update();
    }
  }

  addObserver(observer){
      this.observers.push(observer);
      return this;
  }
}