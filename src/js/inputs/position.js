import * as THREE from 'three';
import { Input } from './Input';

export class Position extends Input {

  constructor(object, camera) {

    super(object,camera);

    this.onMouseMove = this.onMouseMove.bind(this);

    window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
  }

  onMouseMove(event) {

    const colision = this.intersectouObjeto(event,this.object);

    if(!colision) return;

    //Manda os observadores atualizarem
    this.notify({position: colision.point});

  }
}