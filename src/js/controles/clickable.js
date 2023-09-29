import * as THREE from 'three';
import { Controler } from './Controler';

export class Clickable extends Controler{

  constructor(object,camera) {
    super(object,camera);
    
    this.dragging = false;

    // Add event listeners for mouse down, move, and up events
    window.addEventListener('click', this.onClick.bind(this), false);
  }

  onClick(event) {

    const point = this.intersectouObjeto(event, this.object);

    const selecionado = !!point;

    //Notifica todos os observadores da nova posição
    this.notify({clicado: selecionado});
    
  }
}

export class MultipleClickable extends Controler{

    constructor(objects,camera) {

        super(objects,camera);

        this.dragging = false;
        // Add event listeners for mouse down, move, and up events
        window.addEventListener('click', this.onClick.bind(this), false);
      }
    
      onClick(event) {
    
        const selecionados = this.object.map(object => this.intersectouObjeto(event, object));

        //Notifica todos os observadores da nova posição
        this.notify({clicados: selecionados});
        
      }
}
