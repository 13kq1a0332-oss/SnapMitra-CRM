import confetti from 'canvas-confetti';

/**
 * Fires a luxury champagne gold & diamond confetti burst
 * Perfect for package reservations, quote locks, and consultation confirmations
 */
export const triggerGoldConfetti = () => {
  const goldColors = ['#D4AF37', '#F3E5AB', '#AA7C11', '#FFFFFF', '#FFDF73', '#FFE4A0'];

  // Initial center-stage burst
  confetti({
    particleCount: 70,
    spread: 60,
    origin: { y: 0.7 },
    colors: goldColors,
    startVelocity: 35,
    scalar: 1.1,
    ticks: 200,
    shapes: ['circle', 'square'],
  });

  // Secondary side celebratory cannons
  setTimeout(() => {
    confetti({
      particleCount: 45,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.75 },
      colors: goldColors,
      startVelocity: 45,
    });
    confetti({
      particleCount: 45,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.75 },
      colors: goldColors,
      startVelocity: 45,
    });
  }, 180);
};

