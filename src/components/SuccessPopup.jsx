import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function SuccessPopup({ onClose }) {
  useEffect(() => {
    // Play Pataka / Firecracker Sound
    const playSound = () => {
      // Using a free fireworks/firecracker sound from mixkit
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2988/2988-preview.mp3');
      audio.volume = 0.6;
      audio.play().catch((e) => console.log('Audio autoplay blocked', e));

      setTimeout(() => {
        const audio2 = new Audio('https://assets.mixkit.co/active_storage/sfx/2988/2988-preview.mp3');
        audio2.volume = 0.4;
        audio2.play().catch((e) => console.log('Audio autoplay blocked', e));
      }, 400);
    };

    playSound();

    // 3D Firecracker/Confetti Animation
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h2>Submitted Successfully! 🎉</h2>
        <p>Your details have been securely saved.</p>
        <p className="popup-highlight">
          <strong>Final Step:</strong> To receive your delivery earnings directly, please open your Zero-Balance Salary Account.
        </p>
        <a 
          href="https://bit.ly/4i35J6m" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="popup-close-btn kotak-btn"
          style={{ display: 'inline-block', textDecoration: 'none', backgroundColor: '#ED1C24', marginTop: '0.5rem' }}
          onClick={onClose}
        >
          Open Kotak Account Now 🚀
        </a>
      </div>
    </div>
  );
}
