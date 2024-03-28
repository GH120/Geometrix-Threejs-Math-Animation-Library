import React from 'react';
import './style.css';
import { motion } from 'framer-motion';

function Modal({ isOpen, onClose, children }) {
  return (
    isOpen && (
      <motion.div
        initial={{
          opacity: 0
        }} 
        animate={{
          opacity: 1
        }}
        onClick={onClose} 
        className={`background ${isOpen ? 'open' : ''}`}
      >
          <motion.div
            initial={{
              scale: 0,
              translateX: '-50%',
              translateY: '-50%'
            }} 
            animate={{
              scale: 1,
            }}
            
            className={`modal-style ${isOpen ? 'open' : ''}`}
          >
              {children}
          </motion.div>
      </motion.div>
    )
  );
}

export default Modal;
