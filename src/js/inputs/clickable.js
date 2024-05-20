import * as THREE from 'three';
import { Input } from './Input';
import { Hoverable } from './hoverable';
import { Output } from '../outputs/Output';

export class Clickable extends Input{

  constructor(object,camera,container) {
    super(object,camera, container);
    
    this.dragging = false;

    //Output mudar cursor
    const hover = new Hoverable({}, camera, container);

    hover.object = object;
    
    hover.addObserver(
      new Output()
      .setUpdateFunction(estado => {
        if(estado.dentro) camera.fase.settings.setCursor('pointer')
        else camera.fase.settings.setCursor('default')
      })
  )

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

export class MultipleClickable extends Input{

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
