import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  color: string;
  depth: number;
}

interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  alpha: number;
  active: boolean;
}

export const CosmicStarfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates for subtle parallax
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    window.addEventListener('resize', handleResize);

    // Star generation
    const starColors = [
      '#ffffff',
      '#e0e7ff', // soft blue
      '#c084fc', // purple
      '#67e8f9', // cyan
      '#fef08a', // faint gold
    ];

    let stars: Star[] = [];

    const initStars = () => {
      const starCount = Math.floor((width * height) / 3800);
      stars = [];
      for (let i = 0; i < starCount; i++) {
        const depth = Math.random() * 0.8 + 0.2; // 0.2 to 1.0
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: (Math.random() * 1.6 + 0.4) * depth,
          baseAlpha: Math.random() * 0.7 + 0.2,
          alpha: Math.random() * 0.7 + 0.2,
          twinkleSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
          color: starColors[Math.floor(Math.random() * starColors.length)],
          depth,
        });
      }
    };

    initStars();

    // Meteor state
    const meteors: Meteor[] = [];
    const maxMeteors = 2;

    const spawnMeteor = () => {
      if (meteors.length >= maxMeteors) return;
      if (Math.random() < 0.008) {
        meteors.push({
          x: Math.random() * width * 0.8 + width * 0.1,
          y: Math.random() * (height * 0.4),
          length: Math.random() * 80 + 40,
          speed: Math.random() * 8 + 6,
          angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
          alpha: 1,
          active: true,
        });
      }
    };

    // Render loop
    const render = () => {
      // Smooth mouse follow
      mouseX += (targetMouseX - mouseX) * 0.03;
      mouseY += (targetMouseY - mouseY) * 0.03;

      const offsetX = (mouseX - width / 2) * 0.015;
      const offsetY = (mouseY - height / 2) * 0.015;

      ctx.clearRect(0, 0, width, height);

      // Draw faint cosmic dust glow layers
      const grad = ctx.createRadialGradient(
        width * 0.3 + offsetX * 2,
        height * 0.2 + offsetY * 2,
        50,
        width * 0.3,
        height * 0.2,
        width * 0.6
      );
      grad.addColorStop(0, 'rgba(124, 58, 237, 0.07)');
      grad.addColorStop(0.5, 'rgba(6, 182, 212, 0.03)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      const grad2 = ctx.createRadialGradient(
        width * 0.8 - offsetX * 2,
        height * 0.7 - offsetY * 2,
        50,
        width * 0.8,
        height * 0.7,
        width * 0.5
      );
      grad2.addColorStop(0, 'rgba(236, 72, 153, 0.05)');
      grad2.addColorStop(0.6, 'rgba(59, 130, 246, 0.02)');
      grad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Draw stars with twinkle & depth parallax
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        star.alpha += star.twinkleSpeed;
        if (star.alpha > 1) {
          star.alpha = 1;
          star.twinkleSpeed = -Math.abs(star.twinkleSpeed);
        } else if (star.alpha < 0.15) {
          star.alpha = 0.15;
          star.twinkleSpeed = Math.abs(star.twinkleSpeed);
        }

        const px = star.x + offsetX * star.depth * 15;
        const py = star.y + offsetY * star.depth * 15;

        // Wrap around screen
        const wrappedX = (px + width) % width;
        const wrappedY = (py + height) % height;

        ctx.beginPath();
        ctx.arc(wrappedX, wrappedY, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha;
        ctx.fill();

        // Extra soft glow for brighter, larger stars
        if (star.size > 1.2 && star.alpha > 0.6) {
          ctx.beginPath();
          ctx.arc(wrappedX, wrappedY, star.size * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.globalAlpha = star.alpha * 0.25;
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      // Handle meteors
      spawnMeteor();
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        if (!m.active) {
          meteors.splice(i, 1);
          continue;
        }

        const tailX = m.x - Math.cos(m.angle) * m.length;
        const tailY = m.y - Math.sin(m.angle) * m.length;

        const meteorGrad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        meteorGrad.addColorStop(0, `rgba(255, 255, 255, ${m.alpha})`);
        meteorGrad.addColorStop(0.3, `rgba(103, 232, 249, ${m.alpha * 0.8})`);
        meteorGrad.addColorStop(1, 'rgba(124, 58, 237, 0)');

        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = meteorGrad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Advance meteor
        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;
        m.alpha -= 0.015;

        if (m.alpha <= 0 || m.x > width + 100 || m.y > height + 100) {
          m.active = false;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.95 }}
    />
  );
};
