import { useState, useEffect, useRef, useCallback, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';

// ─── Particle Interface ───────────────────────────────────────
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  opacity: number;
}

// ─── Icons ────────────────────────────────────────────────────
const MailIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const ArrowIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const SpinnerIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ animation: 'spin 1s linear infinite' }}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signIn } = useAuth();

  // ─── Existing State ───────────────────────────────────────
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // ─── New State & Refs ─────────────────────────────────────
  const [isTyping, setIsTyping] = useState({ email: false, password: false });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLFormElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const prefersReducedMotion = useRef(false);
  const typingTimeoutRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // ─── Reduced Motion Detection ─────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.current = mq.matches;
    const handler = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // ─── Particle System ──────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: Particle[] = [];
    const PARTICLE_COUNT = 60;
    const CONNECTION_DISTANCE = 120;
    const MOUSE_RADIUS = 150;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const colors = [
      'rgba(0, 212, 255,',
      'rgba(168, 85, 247,',
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const colorBase = colors[Math.random() > 0.5 ? 0 : 1];
      const opacity = 0.15 + Math.random() * 0.35;
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: 1 + Math.random() * 1.5,
        color: colorBase,
        opacity,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion.current) {
          // Mouse interaction
          const mdx = p.x - mouseRef.current.x;
          const mdy = p.y - mouseRef.current.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < MOUSE_RADIUS && mDist > 0) {
            const force = (MOUSE_RADIUS - mDist) / MOUSE_RADIUS;
            p.vx += (mdx / mDist) * force * 0.3;
            p.vy += (mdy / mDist) * force * 0.3;
          }

          // Damping
          p.vx *= 0.99;
          p.vy *= 0.99;

          // Speed limit
          const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if (speed > 1.5) {
            p.vx = (p.vx / speed) * 1.5;
            p.vy = (p.vy / speed) * 1.5;
          }

          // Update position
          p.x += p.vx;
          p.y += p.vy;

          // Wrap edges
          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${p.opacity})`;
        ctx.fill();

        // Connection lines (optimized: only check forward)
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = Math.abs(p.x - p2.x);
          if (dx > CONNECTION_DISTANCE) continue;
          const dy = Math.abs(p.y - p2.y);
          if (dy > CONNECTION_DISTANCE) continue;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DISTANCE) {
            const lineOpacity = (1 - dist / CONNECTION_DISTANCE) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 212, 255, ${lineOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animate();

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 200);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // ─── Mouse Tracking (Spotlight + Tilt + Particles) ────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };

      // Spotlight
      if (spotlightRef.current) {
        spotlightRef.current.style.left = `${e.clientX}px`;
        spotlightRef.current.style.top = `${e.clientY}px`;
      }

      // Card tilt
      if (!prefersReducedMotion.current && cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const rotateY = Math.max(-6, Math.min(6, ((e.clientX - centerX) / (rect.width / 2)) * 6));
        const rotateX = Math.max(-6, Math.min(6, -((e.clientY - centerY) / (rect.height / 2)) * 6));
        cardRef.current.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
      if (cardRef.current) {
        cardRef.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // ─── Typing Timeout Cleanup ───────────────────────────────
  useEffect(() => {
    return () => {
      Object.values(typingTimeoutRef.current).forEach(clearTimeout);
    };
  }, []);

  // ─── Input Change with Typing Detection ───────────────────
  const handleInputChange = useCallback(
    (field: 'email' | 'password', value: string, setter: (v: string) => void) => {
      setter(value);
      setIsTyping((prev) => ({ ...prev, [field]: true }));
      if (typingTimeoutRef.current[field]) {
        clearTimeout(typingTimeoutRef.current[field]);
      }
      typingTimeoutRef.current[field] = setTimeout(() => {
        setIsTyping((prev) => ({ ...prev, [field]: false }));
      }, 150);
    },
    [],
  );

  // ─── Button Ripple ────────────────────────────────────────
  const handleButtonRipple = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (prefersReducedMotion.current || loading) return;
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${e.clientX - rect.left - size / 2}px;
        top: ${e.clientY - rect.top - size / 2}px;
        background: rgba(255,255,255,0.25);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out forwards;
        pointer-events: none;
        z-index: 1;
      `;
      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    },
    [loading],
  );

  // ─── Form Submit (unchanged logic) ────────────────────────
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      const errorMessage = error.message.toLowerCase();

      if (
        errorMessage.includes('invalid login credentials') ||
        errorMessage.includes('invalid_credentials')
      ) {
        setError(t('auth.errors.invalidCredentials'));
      } else if (errorMessage.includes('email not confirmed')) {
        setError(t('auth.errors.emailNotConfirmed'));
      } else if (
        errorMessage.includes('too many requests') ||
        errorMessage.includes('rate limit')
      ) {
        setError(t('auth.errors.tooManyRequests'));
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        setError(t('auth.errors.networkError'));
      } else if (errorMessage.includes('user not found')) {
        setError(t('auth.errors.userNotFound'));
      } else {
        setError(t('auth.errors.invalidCredentials'));
      }

      setLoading(false);
    } else {
      navigate('/');
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: '#000000',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ═══ Canvas Particle System ═══ */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* ═══ Aurora Animated Background ═══ */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 80% 50% at 20% 20%, rgba(0, 212, 255, 0.15), transparent),
            radial-gradient(ellipse 60% 40% at 80% 10%, rgba(168, 85, 247, 0.12), transparent),
            radial-gradient(ellipse 50% 50% at 50% 80%, rgba(0, 212, 255, 0.08), transparent),
            radial-gradient(ellipse 40% 60% at 10% 60%, rgba(168, 85, 247, 0.06), transparent)
          `,
          backgroundSize: '400% 400%',
          animation: 'aurora 20s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      {/* ═══ Grid Pattern ═══ */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
          pointerEvents: 'none',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent)',
        }}
      />

      {/* ═══ Noise Grain Overlay ═══ */}
      <div
        style={{
          position: 'absolute',
          inset: '-50%',
          width: '200%',
          height: '200%',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.04,
          pointerEvents: 'none',
          animation: 'grain 8s steps(10) infinite',
          zIndex: 0,
        }}
      />

      {/* ═══ Floating Orbs ═══ */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(0, 212, 255, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'float 8s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'float 10s ease-in-out infinite reverse',
          pointerEvents: 'none',
        }}
      />

      {/* ═══ Mouse Spotlight ═══ */}
      <div
        ref={spotlightRef}
        style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(0, 212, 255, 0.07) 0%, rgba(168, 85, 247, 0.03) 40%, transparent 70%)',
          pointerEvents: 'none',
          transform: 'translate(-50%, -50%)',
          transition: 'left 0.3s ease-out, top 0.3s ease-out',
          left: '-1000px',
          top: '-1000px',
          zIndex: 0,
          willChange: 'left, top',
        }}
      />

      {/* ═══ Content ═══ */}
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* ─── Logo Section ─── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '48px',
            animation: 'fadeIn 0.6s ease-out',
          }}
        >
          <div
            style={{
              position: 'relative',
              marginBottom: '20px',
            }}
          >
            {/* Logo Glow */}
            <div
              style={{
                position: 'absolute',
                inset: '-10px',
                background: 'radial-gradient(circle, rgba(0, 212, 255, 0.3) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(20px)',
                animation: 'pulse-glow 3s ease-in-out infinite',
              }}
            />
            {/* Pulse Rings */}
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  inset: '-10px',
                  borderRadius: '50%',
                  border: '1px solid rgba(0, 212, 255, 0.15)',
                  animation: `pulseRing 3s ease-out ${i * 1}s infinite`,
                  pointerEvents: 'none',
                }}
              />
            ))}
            <img
              src="/logo.png"
              alt="Suscriptio"
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '18px',
                position: 'relative',
                boxShadow: '0 8px 32px rgba(0, 212, 255, 0.2)',
                animation: 'logoFloat 6s ease-in-out infinite',
              }}
            />
          </div>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#ededed',
              marginBottom: '8px',
              letterSpacing: '-0.02em',
            }}
          >
            Suscriptio
          </h1>
          <p
            style={{
              color: '#666666',
              fontSize: '15px',
              fontWeight: 400,
            }}
          >
            {t('auth.login')}
          </p>
        </div>

        {/* ─── Form Card ─── */}
        <form
          ref={cardRef}
          className="login-card"
          onSubmit={handleSubmit}
          style={{
            background:
              'linear-gradient(145deg, rgba(17, 17, 17, 0.9) 0%, rgba(17, 17, 17, 0.95) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '36px',
            backdropFilter: 'blur(20px)',
            boxShadow: `
              0 0 0 1px rgba(255, 255, 255, 0.03) inset,
              0 20px 50px -10px rgba(0, 0, 0, 0.5),
              0 0 80px -20px rgba(0, 212, 255, 0.1)
            `,
            animation: 'slideUp 0.5s ease-out 0.1s backwards',
            transition: 'transform 0.15s ease-out',
            transformStyle: 'preserve-3d',
          }}
        >
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'rgba(255, 68, 68, 0.08)',
                border: '1px solid rgba(255, 68, 68, 0.15)',
                borderRadius: '12px',
                padding: '14px 16px',
                marginBottom: '24px',
                animation: 'errorEntrance 0.6s ease-out',
                boxShadow: '0 0 20px rgba(255, 68, 68, 0.1)',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#ff6b6b',
                  boxShadow: '0 0 10px rgba(255, 68, 68, 0.5)',
                  flexShrink: 0,
                }}
              />
              <span style={{ color: '#ff8a8a', fontSize: '14px', fontWeight: 500 }}>{error}</span>
            </div>
          )}

          {/* Email Input */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                color: focusedField === 'email' ? '#00d4ff' : '#888888',
                marginBottom: '10px',
                transition: 'color 0.2s ease, transform 0.2s ease',
                letterSpacing: '0.02em',
                transform: focusedField === 'email' ? 'scale(1.02)' : 'scale(1)',
                transformOrigin: 'left center',
              }}
            >
              {t('auth.email')}
            </label>
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '16px',
                  color: focusedField === 'email' ? '#00d4ff' : '#555555',
                  transition: 'color 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <MailIcon />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => handleInputChange('email', e.target.value, setEmail)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                required
                placeholder="tu@email.com"
                style={{
                  width: '100%',
                  padding: '14px 16px 14px 48px',
                  border:
                    focusedField === 'email'
                      ? '1px solid rgba(0, 212, 255, 0.5)'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  color: '#ededed',
                  backgroundColor:
                    focusedField === 'email' ? 'rgba(0, 212, 255, 0.03)' : 'rgba(0, 0, 0, 0.3)',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxShadow:
                    isTyping.email && focusedField === 'email'
                      ? '0 0 0 6px rgba(0, 212, 255, 0.12), 0 0 30px rgba(0, 212, 255, 0.15)'
                      : focusedField === 'email'
                        ? '0 0 0 4px rgba(0, 212, 255, 0.08), 0 0 20px rgba(0, 212, 255, 0.1)'
                        : 'none',
                }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: '28px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                color: focusedField === 'password' ? '#00d4ff' : '#888888',
                marginBottom: '10px',
                transition: 'color 0.2s ease, transform 0.2s ease',
                letterSpacing: '0.02em',
                transform: focusedField === 'password' ? 'scale(1.02)' : 'scale(1)',
                transformOrigin: 'left center',
              }}
            >
              {t('auth.password')}
            </label>
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '16px',
                  color: focusedField === 'password' ? '#00d4ff' : '#555555',
                  transition: 'color 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <LockIcon />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => handleInputChange('password', e.target.value, setPassword)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                required
                minLength={6}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '14px 16px 14px 48px',
                  border:
                    focusedField === 'password'
                      ? '1px solid rgba(0, 212, 255, 0.5)'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  color: '#ededed',
                  backgroundColor:
                    focusedField === 'password'
                      ? 'rgba(0, 212, 255, 0.03)'
                      : 'rgba(0, 0, 0, 0.3)',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxShadow:
                    isTyping.password && focusedField === 'password'
                      ? '0 0 0 6px rgba(0, 212, 255, 0.12), 0 0 30px rgba(0, 212, 255, 0.15)'
                      : focusedField === 'password'
                        ? '0 0 0 4px rgba(0, 212, 255, 0.08), 0 0 20px rgba(0, 212, 255, 0.1)'
                        : 'none',
                }}
              />
            </div>
          </div>

          {/* Forgot Password Link */}
          <div style={{ textAlign: 'right', marginBottom: '20px', marginTop: '-12px' }}>
            <Link
              to="/forgot-password"
              style={{
                color: '#888888',
                fontSize: '13px',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#00d4ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#888888';
              }}
            >
              {t('auth.forgotPassword')}
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="login-button"
            disabled={loading}
            onMouseDown={handleButtonRipple}
            style={{
              width: '100%',
              padding: '16px 24px',
              background: loading
                ? 'rgba(255, 255, 255, 0.05)'
                : 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 50%, #0090b0 100%)',
              color: loading ? '#555555' : '#000',
              fontWeight: 600,
              fontSize: '15px',
              border: 'none',
              borderRadius: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: loading
                ? 'none'
                : `
                  0 0 0 1px rgba(0, 212, 255, 0.3),
                  0 4px 20px rgba(0, 212, 255, 0.25),
                  0 8px 40px -10px rgba(0, 212, 255, 0.4)
                `,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                e.currentTarget.style.boxShadow = `
                  0 0 0 1px rgba(0, 212, 255, 0.5),
                  0 8px 30px rgba(0, 212, 255, 0.35),
                  0 12px 50px -10px rgba(0, 212, 255, 0.5)
                `;
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = `
                  0 0 0 1px rgba(0, 212, 255, 0.3),
                  0 4px 20px rgba(0, 212, 255, 0.25),
                  0 8px 40px -10px rgba(0, 212, 255, 0.4)
                `;
              }
            }}
          >
            {loading ? (
              <>
                <SpinnerIcon />
                <span>Iniciando sesión...</span>
              </>
            ) : (
              <>
                <span>{t('auth.login')}</span>
                <ArrowIcon />
              </>
            )}
          </button>
        </form>

        {/* ─── Register Link ─── */}
        <p
          style={{
            textAlign: 'center',
            marginTop: '28px',
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '14px',
            animation: 'fadeIn 0.6s ease-out 0.3s backwards',
          }}
        >
          {t('auth.noAccount')}{' '}
          <Link
            to="/register"
            style={{
              color: '#00d4ff',
              textDecoration: 'none',
              fontWeight: 500,
              transition: 'all 0.2s ease',
              borderBottom: '1px solid transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderBottomColor = '#00d4ff';
              e.currentTarget.style.textShadow = '0 0 20px rgba(0, 212, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderBottomColor = 'transparent';
              e.currentTarget.style.textShadow = 'none';
            }}
          >
            {t('auth.register')}
          </Link>
        </p>
      </div>

      {/* ═══ CSS Keyframes ═══ */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input::placeholder {
          color: #444444;
        }

        /* ── Aurora Flow ── */
        @keyframes aurora {
          0% { background-position: 0% 50%; }
          25% { background-position: 100% 0%; }
          50% { background-position: 100% 100%; }
          75% { background-position: 0% 100%; }
          100% { background-position: 0% 50%; }
        }

        /* ── Noise Grain ── */
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -10%); }
          20% { transform: translate(-15%, 5%); }
          30% { transform: translate(7%, -25%); }
          40% { transform: translate(-5%, 25%); }
          50% { transform: translate(-15%, 10%); }
          60% { transform: translate(15%, 0%); }
          70% { transform: translate(0%, 15%); }
          80% { transform: translate(3%, 35%); }
          90% { transform: translate(-10%, 10%); }
        }

        /* ── Animated Gradient Border ── */
        @property --border-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes rotateBorder {
          to { --border-angle: 360deg; }
        }
        .login-card {
          position: relative;
        }
        .login-card::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 21px;
          padding: 1px;
          background: conic-gradient(from var(--border-angle), transparent 30%, #00d4ff 45%, #a855f7 55%, transparent 70%);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          animation: rotateBorder 4s linear infinite;
          pointer-events: none;
          z-index: 0;
        }

        /* ── Logo Pulse Rings ── */
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.5); opacity: 0; }
        }

        /* ── Logo Float ── */
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }

        /* ── Button Shimmer ── */
        @keyframes shimmer {
          0% { left: -100%; }
          50% { left: -100%; }
          100% { left: 200%; }
        }
        .login-button {
          position: relative;
          overflow: hidden;
        }
        .login-button::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
          animation: shimmer 4s ease-in-out infinite;
          pointer-events: none;
        }
        .login-button:disabled::after {
          display: none;
        }

        /* ── Ripple Effect ── */
        @keyframes rippleEffect {
          to { transform: scale(2.5); opacity: 0; }
        }

        /* ── Error Entrance ── */
        @keyframes errorEntrance {
          0% { opacity: 0; transform: translateY(-10px) scale(0.95); }
          50% { opacity: 1; transform: translateY(2px) scale(1.01); }
          70% { transform: translateX(-3px) scale(1); }
          85% { transform: translateX(3px) scale(1); }
          100% { opacity: 1; transform: translateY(0) scale(1) translateX(0); }
        }
      `}</style>
    </div>
  );
};
