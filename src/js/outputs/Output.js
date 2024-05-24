//Observer dos Inputs
export class Output{

    constructor(observed = []){
        this.estado    = {};
        this.observers = [];
        this.backup    = [];
        this.observed  = observed; //Inputs ou Outputs que avisam esse daqui

        for(const watched of observed) watched.observers.push(this);
    }

    /**função de update que recebe o estado novo e atualiza o que for necessário*/
    update(novoEstado){

        this._update(novoEstado); // função update privada

        return this;
    }

    setUpdateFunction(update){
        this._update = update;
        return this;
    }


    /** A fase vira o canvas do handler. Ou seja, todo this.animar() chamado no handler é o this.animar() da fase.
     * Faz com que possa colocar uma animação para rodar na fase sem ter que ter a referencia da fase no handler.
    */
    setCanvas(fase){

        this.animar = fase.animar.bind(this);
        this.fase = fase;
        return this;
    }

    //Output é desligado de todos os seus inputs
    removeInputs(){
        for(const observed of this.observed) observed.removeObservers(observer => observer != this);
        return this;
    }

    //Implementação do observable, é possível um output observar um output, fazendo uma cadeia de outputs
    //input -> Output -> Output -> Output...
    //draggable -> moverVertice -> update triângulo por exemplo
    notify(estado){
        for(const observer of this.observers) if(observer) observer.update(estado);
    }

    addObserver(observer){
        this.observers.push(observer);

        if(observer.observed) observer.observed.push(this);
        
        return this;
    }
    
    
    removeObserver(criteria){
        this.observers = this.observers.filter(criteria);

        console.log(this.observers.filter(criteria))
        return this;
    }

    removeObservers(criteria = () => false){
        
        this.observers = this.observers.filter(criteria);
    
        return this;
    }

    addInputs(...inputs){

        for(const input of inputs){

            console.log(input, inputs)
            input.addObserver(this);
        }

        return this;
    }

    setEstadoInicial(estado){

        this.estado = estado;

        return this;
    }

    setName(name){
        this.name = name;
        return this;
    }
    
    
    ativar(on){

        if(on){
          this.addInputs(...this.backup);
        }
        else{
          this.backup   = [...this.observed];
          this.removeInputs();
        }

        
    }
}