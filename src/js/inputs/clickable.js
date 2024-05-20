import * as THREE from 'three';
import { Input } from './Input';
import { Hoverable } from './hoverable';
import { Output } from '../outputs/Output';

export class Clickable extends Input{

  constructor(object,camera,container) {
    super(object,camera, container);
    
    this.dragging = false;

    this.outputMudarCursor(object, camera, container)

    // Add event listeners for mouse down, move, and up events
    window.addEventListener('click', this.onClick.bind(this), false);
  }

  onClick(event) {

    const point = this.intersectouObjeto(event, this.object);

    const selecionado = !!point;

    //Notifica todos os observadores da nova posição
    this.notify({clicado: selecionado});
    
  }

  outputMudarCursor(object, camera, container){

    const hoverable = this;

    //Output mudar cursor
    const hover = new Hoverable({}, camera, container);

    hover.object = object;

    this.mudarCursor = new Output([hover])
                      .setUpdateFunction(function(novoEstado) {

                        if(!hoverable.observers.length) return;

                        if(novoEstado.dentro) camera.fase.settings.setCursor('pointer')
                        else camera.fase.settings.setCursor(this.estado.cursorInicial)
                      })
                      .setEstadoInicial({
                        cursorInicial: 'default'
                      })
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
