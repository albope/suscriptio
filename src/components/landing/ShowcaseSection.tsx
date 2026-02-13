import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ServiceLogo } from '@/components/ui/ServiceLogo';

/* ── Tab data ── */

interface TabDef {
  id: string;
  titleKey: string;
  descriptionKey: string;
  bullets: string[];
  accent: string;
  icon: React.ReactNode;
}

const ZapIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const ChartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const CheckBullet = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00ff94" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const TABS: TabDef[] = [
  {
    id: 'setup',
    titleKey: 'landing.showcase.tabs.setup.title',
    descriptionKey: 'landing.showcase.tabs.setup.description',
    bullets: [
      'landing.showcase.tabs.setup.bullet1',
      'landing.showcase.tabs.setup.bullet2',
      'landing.showcase.tabs.setup.bullet3',
    ],
    accent: '#00d4ff',
    icon: <ZapIcon />,
  },
  {
    id: 'analytics',
    titleKey: 'landing.showcase.tabs.analytics.title',
    descriptionKey: 'landing.showcase.tabs.analytics.description',
    bullets: [
      'landing.showcase.tabs.analytics.bullet1',
      'landing.showcase.tabs.analytics.bullet2',
      'landing.showcase.tabs.analytics.bullet3',
    ],
    accent: '#a855f7',
    icon: <ChartIcon />,
  },
  {
    id: 'budget',
    titleKey: 'landing.showcase.tabs.budget.title',
    descriptionKey: 'landing.showcase.tabs.budget.description',
    bullets: [
      'landing.showcase.tabs.budget.bullet1',
      'landing.showcase.tabs.budget.bullet2',
      'landing.showcase.tabs.budget.bullet3',
    ],
    accent: '#00ff94',
    icon: <ShieldIcon />,
  },
  {
    id: 'calendar',
    titleKey: 'landing.showcase.tabs.calendar.title',
    descriptionKey: 'landing.showcase.tabs.calendar.description',
    bullets: [
      'landing.showcase.tabs.calendar.bullet1',
      'landing.showcase.tabs.calendar.bullet2',
      'landing.showcase.tabs.calendar.bullet3',
    ],
    accent: '#f59e0b',
    icon: <CalendarIcon />,
  },
];

const AUTO_ADVANCE_MS = 5000;
const PROGRESS_TICK_MS = 50;

/* ── Mockup sub-components ── */

const services = [
  'Netflix', 'Spotify', 'Disney+', 'Amazon',
  'YouTube', 'ChatGPT', 'iCloud+', 'Xbox',
];

const SetupMockup = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
    {services.map((name, i) => (
      <div
        key={name}
        className="showcase-mock-item"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 12px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '10px',
          animation: `showcase-item-appear 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.08}s both`,
        }}
      >
        <ServiceLogo name={name} size={28} />
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#ededed', whiteSpace: 'nowrap' }}>
          {name}
        </span>
      </div>
    ))}
  </div>
);

const analyticsBars = [
  { label: 'Ene', width: '78%', amount: '47.94' },
  { label: 'Feb', width: '85%', amount: '52.43' },
  { label: 'Mar', width: '65%', amount: '39.97' },
  { label: 'Abr', width: '92%', amount: '56.92' },
  { label: 'May', width: '70%', amount: '43.45' },
  { label: 'Jun', width: '88%', amount: '54.41' },
];

const AnalyticsMockup = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    {/* KPI mini row */}
    <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
      {[
        { label: 'Mensual', value: '€47.94', color: '#a855f7' },
        { label: 'Anual', value: '€575', color: '#00d4ff' },
        { label: 'Activas', value: '8', color: '#00ff94' },
      ].map((kpi, i) => (
        <div
          key={kpi.label}
          style={{
            flex: 1,
            padding: '8px 10px',
            background: 'rgba(17, 17, 17, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '8px',
            animation: `showcase-item-appear 0.4s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.1}s both`,
          }}
        >
          <p style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0, marginBottom: '4px' }}>
            {kpi.label}
          </p>
          <p style={{ fontSize: '16px', fontWeight: 700, color: kpi.color, margin: 0, lineHeight: 1 }}>
            {kpi.value}
          </p>
        </div>
      ))}
    </div>
    {/* Bar chart */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {analyticsBars.map((bar, i) => (
        <div key={bar.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', width: '26px', textAlign: 'right', flexShrink: 0, fontWeight: 500 }}>
            {bar.label}
          </span>
          <div style={{ flex: 1, height: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                width: bar.width,
                height: '100%',
                background: 'linear-gradient(90deg, #a855f7 0%, #a855f788 100%)',
                borderRadius: '4px',
                animation: `showcase-bar-grow 1s cubic-bezier(0.4, 0, 0.2, 1) ${0.3 + i * 0.1}s both`,
              }}
            />
          </div>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', width: '36px', textAlign: 'right', flexShrink: 0, fontWeight: 500 }}>
            {bar.amount}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const BudgetMockup = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    {/* Budget header */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <div>
        <p style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0, marginBottom: '6px' }}>
          Presupuesto mensual
        </p>
        <p style={{ fontSize: '22px', fontWeight: 700, color: '#00ff94', margin: 0, lineHeight: 1 }}>
          €36.00 <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.35)' }}>/ €50.00</span>
        </p>
      </div>
      <span style={{ fontSize: '20px', fontWeight: 700, color: '#f59e0b', animation: 'showcase-item-appear 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.8s both' }}>
        72%
      </span>
    </div>
    {/* Progress bar */}
    <div style={{ height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', overflow: 'hidden' }}>
      <div
        style={{
          height: '100%',
          borderRadius: '6px',
          background: 'linear-gradient(90deg, #00ff94, #f59e0b)',
          animation: 'showcase-budget-fill 1.4s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both',
        }}
      />
    </div>
    {/* Threshold markers */}
    <div style={{ display: 'flex', gap: '8px' }}>
      {[
        { label: '70%', color: '#00ff94' },
        { label: '90%', color: '#f59e0b' },
        { label: '100%', color: '#ef4444' },
      ].map((m, i) => (
        <div
          key={m.label}
          style={{
            flex: 1,
            padding: '6px 8px',
            background: `${m.color}10`,
            border: `1px solid ${m.color}25`,
            borderRadius: '6px',
            textAlign: 'center',
            animation: `showcase-item-appear 0.4s cubic-bezier(0.4, 0, 0.2, 1) ${0.6 + i * 0.12}s both`,
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: 600, color: m.color }}>{m.label}</span>
        </div>
      ))}
    </div>
    {/* Toast notification */}
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 14px',
        background: 'rgba(245, 158, 11, 0.08)',
        border: '1px solid rgba(245, 158, 11, 0.2)',
        borderRadius: '10px',
        animation: 'showcase-notify-slide 0.5s cubic-bezier(0.4, 0, 0.2, 1) 1.2s both',
      }}
    >
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', flexShrink: 0 }} />
      <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 500 }}>
        Has alcanzado el 72% de tu presupuesto
      </span>
    </div>
  </div>
);

const calendarItems = [
  { day: '15', month: 'Feb', name: 'Netflix', amount: '€12.99', color: '#e50914', daysLeft: '2 días' },
  { day: '20', month: 'Feb', name: 'Spotify', amount: '€10.99', color: '#1db954', daysLeft: '7 días' },
  { day: '28', month: 'Feb', name: 'iCloud+', amount: '€0.99', color: '#a855f7', daysLeft: '15 días' },
  { day: '05', month: 'Mar', name: 'Disney+', amount: '€8.99', color: '#113ccf', daysLeft: '20 días' },
];

const CalendarMockup = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    {calendarItems.map((item, i) => (
      <div
        key={item.name}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 14px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '10px',
          animation: `showcase-timeline-slide 0.45s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.12}s both`,
        }}
      >
        {/* Date badge */}
        <div
          style={{
            width: '38px',
            height: '42px',
            borderRadius: '8px',
            background: `${item.color}12`,
            border: `1px solid ${item.color}25`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: '14px', fontWeight: 700, color: item.color, lineHeight: 1 }}>
            {item.day}
          </span>
          <span style={{ fontSize: '8px', fontWeight: 600, color: `${item.color}99`, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {item.month}
          </span>
        </div>
        {/* Service info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#ededed', margin: 0, lineHeight: 1.2 }}>
            {item.name}
          </p>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', margin: 0, marginTop: '2px' }}>
            en {item.daysLeft}
          </p>
        </div>
        {/* Amount */}
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#f59e0b', flexShrink: 0 }}>
          {item.amount}
        </span>
      </div>
    ))}
  </div>
);

const MOCKUP_MAP: Record<string, React.FC> = {
  setup: SetupMockup,
  analytics: AnalyticsMockup,
  budget: BudgetMockup,
  calendar: CalendarMockup,
};

/* ── Main Component ── */

export const ShowcaseSection = () => {
  const { t } = useTranslation();
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation({ threshold: 0.1 });

  const [activeTab, setActiveTab] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const advanceRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickCountRef = useRef(0);

  const clearTimers = useCallback(() => {
    if (advanceRef.current) { clearInterval(advanceRef.current); advanceRef.current = null; }
    if (progressRef.current) { clearInterval(progressRef.current); progressRef.current = null; }
  }, []);

  /* Auto-rotation */
  useEffect(() => {
    if (isPaused || !contentVisible) {
      clearTimers();
      return;
    }

    const totalTicks = AUTO_ADVANCE_MS / PROGRESS_TICK_MS;
    tickCountRef.current = 0;

    progressRef.current = setInterval(() => {
      tickCountRef.current += 1;
      if (tickCountRef.current >= totalTicks) {
        tickCountRef.current = 0;
        setActiveTab((prev) => (prev + 1) % TABS.length);
        setProgress(0);
      } else {
        setProgress((tickCountRef.current / totalTicks) * 100);
      }
    }, PROGRESS_TICK_MS);

    return clearTimers;
  }, [isPaused, contentVisible, clearTimers]);

  /* Reset progress on manual tab change */
  const handleTabClick = (index: number) => {
    setActiveTab(index);
    setProgress(0);
    tickCountRef.current = 0;
  };

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleTabClick((currentIndex + 1) % TABS.length);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handleTabClick((currentIndex - 1 + TABS.length) % TABS.length);
    }
  };

  const tab = TABS[activeTab];
  const MockupComponent = MOCKUP_MAP[tab.id];

  return (
    <section
      id="showcase"
      style={{
        padding: '120px 24px',
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
      }}
    >
      <style>{`
        @keyframes showcase-item-appear {
          from { opacity: 0; transform: scale(0.85) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes showcase-bar-grow {
          from { width: 0; }
        }
        @keyframes showcase-budget-fill {
          from { width: 0; }
          to   { width: 72%; }
        }
        @keyframes showcase-notify-slide {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes showcase-timeline-slide {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes showcase-content-enter {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .showcase-section-outer {
            padding: 80px 16px !important;
          }
          .showcase-tab-bar {
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .showcase-tab-bar::-webkit-scrollbar {
            display: none;
          }
          .showcase-tab-btn {
            white-space: nowrap !important;
            min-width: max-content !important;
            padding: 12px 16px !important;
            font-size: 13px !important;
          }
          .showcase-content-area {
            flex-direction: column !important;
            gap: 32px !important;
          }
          .showcase-text-col {
            max-width: 100% !important;
            flex: none !important;
          }
          .showcase-mock-col {
            max-width: 100% !important;
            flex: none !important;
          }
        }

        @media (max-width: 480px) {
          .showcase-tab-btn {
            padding: 10px 12px !important;
            font-size: 12px !important;
          }
          .showcase-tab-icon {
            display: none !important;
          }
        }
      `}</style>

      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '600px',
          background: 'radial-gradient(ellipse at center, rgba(0, 212, 255, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Header */}
      <div
        ref={headerRef}
        style={{
          textAlign: 'center',
          marginBottom: '56px',
          position: 'relative',
          zIndex: 1,
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <h2
          style={{
            fontSize: '42px',
            fontWeight: 800,
            color: '#ededed',
            marginBottom: '16px',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
          }}
        >
          {t('landing.showcase.title')}
        </h2>
        <p
          style={{
            fontSize: '18px',
            color: '#888',
            maxWidth: '560px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          {t('landing.showcase.subtitle')}
        </p>
      </div>

      {/* Tabs + Content */}
      <div
        ref={contentRef}
        style={{
          position: 'relative',
          zIndex: 1,
          opacity: contentVisible ? 1 : 0,
          transform: contentVisible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Tab bar */}
        <div
          role="tablist"
          className="showcase-tab-bar"
          style={{
            display: 'flex',
            position: 'relative',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '48px',
          }}
        >
          {TABS.map((t_item, index) => (
            <button
              key={t_item.id}
              id={`showcase-tab-${index}`}
              role="tab"
              aria-selected={activeTab === index}
              tabIndex={activeTab === index ? 0 : -1}
              className="showcase-tab-btn"
              onClick={() => handleTabClick(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              style={{
                flex: 1,
                padding: '16px 20px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '14px',
                fontWeight: activeTab === index ? 600 : 500,
                color: activeTab === index ? '#ededed' : '#666',
                transition: 'color 0.3s ease',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span className="showcase-tab-icon" style={{ display: 'flex', color: activeTab === index ? TABS[index].accent : '#666', transition: 'color 0.3s ease' }}>
                {t_item.icon}
              </span>
              {t(t_item.titleKey)}

              {/* Progress bar (active tab only) */}
              {activeTab === index && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-1px',
                    left: 0,
                    height: '2px',
                    width: `${progress}%`,
                    background: TABS[index].accent,
                    transition: progress === 0 ? 'none' : `width ${PROGRESS_TICK_MS}ms linear`,
                    boxShadow: `0 0 8px ${TABS[index].accent}66`,
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div
          key={activeTab}
          role="tabpanel"
          aria-labelledby={`showcase-tab-${activeTab}`}
          className="showcase-content-area"
          style={{
            display: 'flex',
            gap: '48px',
            alignItems: 'flex-start',
            animation: 'showcase-content-enter 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Text column */}
          <div
            className="showcase-text-col"
            style={{
              flex: '0 0 50%',
              maxWidth: '50%',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                background: `${tab.accent}10`,
                border: `1px solid ${tab.accent}25`,
                borderRadius: '20px',
                marginBottom: '20px',
              }}
            >
              <span style={{ display: 'flex', color: tab.accent }}>{tab.icon}</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: tab.accent, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t(tab.titleKey)}
              </span>
            </div>

            <p
              style={{
                fontSize: '17px',
                color: '#ccc',
                lineHeight: 1.7,
                marginBottom: '28px',
                marginTop: 0,
              }}
            >
              {t(tab.descriptionKey)}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {tab.bullets.map((bulletKey) => (
                <div
                  key={bulletKey}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                  }}
                >
                  <CheckBullet />
                  <span style={{ fontSize: '14px', color: '#aaa', lineHeight: 1.5 }}>
                    {t(bulletKey)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mockup column */}
          <div
            className="showcase-mock-col"
            style={{
              flex: '0 0 46%',
              maxWidth: '46%',
            }}
          >
            <div
              style={{
                background: 'linear-gradient(145deg, rgba(17, 17, 17, 0.9), rgba(10, 10, 10, 0.95))',
                border: `1px solid ${tab.accent}20`,
                borderRadius: '20px',
                padding: '24px',
                boxShadow: `0 0 40px ${tab.accent}0a, 0 24px 80px -12px rgba(0, 0, 0, 0.6)`,
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
              }}
            >
              <MockupComponent />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
