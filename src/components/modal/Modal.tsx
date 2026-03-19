import React from 'react';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  titulo: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, titulo, children }: ModalProps) {
  if (!isOpen) return null;

  // Manejador para cerrar el modal si el usuario hace clic afuera del cuadro blanco
  const manejarClickOverlay = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={manejarClickOverlay}>
      <div className="modal-contenido">

        <div className="modal-cabecera">
          <h3 className="modal-titulo">{titulo}</h3>
          <button className="modal-boton-cerrar" onClick={onClose} aria-label="Cerrar">
            &times;
          </button>
        </div>

        <div className="modal-cuerpo">
          {children}
        </div>

      </div>
    </div>
  );
}