import React, { useEffect, useRef } from 'react';
import './style.css'

function Carta(props) {
    const { valor, naipe, settings, imagem} = props;
    const componenteRef = useRef(null);

    let carta;

    const handleDragStart = (e) => {
        e.dataTransfer.setData('text/plain', ''); // Define um dado de arraste, que é necessário para ativar o arraste.

        //Pega a classe do tipo da carta (ex: LadosParalelogramo)
        const tipoDaCarta = props.tipoDaCarta;

        //Cria o backend do tipo da carta (Por exemplo, pitágoras, paralelogramo etc.)
        carta = new tipoDaCarta(settings.whiteboard); 

        console.log(settings.fase.constructor.name);

        //Começa sua execução
        carta.trigger(settings.fase);

        
    };
    
    const handleDragEnd = async (e) => {
        console.log(componenteRef.current)

        const processar = () => {

            //Quando soltar, analiza se aceita o triângulo
            if(!carta.accept()) return;

            //Se sim, processa
            carta.process();

            settings.ativarMenuCartas(false); //Fecha o menu de cartas

        }

        //Espera 100ms antes de verificar se a carta está dentro
        //Precisa disso pois o hoverable tem um delay para ativar
        await new Promise(resolve => setTimeout(resolve, 100)).then(processar);

    };


    return (
        <div
            className="carta"
            draggable={true}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <img src={imagem} className="photo"></img>
        </div>
    );
}

export default Carta;
