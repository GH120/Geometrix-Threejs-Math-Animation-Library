import { apagarObjeto } from "../animacoes/apagarObjeto";
import { Clickable } from "../inputs/clickable";
import { Hoverable } from "../inputs/hoverable";
import { HoverPosition } from "../inputs/position";
import { Objeto } from "../objetos/objeto";
import { Tracejado } from "../objetos/tracejado";
import { Output } from "./Output";
import * as THREE from 'three';

export default class DividirEmTriangulos extends Output{

    constructor(poligono, fase, ativar=true){

        super();

        this.poligono = poligono;
        this.fase = fase;
        this.createOutputs();
        this.createInputs();

        this.setEstadoInicial({
            trianguloAtual: null, 
            triangulosAtivos: [],
            VerticesSelecionados: [],
            verticesUsados: [],
            trianguloDesenhado: null, 
            arestas: new Set(),
            arestasNovas: [],
            cor: null
        });

        if(ativar) this.Configuracao1();
    }

    update(novoEstado){

        this.estado = {...this.estado, ...novoEstado};

        const estado = this.estado;

        this.notify(estado);

        switch(estado.configuracao){
            case(1)   : this.Configuracao1(); break;
            case(2)   : this.Configuracao2(); break;
            case('2b'): this.Configuracao2b(); break;
            case(3)   : this.Configuracao3(); break;
            case('3b'): this.Configuracao3b(); break;
        }

        console.log(estado)
    }

    createOutputs(){

        const vertices   = this.poligono.vertices;

        // const tracejados = vertices.map(v => new Tracejado().addToScene(this.fase.scene))

        //Outputs
        this.outputSelecionarVertice    =  vertices.map(vertex => this.selecionarVertice(vertex))
        this.outputAdicionarVertice     =  vertices.map(vertex => this.adicionarVertice(vertex))
        this.outputHighlightArestas     =  vertices.map(vertex => this.highlightArestas(vertex))

    }

    createInputs(){
        //Inputs
        const vertices     = this.poligono.vertices;

        //Adiciona o clickable ao vertice, agora todo vertice tem vertice.clicable
        vertices.forEach((vertice) => new Clickable(vertice, this.fase.camera));
        vertices.forEach((vertice) => new Hoverable(vertice, this.fase.camera));
        
        const plano        = Objeto.fromMesh(new THREE.Mesh(
            new THREE.PlaneGeometry(100,100),
            new THREE.MeshBasicMaterial({color:0xffffff})
        ))
        
        this.plano = plano;

        new HoverPosition(plano, this.fase.camera);
    }

     //Configurações que ligam inputs aos outputs
    //Basicamente os controles de cada estado da fase
    Configuracao1(){

        this.removeInputs();

        const finalizados = this.estado.verticesUsados;


        var index = 0;
        for(const vertice of this.poligono.vertices){

            if(finalizados.includes(vertice)) {
                index++
                continue;
            };

            const criarTriangulo = this.outputSelecionarVertice[index];

            vertice.clickable.addObserver(criarTriangulo);

            this.addInputs(criarTriangulo);

            index++;
        }
    }

    Configuracao2(estado){

        this.removeInputs();

        // Adicionar tracejados?

        this.estado = {...this.estado, ...estado};

        const selecionados = this.estado.VerticesSelecionados;
        const finalizados  = this.estado.verticesUsados;


        var index = -1;
        for(const vertice of this.poligono.vertices){
            index++;

            
            if(vertice in selecionados) continue;

            if(finalizados.includes(vertice)) continue;

            

            const adicionarVertice = this.outputAdicionarVertice[index];
            const highlightAresta  = this.outputHighlightArestas[index];

            vertice.clickable.addObserver(adicionarVertice);
            vertice.hoverable.addObserver(highlightAresta);
            vertice.clickable.addObserver(highlightAresta);

            this.addInputs(adicionarVertice);
        }

        this.Configuracao2b({})
    }

    //Ativa o desenhar tracejado dos vertices selecionados
    Configuracao2b(estado){

        this.plano.hoverposition.removeObservers();


        this.estado = {...this.estado, ...estado};

        const selecionados = this.estado.VerticesSelecionados;


        var index = 0;
        for(const vertice of this.poligono.vertices){

            const desenharTracejado = this.desenharTracejado(vertice, new Tracejado(vertice.getPosition(), vertice.getPosition()).addToScene(this.fase.scene));

            if(selecionados.includes(vertice)){

                this.plano.hoverposition.addObserver(desenharTracejado);

            }

            index++;
        }
    }

    Configuracao3(novaInformacao){

        this.removeInputs();

        this.estado     = {...this.estado, ...novaInformacao};

        //Muda algumas informações, como vértices usados e triângulos ativos
        const estado    = this.estado;

        
        const novoTriangulo = estado.trianguloDesenhado;

        const arestasUsadas = estado.arestas;

        estado.triangulosAtivos.push(novoTriangulo);


        for(const vertice of this.poligono.vertices){

            const position = vertice.getPosition();

            const arestasDesseVertice = Array.from(arestasUsadas).filter(aresta => aresta.origem .equals(position) || 
                                                                                   aresta.destino.equals(position))

            const duasArestas    = arestasDesseVertice.length == 2;

            if(duasArestas){

                const mesmoTriangulo = arestasDesseVertice[0].trianguloId == arestasDesseVertice[1].trianguloId;

                //Resolver problema de triângulo consecutivo

                if(mesmoTriangulo) 
                    estado.verticesUsados.push(vertice)
            } 
        }

        //Reseta cor dos vértices selecionados e colore as arestas
        estado.VerticesSelecionados.map(vertice => {
            vertice.material = new THREE.MeshBasicMaterial({color:0x8d8d8d});
            vertice.update();
        });

        estado.VerticesSelecionados = [];



        this.Configuracao1();
    }

    Configuracao3b(estado){

        //Adiciona arestas novas
        this.estado = {...this.estado, ...estado};

        const trianguloId = this.estado.trianguloAtual;

        const arestas     = this.estado.arestasNovas;

        arestas.map(aresta => aresta.trianguloId = trianguloId);

        arestas.forEach(aresta => this.estado.arestas.add(aresta))
    }


    //Transformar em um output só:
    selecionarVertice(vertice){

        const fase = this.fase;

        const controle = this;
        
        return new Output()
               .setUpdateFunction(function(estadoNovo){

                    this.estado = {...this.estado, ...estadoNovo};

                    const estado = this.estado;



                    if(estado.clicado){

                        const cor = corAleatoria()

                        this.notify({
                            VerticesSelecionados: [vertice, ],
                            cor: cor,
                            trianguloAtual: controle.estado.trianguloAtual+1,
                            configuracao: 2
                        });

                         vertice.mesh.material = new THREE.MeshBasicMaterial({color:cor});

                    }
               })

        //Funções auxiliares
        //Essa função vai ser usada para escolher a cor do novo triângulo a ser criado
        //Isso inclui tanto seus vértices quanto suas arestas
        function corAleatoria() {   

            const inteiroAleatorio = (fator) => Math.round(Math.random() * fator);

            return [0xff0000,0x00ff00,0x0000ff]
                    .map(cor => inteiroAleatorio(cor))
                    .reduce((a,b) => a + b);
            
        } 
    }

    //Adiciona vértices ao triângulo sendo construido
    adicionarVertice(vertice){

        const fase = this.fase;

        const controle = this;

        return new Output()
               .setUpdateFunction(function(estadoNovo){

                    this.estado = {...this.estado, ...estadoNovo};

                    const estado = this.estado;

                    const selecionados = controle.estado.VerticesSelecionados;

                    const cor = controle.estado.cor;
                
                    //Adiciona vértice ao triangulo a ser formado
                    if(estado.clicado){

                        vertice.mesh.material = new THREE.MeshBasicMaterial({color:cor});

                        this.notify({
                            VerticesSelecionados: [...selecionados, vertice],
                            configuracao: '2b'
                        })
                    }

                    //Três vértices selecionados, então triangulo está pronto para ser desenhado
                    if(selecionados.length >= 3){

                        const triangulo = desenharTriangulo();

                        this.notify({
                            trianguloDesenhado: triangulo,
                            configuracao: 3
                        });

                    }
               })

        function desenharTriangulo(){

            const vertices  = controle.estado.VerticesSelecionados;

            const posicoes  = vertices.map(vertice => vertice.getPosition())

            //Verifica se está no sentido anti-horário
            const v1 = new THREE.Vector3().copy(posicoes[1]).sub(posicoes[0]);
            const v2 = new THREE.Vector3().copy(posicoes[2]).sub(posicoes[0]);
            const crossProduct = v1.cross(v2);

            if(crossProduct.z < 0){
                const temporario = posicoes[1];
                posicoes[1] = posicoes[0];
                posicoes[0] = temporario
            }

            //Constrói a malha
            const cor      = controle.estado.cor;
            const geometry = new THREE.BufferGeometry().setFromPoints(posicoes);
            const material = new THREE.MeshBasicMaterial({ color: cor });  

            const trianguloTransparente = new THREE.Mesh(geometry, material);
            
            fase.scene.add(trianguloTransparente);

            const animarAparecendo = apagarObjeto(Objeto.fromMesh(trianguloTransparente))
                                    .reverse()
                                    .setDuration(100)
                                    .setValorFinal(0.5)

            fase.animar(animarAparecendo)

            return trianguloTransparente;
        }
    }

    removerVertice(vertice){
        
    }

    desenharTracejado(vertice, tracejado){

        //Input hover do plano, diz a posição do mouse

        return new Output()
               .setUpdateFunction(function(novoEstado){

                    this.estado = {...this.estado, novoEstado};

                    const estado = novoEstado;

                    //Pega tracejado e desenha ele do vértice até a posição do mouse
                    //Desenha um tracejado desse vértice até o ponto

                    tracejado.origem  = vertice.getPosition();

                    tracejado.destino = estado.position;

                    tracejado.update();
               })
    }

    highlightArestas(vertex){

        //Inputs hover dos vértices para ativar a aresta
        //       click dos vértices para fixar sua cor

        const controle = this;

        controle.poligono.edges.map((aresta,index) => aresta.index = index)

        return new Output()
               .setUpdateFunction(function(estadoNovo){

                    this.estado = {...this.estado, ...estadoNovo};

                    const estado = this.estado;


                    estado.arestas = encontrarAresta();

                    if(estado.dentro){

                        estado.valido = true;

                        if(!estado.finalizado) mudarCorVertice();

                        mudarCorArestas(estado.arestas);
                        
                    }

                    if(estado.valido && estado.clicado){

                        estado.finalizado = true;

                        estado.valido     = false;
                        
                        const arestas = estado.arestas;

                        if(arestas) controle.Configuracao3b({arestasNovas: arestas});

                        controle.outputHighlightArestas.map(output => output.estado = {});
                    }

                    if(estado.valido && !estado.dentro){

                        estado.valido = false;
                        
                        console.log(estado.arestas, estado)

                        voltarCorInicial(estado.arestas);

                    }


               })

        //Funções auxiliares
        function mudarCorVertice(){

            const cor = controle.estado.cor;

            vertex.mesh.material = new THREE.MeshBasicMaterial({color:cor});

        }
        //Concertar a gambiarra da aresta, as vezes não verifica aresta finalizada

        function mudarCorArestas(arestas){

            const cor = controle.estado.cor;

            if(!arestas) return;

            arestas.map(aresta => {

                console.log(aresta, arestas)

                if(controle.estado.arestas.has(aresta)) return;
                
                aresta.mesh.material = new THREE.MeshBasicMaterial({color:cor});
                
            })
        }

        function voltarCorInicial(arestas){

            vertex.mesh.material = new THREE.MeshBasicMaterial({color:0x828282});

            if(!arestas) return;


            arestas.map(aresta => {

                console.log(aresta, arestas)

                if(controle.estado.arestas.has(aresta)) return;

                aresta.mesh.material = new THREE.MeshBasicMaterial({color: 0x525252})
                
                aresta.update();

            })
        }

        function encontrarAresta(){

            const arestasFinalizadas = controle.estado.arestas;


            const arestasValidas = controle.estado.VerticesSelecionados.flatMap(vertex2 =>
        
                controle.poligono.edges.map(edge => 

                        !arestasFinalizadas.has(edge) &&
                        
                        (edge.origem.equals(vertex2.getPosition()) && 
                        edge.destino.equals(vertex.getPosition())) 
                        ||
                        (edge.origem.equals(vertex.getPosition())  &&
                        edge.destino.equals(vertex2.getPosition()))
                )
            )

            const indices = arestasValidas.map((valida, index) => (valida)? index % controle.poligono.numeroVertices : -1).filter(valor => valor != -1);

            // console.log(indices, "sim")

            const arestas = (indices.length)? indices.map(indice => controle.poligono.edges[indice]) : null;

            return arestas;
        }

    }
    
    removeInputs(){

        this.poligono.vertices.map(vertice => vertice.removeAllOutputs());

        this.plano.removeAllOutputs();


        super.removeInputs();
    }
}