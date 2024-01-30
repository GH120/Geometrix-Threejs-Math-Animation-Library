import React from 'react'
import BotaoFase from '../BotaoFase/BotaoFase'

import { IoClose } from "react-icons/io5";

import './style.css'


function MenuFaseNovo({onClose}) {
    return (
        <div>
            <button onClick={onClose} className='botao-invisivel'>
                <IoClose size={50}/>
            </button>
            <table className="tabela">
                <tr>
                    <td className='celula'><BotaoFase /></td>
                    <td className='celula'><BotaoFase faseSelec={2}/></td>
                    <td className='celula'><BotaoFase faseSelec={3}/></td>
                    <td className='celula'><BotaoFase faseSelec={4}/></td>
                </tr>
                <tr>
                    <td className='celula'><BotaoFase faseSelec={5}/></td>
                    <td className='celula'><BotaoFase faseSelec={6}/></td>
                    <td className='celula'><BotaoFase faseSelec={7}/></td>
                    <td className='celula'><BotaoFase faseSelec={8}/></td>
                </tr>
            </table>
        </div>
    )
}

export default MenuFaseNovo