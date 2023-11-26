import React, { useEffect, useRef } from 'react';
import './style.css'

import pythagorasImage from '../../assets/pythagoras.png';
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
        }

        await new Promise(resolve => setTimeout(resolve, 100)).then(processar);

        // Use the delay function to wait for 1000 milliseconds (1 second) before calling processar

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
