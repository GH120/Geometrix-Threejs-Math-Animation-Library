import * as THREE from 'three';
import { Input } from './Input';

export class Draggable extends Input{

  constructor(object,camera, container) {
    super(object,camera, container);

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

      //Notifica todos os observadores da nova posição, metodo do Input
      this.notify({position: colision.point, dragging:true});
    }
    
  }

  onMouseUp() {
    this.dragging = false;
    this.notify({position:this.lastPosition, dragging:false})
  }
}
