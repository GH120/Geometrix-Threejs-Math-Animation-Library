import Fase from Fase.js

export default class Estado{
    constructor(objetos, cena, outputs, inputs, ligacoes, informacoes){
        this.objetos = objetos
        this.cena = cena
        this.outputs = outputs
        this.inputs = inputs
        this.ligacoes = ligacoes
        this.informacoes = informacoes
    }

    chageState(fase){
        fase.objetos = this.objetos
        fase.scene = this.cena
        fase.outputs = this.outputs
        fase.inputs = this.inputs
        fase.lidacoes = this.ligacoes
        fase.informacoes = this.informacoes
    }


}