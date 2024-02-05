import React from 'react';
import './style.css';

function Modal({ isOpen, onClose, children }) {
  return (
    isOpen && (
      <div onClick={onClose} className={`background ${isOpen ? 'open' : ''}`}>
        <div className={`modal-style ${isOpen ? 'open' : ''}`}>
          {children}
        </div>
      </div>
    )
  );
}

export default Modal;
