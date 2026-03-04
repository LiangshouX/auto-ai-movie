import {useEffect, useRef} from 'react';
import {Button} from 'antd';
import {useNavigate} from 'react-router-dom';
import './Portal.css';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
}

const PARTICLE_COUNT = 90;

const Portal = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const frameRef = useRef<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const context = canvas.getContext('2d');
        if (!context) {
            return;
        }

        const particles: Particle[] = Array.from({length: PARTICLE_COUNT}, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            radius: Math.random() * 1.8 + 0.8
        }));

        const resize = () => {
            const ratio = Math.max(window.devicePixelRatio || 1, 1);
            canvas.width = Math.floor(window.innerWidth * ratio);
            canvas.height = Math.floor(window.innerHeight * ratio);
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
        };

        resize();
        window.addEventListener('resize', resize);

        const draw = () => {
            context.clearRect(0, 0, window.innerWidth, window.innerHeight);

            particles.forEach((particle) => {
                particle.x += particle.vx;
                particle.y += particle.vy;

                if (particle.x < 0 || particle.x > window.innerWidth) {
                    particle.vx *= -1;
                }
                if (particle.y < 0 || particle.y > window.innerHeight) {
                    particle.vy *= -1;
                }

                context.beginPath();
                context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                context.fillStyle = 'rgba(90, 170, 255, 0.75)';
                context.fill();
            });

            for (let i = 0; i < particles.length; i += 1) {
                for (let j = i + 1; j < particles.length; j += 1) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 140) {
                        const alpha = 1 - distance / 140;
                        context.strokeStyle = `rgba(90, 170, 255, ${alpha * 0.18})`;
                        context.lineWidth = 1;
                        context.beginPath();
                        context.moveTo(particles[i].x, particles[i].y);
                        context.lineTo(particles[j].x, particles[j].y);
                        context.stroke();
                    }
                }
            }

            frameRef.current = window.requestAnimationFrame(draw);
        };

        frameRef.current = window.requestAnimationFrame(draw);

        return () => {
            window.removeEventListener('resize', resize);
            if (frameRef.current) {
                window.cancelAnimationFrame(frameRef.current);
            }
        };
    }, []);

    return (
        <div className="portal-page">
            <canvas ref={canvasRef} className="portal-canvas"/>
            <div className="portal-center">
                <div className="portal-title">Auto AI Movie</div>
                <Button
                    type="primary"
                    size="large"
                    className="portal-enter-btn"
                    onClick={() => navigate('/workspace')}
                >
                    进入工作台
                </Button>
            </div>
        </div>
    );
};

export default Portal;
