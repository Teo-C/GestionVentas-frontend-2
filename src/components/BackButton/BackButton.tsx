import { useNavigate } from 'react-router-dom';
import './BackButton.css';

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <button
      className="back-button"
      onClick={() => navigate(-1)}
      type="button"
      aria-label="Volver"
    >
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="14" cy="14" r="13" fill="var(--bg-tarjeta)" stroke="var(--borde-suave)" strokeWidth="2" />
        <path d="M16.5 20L10.5 14L16.5 8" stroke="var(--marino-principal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}
