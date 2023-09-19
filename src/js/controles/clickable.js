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

  notify(estado){
    for(const observer of this.observers) if(observer) observer.update(estado);
  }

  addObserver(observer){
    this.observers.push(observer);
    return this;
  }

  removeObserver(criteria = () => false){
    this.observers = this.observers.filter(criteria);
    return this;
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
    
      notify(estado){
        for(const observer of this.observers) if(observer) observer.update(estado);
      }
    
      addObserver(observer){
        this.observers.push(observer);
        return this;
      }
    
      removeObserver(criteria){
        this.observers = this.observers.filter(criteria);
        return this;
      }
}
