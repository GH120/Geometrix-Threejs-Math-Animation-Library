import * as THREE from 'three';
import { Input } from './Input';
import { Hoverable } from './hoverable';
import { Output } from '../outputs/Output';

export class Clickable extends Input{

  constructor(object,camera,container) {
    super(object,camera, container);
    
    this.dragging = false;

    this.outputMudarCursor(object, camera, container)

    this.numeroClicks = 0;

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

                        const setCursor = camera.fase.settings.setCursor;

                        if(!hoverable.observers.length) 
                          return setCursor(this.estado.cursorInicial);

                        if(novoEstado.dentro) 
                          setCursor('pointer')
                        else 
                          setCursor(this.estado.cursorInicial)
                      })
                      .setEstadoInicial({
                        cursorInicial: 'default'
                      })
  }
}

//Recebe inputs do Clickable e retorna clicado apenas se pressionou duas vezes
//Pode substituir clickable em outros outputs adicionando esse como output: clickable -> doubleClick -> output
export class DoubleClick extends Output{

  constructor(objeto){

    super();

    this.setEstadoInicial({
      numeroClicks:0
    });
  }

  update(novoEstado){

      const estado = this.estado;

      if(!novoEstado.clicado) return;

      estado.numeroClicks++;

      setTimeout(() => estado.numeroClicks = 0, 500);

      if(estado.numeroClicks >= 2){

        estado.numeroClicks = 0;

        this.notify({clicado: true, doubleClick:true})

      }
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
