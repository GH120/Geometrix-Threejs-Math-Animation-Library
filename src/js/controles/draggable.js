import * as THREE from 'three';
import { Controler } from './Controler';

export class Draggable extends Controler{

  constructor(object,camera) {
    super(object,camera);

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(100,100),
      new THREE.MeshBasicMaterial({color:0xffffff})
    );

    this.plane = plane;

    this.dragging = false;

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

      const colision = this.intersectouObjeto(event, {hitbox: this.plane});

      if(!colision) return;

      this.lastPosition = colision.point;

      //Notifica todos os observadores da nova posição
      this.notify({position: colision.point, dragging:true});
    }
    
  }

  onMouseUp() {
    this.dragging = false;
    this.notify({position:this.lastPosition, dragging:false})
  }

  notify(estado){
    for(const observer of this.observers) if(observer) observer.update(estado);
  }

  addObserver(observer){
    this.observers.push(observer);
    return this;
  }

  removeObserver(criteria){
    this.observers = this.observers.filter(criteria);

    console.log(this.observers.filter(criteria))
    return this;
  }
}
