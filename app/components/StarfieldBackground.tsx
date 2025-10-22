'use client';

import { useEffect, useRef } from 'react';

// Configurable constants
const MAX_SPEED = 10;
const MIN_SPEED = -5;
const NUM_STARS = 3000;
const WARP_MULTIPLIER = 2.5;

export default function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationId: number;
    const n = NUM_STARS;
    let w = 0;
    let h = 0;
    let x = 0;
    let y = 0;
    let z = 0;
    let star_color_ratio = 0;
    const star_ratio = 256;
    let star_speed = 1;
    const stars: number[][] = [];
    const opacity = 0.1;
    let cursor_x = 0;
    let cursor_y = 0;
    let dir_x = 0;
    let dir_y = 0;
    let warp = false;
    let context: CanvasRenderingContext2D;

    function init() {
      if (!canvas) return;
      
      for (let i = 0; i < n; i++) {
        stars[i] = new Array(5);
        stars[i][0] = Math.random() * w * 2 - x * 2;
        stars[i][1] = Math.random() * h * 2 - y * 2;
        stars[i][2] = Math.round(Math.random() * z);
        stars[i][3] = 0;
        stars[i][4] = 0;
      }
      
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.zIndex = '-1';
      canvas.width = w;
      canvas.height = h;
      context = canvas.getContext('2d')!;
      context.fillStyle = 'rgb(0,0,0)';
      context.strokeStyle = 'rgb(255,255,255)';
    }

    function anim() {
      context.fillRect(0, 0, w, h);
      
      for (let i = 0; i < n; i++) {
        let test = true;
        const star_x_save = stars[i][3];
        const star_y_save = stars[i][4];
        
        stars[i][0] += dir_x;
        stars[i][1] += dir_y;
        stars[i][2] -= star_speed;
        
        if (stars[i][2] > z) {
          stars[i][2] -= z;
          test = false;
        }
        if (stars[i][2] < 0) {
          stars[i][2] += z;
          test = false;
        }
        
        stars[i][3] = x + (stars[i][0] / stars[i][2]) * star_ratio;
        stars[i][4] = y + (stars[i][1] / stars[i][2]) * star_ratio;
        
        if (star_x_save > 0 && star_x_save < w && star_y_save > 0 && star_y_save < h && test) {
          context.lineWidth = (1 - star_color_ratio * stars[i][2]) * 2;
          context.beginPath();
          context.moveTo(star_x_save, star_y_save);
          context.lineTo(stars[i][3], stars[i][4]);
          context.stroke();
          context.closePath();
        }
      }
      
      animationId = requestAnimationFrame(anim);
    }

    function resize() {
      const newW = window.innerWidth;
      const newH = window.innerHeight;
      
      if (newW !== w || newH !== h) {
        w = newW;
        h = newH;
        x = Math.round(w / 2);
        y = Math.round(h / 2);
        z = (w + h) / 2;
        star_color_ratio = 1 / z;
        cursor_x = x;
        cursor_y = y;
        init();
      }
    }

    function handleMouseWheel(evt: WheelEvent) {
      const delta = evt.deltaY > 0 ? 0.1 : -0.1;
      star_speed += delta;
      if (star_speed < MIN_SPEED) star_speed = MIN_SPEED;
      if (star_speed > MAX_SPEED) star_speed = MAX_SPEED;
    }

    function handleMouseMove(evt: MouseEvent) {
      cursor_x = evt.clientX;
      cursor_y = evt.clientY;
      dir_x = (evt.clientX / w - 0.5) * 0.1;
      dir_y = (evt.clientY / h - 0.5) * 0.1;
    }

    function handleKeyPress(evt: KeyboardEvent) {
      if (evt.key === 'Enter' || evt.key === ' ') {
        if (warp) {
          context.fillStyle = 'rgb(0,0,0)';
          star_speed /= WARP_MULTIPLIER;
          warp = false;
        } else {
          context.fillStyle = `rgba(0,0,0,${opacity})`;
          const newSpeed = star_speed * WARP_MULTIPLIER;
          star_speed = Math.min(newSpeed, MAX_SPEED);
          warp = true;
        }
      }
    }

    // Initialize
    resize();
    anim();

    // Event listeners
    window.addEventListener('resize', resize);
    window.addEventListener('wheel', handleMouseWheel);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      window.removeEventListener('resize', resize);
      window.removeEventListener('wheel', handleMouseWheel);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="starfield-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        background: '#000000'
      }}
    />
  );
}