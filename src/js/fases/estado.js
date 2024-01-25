import * as THREE from 'three'

//Bem, para salvarmos um estado de uma fase primeiro temos que decidir a estrutura geral de uma fase
//Suponha que ela tenha certos inputs e outputs e ligações entre eles segundo uma certa configuração
//Podemos guardar a configuração e assim teremos que função usar para conseguir esses controles
//Precisamos então guardar os objetos, mas para isso seria necessário fazer uma cópia perfeita deles
//Enfim, acho melhor deixar isso para a configuração fazer
//Também temos um path seguido pelo jogador na fase, precisamos guardar essas etapas
//Acho que essa principalmente é a melhor forma de salvar as ligações
export default class Estado{
    constructor(fase, setupObjeto, configuracao, problemaAtual, informacoes){

        this.fase               = fase;
        this.problema           = problemaAtual;
        this.informacao         = informacoes;
        //A função de configuração dos objetos
        this.setupObjeto        = fase[setupObjeto].bind(fase);
        //A função de configuração da fase, se houver
        this.setupConfiguracao  = (configuracao)? fase[configuracao].bind(fase) : () => null;
    }

    changeState(fase){
        fase.scene = new THREE.Scene();
        this.setupObjeto();
        this.setupConfiguracao();
        fase.progresso   = this.problemaAtual;
        fase.informacao = this.informacao;
    }


}