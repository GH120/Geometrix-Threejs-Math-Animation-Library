import * as THREE from 'three';
import { Input } from './Input';

export class Hoverable extends Input {

  constructor(object, camera,container) {

    super(object,camera,container);

    this.onMouseMove = this.onMouseMove.bind(this);

    window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
  }

  onMouseMove(event) {

    const isInside = !!this.intersectouObjeto(event,this.object);
    
    
    //Ignora se continua no mesmo estado
    if(this.isInside == isInside) return;

    // this.verificarPeriodicamente()
    
    //Manda os observadores atualizarem
    this.notify({dentro: isInside, position: (isInside)? this.intersectouObjeto(event,this.object).point : null});

    this.isInside = isInside;

  }

  verificarPeriodicamente(isInside){

    if(this.checkInterval) clearInterval(this.checkInterval)

    const aindaContinuaDentro = () => (isInside == this.dragging)? this.simulateMouseMove(): clearInterval(this.checkInterval)

    // Start an interval to periodically check if mouse is inside
    this.checkInterval = setInterval(aindaContinuaDentro, 500); // Check every 0.5 seconds
  }

  simulateMouseMove() {
    // Simulate a mouse move event
    const event = new MouseEvent('mousemove', {
      bubbles: true,
      cancelable: true,
      clientX: this.lastClientX,
      clientY: this.lastClientY
    });

    this.onMouseMove(event);
  }
}