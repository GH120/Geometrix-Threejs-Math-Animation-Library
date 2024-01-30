import React, { useEffect, useRef } from 'react';
import './style.css'

import pythagorasImage from '../../assets/MiniCarta.png';
import { PythagorasCard } from '../../js/cards/pythagorasCard';

function CartaPythagoras(props) {
    const { valor, naipe, settings } = props;
    const componenteRef = useRef(null);

    let carta;

    useEffect(() => {
        console.log('current: ', componenteRef.current)
    }, [])

    const handleDragStart = (e) => {
        e.dataTransfer.setData('text/plain', ''); // Define um dado de arraste, que é necessário para ativar o arraste.

        //Cria uma nova carta pitagoras backend
        carta = new PythagorasCard(settings.whiteboard); 

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

            settings.toggleEquationMenu(); //Abre o menu de equações
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
            <img src={pythagorasImage} className="photo"></img>
        </div>
    );
}

export default CartaPythagoras;
