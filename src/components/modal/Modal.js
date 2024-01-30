import React from 'react'

import './style.css'

function Modal({isOpen, onClose, children}) {
  


    if (isOpen) {
        return (
            <div onClick={onClose} className='background'>
                <div onClick={(e) => {
                    e.stopPropagation();
                }} className='modal-style'>{children}</div>
            </div>
        )
    } else {
        return null;
    }
}

export default Modal