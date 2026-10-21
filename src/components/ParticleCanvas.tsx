import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotSpeed: number;
  shape: 'star' | 'circle' | 'rect';
  alpha: number;
  life: number;
  maxLife: number;
}

export interface ParticleTrigger {
  burst: (x?: number, y?: number, count?: number) => void;
  celebrate: () => void;
}

const COLORS = [
  '#f59e0b', // amber gold
  '#fbbf24', // bright gold
  '#38bdf8', // sky blue
  '#0284c7', // deep sky
  '#10b981', // mint green
  '#34d399', // bright mint
  '#ec4899', // bubblegum pink
  '#a855f7', // magic purple
];

export const ParticleCanvas: React.FC<{
  onRef?: (trigger: ParticleTrigger) => void;
}> = ({ onRef }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Particle updater & renderer
    const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.fill();
    };

    const render = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.18; // gravity
        p.vx *= 0.985; // friction
        p.rotation += p.rotSpeed;
        p.life++;
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);

        if (p.life >= p.maxLife || p.y > canvas.height + 50) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        if (p.shape === 'star') {
          drawStar(ctx, 0, 0, 5, p.size, p.size * 0.45);
        } else if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    const burst = (originX?: number, originY?: number, count = 28) => {
      const startX = originX ?? window.innerWidth / 2;
      const startY = originY ?? window.innerHeight / 2;
      const shapes: ('star' | 'circle' | 'rect')[] = ['star', 'circle', 'rect'];

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 9 + 4;
        particlesRef.current.push({
          x: startX,
          y: startY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 4, // slight upward bias
          size: Math.random() * 12 + 8,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.2,
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          alpha: 1,
          life: 0,
          maxLife: Math.floor(Math.random() * 40 + 45),
        });
      }
    };

    const celebrate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      burst(w * 0.25, h * 0.6, 35);
      setTimeout(() => burst(w * 0.75, h * 0.6, 35), 180);
      setTimeout(() => burst(w * 0.5, h * 0.4, 50), 380);
    };

    if (onRef) {
      onRef({ burst, celebrate });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [onRef]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};
