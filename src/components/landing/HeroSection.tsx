import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.suscriptio.app';

export const HeroSection = () => {
  const { t } = useTranslation();
  const [hoveredPrimary, setHoveredPrimary] = useState(false);
  const [hoveredSecondary, setHoveredSecondary] = useState(false);

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <style>
        {`
          @keyframes hero-float {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-25px) scale(1.05); }
          }

          @keyframes hero-float-reverse {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(20px) scale(1.03); }
          }

          @keyframes hero-fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes hero-pulse-glow {
            0%, 100% {
              box-shadow:
                0 0 30px rgba(0, 212, 255, 0.15),
                0 0 60px rgba(0, 212, 255, 0.05);
            }
            50% {
              box-shadow:
                0 0 40px rgba(0, 212, 255, 0.25),
                0 0 80px rgba(0, 212, 255, 0.1);
            }
          }

          @keyframes hero-bar-grow {
            from { width: 0; }
          }

          .hero-section {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 80px 24px 60px;
            position: relative;
            overflow: hidden;
            background: #000000;
          }

          .hero-content {
            max-width: 1200px;
            width: 100%;
            display: flex;
            align-items: center;
            gap: 60px;
            position: relative;
            z-index: 2;
          }

          .hero-left {
            flex: 0 0 55%;
            max-width: 55%;
          }

          .hero-right {
            flex: 0 0 45%;
            max-width: 45%;
            display: flex;
            justify-content: center;
          }

          .hero-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            border-radius: 100px;
            border: 1px solid rgba(0, 212, 255, 0.25);
            background: rgba(0, 212, 255, 0.06);
            font-size: 13px;
            font-weight: 500;
            color: #00d4ff;
            margin-bottom: 28px;
            animation: hero-fadeIn 0.6s ease-out 0.1s backwards;
            box-shadow: 0 0 20px rgba(0, 212, 255, 0.08);
          }

          .hero-title {
            font-size: clamp(36px, 5vw, 64px);
            font-weight: 800;
            line-height: 1.08;
            letter-spacing: -0.03em;
            margin-bottom: 24px;
            background: linear-gradient(
              180deg,
              #ffffff 0%,
              #ededed 40%,
              #b0b0b0 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: hero-fadeIn 0.6s ease-out 0.2s backwards;
          }

          .hero-subtitle {
            font-size: 18px;
            line-height: 1.7;
            color: #888888;
            max-width: 540px;
            margin-bottom: 40px;
            animation: hero-fadeIn 0.6s ease-out 0.3s backwards;
          }

          .hero-buttons {
            display: flex;
            align-items: center;
            gap: 16px;
            flex-wrap: wrap;
            animation: hero-fadeIn 0.6s ease-out 0.4s backwards;
          }

          .hero-mockup-container {
            position: relative;
            width: 100%;
            max-width: 420px;
            animation: hero-fadeIn 0.8s ease-out 0.5s backwards;
          }

          .hero-mockup {
            background: linear-gradient(
              145deg,
              rgba(17, 17, 17, 0.9) 0%,
              rgba(10, 10, 10, 0.95) 100%
            );
            border: 1px solid rgba(0, 212, 255, 0.15);
            border-radius: 20px;
            padding: 24px;
            transform: perspective(1000px) rotateY(-5deg) rotateX(2deg);
            transition: transform 0.4s ease;
            animation: hero-pulse-glow 4s ease-in-out infinite;
            backdrop-filter: blur(10px);
          }

          .hero-mockup:hover {
            transform: perspective(1000px) rotateY(-2deg) rotateX(1deg);
          }

          .hero-mockup-header {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 20px;
          }

          .hero-mockup-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
          }

          .hero-metrics-row {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 10px;
            margin-bottom: 20px;
          }

          .hero-metric-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 12px;
            padding: 14px 12px;
            text-align: center;
          }

          .hero-metric-label {
            font-size: 10px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.4);
            text-transform: uppercase;
            letter-spacing: 0.06em;
            margin-bottom: 6px;
          }

          .hero-metric-value {
            font-size: 16px;
            font-weight: 700;
            letter-spacing: -0.01em;
          }

          .hero-chart-area {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.04);
            border-radius: 12px;
            padding: 16px;
          }

          .hero-chart-title {
            font-size: 11px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.35);
            text-transform: uppercase;
            letter-spacing: 0.06em;
            margin-bottom: 14px;
          }

          .hero-chart-bar-row {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
          }

          .hero-chart-bar-row:last-child {
            margin-bottom: 0;
          }

          .hero-chart-bar-label {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.4);
            width: 56px;
            flex-shrink: 0;
            text-align: right;
          }

          .hero-chart-bar-track {
            flex: 1;
            height: 8px;
            border-radius: 4px;
            background: rgba(255, 255, 255, 0.04);
            overflow: hidden;
          }

          .hero-chart-bar-fill {
            height: 100%;
            border-radius: 4px;
            animation: hero-bar-grow 1.2s ease-out 0.8s backwards;
          }

          @media (max-width: 900px) {
            .hero-content {
              flex-direction: column;
              text-align: center;
            }

            .hero-left {
              flex: none;
              max-width: 100%;
            }

            .hero-right {
              flex: none;
              max-width: 100%;
              display: none;
            }

            .hero-subtitle {
              margin-left: auto;
              margin-right: auto;
            }

            .hero-buttons {
              justify-content: center;
            }
          }

          @media (max-width: 480px) {
            .hero-section {
              padding: 80px 16px 40px;
            }

            .hero-buttons {
              flex-direction: column;
              width: 100%;
            }

            .hero-buttons a,
            .hero-buttons button {
              width: 100%;
            }
          }
        `}
      </style>

      <section className="hero-section">
        {/* Background radial gradients */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(ellipse 80% 50% at 20% 0%, rgba(0, 212, 255, 0.12), transparent),
              radial-gradient(ellipse 60% 40% at 80% 100%, rgba(168, 85, 247, 0.1), transparent)
            `,
            pointerEvents: 'none',
          }}
        />

        {/* Grid pattern overlay */}
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

        {/* Floating orb - cyan (top-left) */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(50px)',
            animation: 'hero-float 8s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />

        {/* Floating orb - purple (bottom-right) */}
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '5%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(50px)',
            animation: 'hero-float-reverse 10s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />

        {/* Main content */}
        <div className="hero-content">
          {/* Left column: text */}
          <div className="hero-left">
            {/* Badge pill */}
            <div className="hero-badge">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              {t('landing.hero.badge')}
            </div>

            {/* Title */}
            <h1 className="hero-title">{t('landing.hero.title')}</h1>

            {/* Subtitle */}
            <p className="hero-subtitle">{t('landing.hero.subtitle')}</p>

            {/* CTA Buttons */}
            <div className="hero-buttons">
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  padding: '16px 28px',
                  fontSize: '15px',
                  fontWeight: 600,
                  borderRadius: '12px',
                  border: 'none',
                  background: hoveredPrimary
                    ? 'linear-gradient(135deg, #00e5ff 0%, #00b8d4 100%)'
                    : 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%)',
                  color: '#000',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  boxShadow: hoveredPrimary
                    ? '0 0 0 1px rgba(0, 212, 255, 0.5), 0 8px 40px rgba(0, 212, 255, 0.45), 0 12px 60px -10px rgba(0, 212, 255, 0.5)'
                    : '0 0 0 1px rgba(0, 212, 255, 0.3), 0 4px 24px rgba(0, 212, 255, 0.3), 0 8px 40px -10px rgba(0, 212, 255, 0.4)',
                  transform: hoveredPrimary ? 'translateY(-2px)' : 'translateY(0)',
                }}
                onMouseEnter={() => setHoveredPrimary(true)}
                onMouseLeave={() => setHoveredPrimary(false)}
              >
                {/* Google Play icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 1.33-2.965 1.716-2.36-2.36 3.023-3.023v2.337zM5.864 2.658L16.8 8.991l-2.302 2.302L5.864 2.658z" />
                </svg>
                {t('landing.hero.cta')}
              </a>

              <button
                onClick={scrollToFeatures}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  padding: '16px 28px',
                  fontSize: '15px',
                  fontWeight: 500,
                  borderRadius: '12px',
                  border: hoveredSecondary
                    ? '1px solid rgba(255, 255, 255, 0.2)'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  background: hoveredSecondary ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
                  color: '#ededed',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transform: hoveredSecondary ? 'translateY(-1px)' : 'translateY(0)',
                }}
                onMouseEnter={() => setHoveredSecondary(true)}
                onMouseLeave={() => setHoveredSecondary(false)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10 8 16 12 10 16 10 8" />
                </svg>
                {t('landing.hero.ctaSecondary')}
              </button>
            </div>

            {/* Available on badge */}
            <p
              className="hero-subtitle"
              style={{
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.4)',
                marginTop: '16px',
                marginBottom: '0',
                animation: 'hero-fadeIn 0.6s ease-out 0.5s backwards',
              }}
            >
              {t('landing.hero.availableOn')}
            </p>
          </div>

          {/* Right column: dashboard mockup (desktop only) */}
          <div className="hero-right">
            <div className="hero-mockup-container">
              <div className="hero-mockup">
                {/* Window dots */}
                <div className="hero-mockup-header">
                  <div
                    className="hero-mockup-dot"
                    style={{ background: '#ff5f56' }}
                  />
                  <div
                    className="hero-mockup-dot"
                    style={{ background: '#ffbd2e' }}
                  />
                  <div
                    className="hero-mockup-dot"
                    style={{ background: '#27c93f' }}
                  />
                  <div
                    style={{
                      flex: 1,
                      height: '1px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      marginLeft: '8px',
                    }}
                  />
                </div>

                {/* Metric cards row */}
                <div className="hero-metrics-row">
                  <div className="hero-metric-card">
                    <div className="hero-metric-label">Monthly</div>
                    <div
                      className="hero-metric-value"
                      style={{ color: '#00d4ff' }}
                    >
                      €47.94
                    </div>
                  </div>
                  <div className="hero-metric-card">
                    <div className="hero-metric-label">Yearly</div>
                    <div
                      className="hero-metric-value"
                      style={{ color: '#a855f7' }}
                    >
                      €575.28
                    </div>
                  </div>
                  <div className="hero-metric-card">
                    <div className="hero-metric-label">Active</div>
                    <div
                      className="hero-metric-value"
                      style={{ color: '#00ff94' }}
                    >
                      8
                    </div>
                  </div>
                </div>

                {/* Fake chart area */}
                <div className="hero-chart-area">
                  <div className="hero-chart-title">Spending by category</div>

                  {/* Bar: Streaming */}
                  <div className="hero-chart-bar-row">
                    <span className="hero-chart-bar-label">Streaming</span>
                    <div className="hero-chart-bar-track">
                      <div
                        className="hero-chart-bar-fill"
                        style={{
                          width: '85%',
                          background: 'linear-gradient(90deg, #00d4ff, #00a8cc)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Bar: Cloud */}
                  <div className="hero-chart-bar-row">
                    <span className="hero-chart-bar-label">Cloud</span>
                    <div className="hero-chart-bar-track">
                      <div
                        className="hero-chart-bar-fill"
                        style={{
                          width: '62%',
                          background: 'linear-gradient(90deg, #a855f7, #7c3aed)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Bar: Music */}
                  <div className="hero-chart-bar-row">
                    <span className="hero-chart-bar-label">Music</span>
                    <div className="hero-chart-bar-track">
                      <div
                        className="hero-chart-bar-fill"
                        style={{
                          width: '45%',
                          background: 'linear-gradient(90deg, #00d4ff, #a855f7)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Bar: Productivity */}
                  <div className="hero-chart-bar-row">
                    <span className="hero-chart-bar-label">Prod.</span>
                    <div className="hero-chart-bar-track">
                      <div
                        className="hero-chart-bar-fill"
                        style={{
                          width: '38%',
                          background: 'linear-gradient(90deg, #00ff94, #00cc76)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Bar: Gaming */}
                  <div className="hero-chart-bar-row">
                    <span className="hero-chart-bar-label">Gaming</span>
                    <div className="hero-chart-bar-track">
                      <div
                        className="hero-chart-bar-fill"
                        style={{
                          width: '25%',
                          background: 'linear-gradient(90deg, #f59e0b, #d97706)',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
