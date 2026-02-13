import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface FaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

const FaqItem = ({ question, answer, isOpen, onToggle }: FaqItemProps) => (
  <div
    style={{
      border: '1px solid rgba(255, 255, 255, 0.06)',
      borderRadius: '12px',
      background: isOpen
        ? 'rgba(0, 212, 255, 0.03)'
        : 'rgba(17, 17, 17, 0.4)',
      transition: 'all 0.2s ease',
      overflow: 'hidden',
    }}
  >
    <button
      onClick={onToggle}
      style={{
        width: '100%',
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: 'inherit',
      }}
    >
      <span
        style={{
          fontSize: '15px',
          fontWeight: 600,
          color: isOpen ? '#00d4ff' : '#ededed',
          lineHeight: 1.4,
          paddingRight: '16px',
        }}
      >
        {question}
      </span>
      <svg
        style={{
          width: '20px',
          height: '20px',
          color: isOpen ? '#00d4ff' : '#888888',
          flexShrink: 0,
          transition: 'transform 0.2s ease',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    {isOpen && (
      <div
        style={{
          padding: '0 24px 20px',
        }}
      >
        <p
          style={{
            fontSize: '14px',
            color: '#888888',
            lineHeight: 1.7,
          }}
        >
          {answer}
        </p>
      </div>
    )}
  </div>
);

export const FaqSection = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { q: t('landing.faq.q1'), a: t('landing.faq.a1') },
    { q: t('landing.faq.q2'), a: t('landing.faq.a2') },
    { q: t('landing.faq.q3'), a: t('landing.faq.a3') },
    { q: t('landing.faq.q4'), a: t('landing.faq.a4') },
    { q: t('landing.faq.q5'), a: t('landing.faq.a5') },
    { q: t('landing.faq.q6'), a: t('landing.faq.a6') },
  ];

  return (
    <section
      id="faq"
      style={{
        padding: '100px 24px',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2
          style={{
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 800,
            color: '#ededed',
            marginBottom: '16px',
            letterSpacing: '-0.03em',
          }}
        >
          {t('landing.faq.title')}
        </h2>
        <p
          style={{
            fontSize: '16px',
            color: '#888888',
            lineHeight: 1.6,
          }}
        >
          {t('landing.faq.subtitle')}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {faqs.map((faq, i) => (
          <FaqItem
            key={i}
            question={faq.q}
            answer={faq.a}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </section>
  );
};
