import * as THREE from 'three';
import { Input } from './Input';

export class Hoverable extends Input {

  constructor(object, camera) {

    super(object,camera);

    this.onMouseMove = this.onMouseMove.bind(this);

    window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
  }

  onMouseMove(event) {

    const colision = this.intersectouObjeto(event,this.object);

    const isInside = !!colision;

    //Ignora se continua no mesmo estado
    if(this.isInside == isInside) return;

    //Manda os observadores atualizarem
    this.notify({dentro: isInside, position: colision.point});

    this.isInside = isInside;
  }
}