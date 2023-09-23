//Observer dos controlers
export class Handler{

    /**função de update que recebe o estado novo e atualiza o que for necessário*/
    update(estado){

    }

    /** A fase vira o canvas do handler. Ou seja, todo this.animar() chamado no handler é o this.animar() da fase.
     * Faz com que possa colocar uma animação para rodar na fase sem ter que ter a referencia da fase no handler.
    */
    setCanvas(fase){
        this.animar = fase.animar.bind(fase);
        return this;
    }
}