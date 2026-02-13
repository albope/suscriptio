import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const sectionStyle: React.CSSProperties = {
  background: 'rgba(17, 17, 17, 0.6)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  borderRadius: '16px',
  padding: '28px',
  marginBottom: '20px',
  backdropFilter: 'blur(20px)',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 600,
  color: '#00d4ff',
  marginBottom: '16px',
};

const textStyle: React.CSSProperties = {
  fontSize: '15px',
  lineHeight: 1.7,
  color: '#999',
};

const listItemStyle: React.CSSProperties = {
  ...textStyle,
  paddingLeft: '16px',
  position: 'relative',
  marginBottom: '8px',
};

export const Terms = () => {
  const { t } = useTranslation();

  const sections = [
    {
      title: t('legal.terms.acceptance.title'),
      paragraphs: [t('legal.terms.acceptance.description')],
    },
    {
      title: t('legal.terms.service.title'),
      paragraphs: [t('legal.terms.service.description'), t('legal.terms.service.noGuarantee')],
    },
    {
      title: t('legal.terms.accounts.title'),
      items: [
        t('legal.terms.accounts.registration'),
        t('legal.terms.accounts.security'),
        t('legal.terms.accounts.responsibility'),
      ],
    },
    {
      title: t('legal.terms.premium.title'),
      items: [
        t('legal.terms.premium.price'),
        t('legal.terms.premium.refunds'),
        t('legal.terms.premium.lifetime'),
      ],
    },
    {
      title: t('legal.terms.userResponsibilities.title'),
      items: [
        t('legal.terms.userResponsibilities.noMisuse'),
        t('legal.terms.userResponsibilities.accuracy'),
        t('legal.terms.userResponsibilities.noReverse'),
      ],
    },
    {
      title: t('legal.terms.intellectualProperty.title'),
      items: [
        t('legal.terms.intellectualProperty.ownership'),
        t('legal.terms.intellectualProperty.license'),
      ],
    },
    {
      title: t('legal.terms.liability.title'),
      items: [
        t('legal.terms.liability.asIs'),
        t('legal.terms.liability.noLiability'),
        t('legal.terms.liability.backup'),
      ],
    },
    {
      title: t('legal.terms.changes.title'),
      paragraphs: [t('legal.terms.changes.description')],
    },
    {
      title: t('legal.terms.termination.title'),
      paragraphs: [t('legal.terms.termination.description')],
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#000000',
        padding: '40px 20px 60px',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Back link */}
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            color: '#888',
            textDecoration: 'none',
            marginBottom: '32px',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#00d4ff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#888';
          }}
        >
          <svg
            style={{ width: '16px', height: '16px' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {t('legal.backToHome')}
        </Link>

        {/* Title */}
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 700,
            color: '#ededed',
            marginBottom: '8px',
          }}
        >
          {t('legal.terms.title')}
        </h1>
        <p
          style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '32px',
          }}
        >
          {t('legal.terms.lastUpdated')}
        </p>

        {/* Intro */}
        <div style={sectionStyle}>
          <p style={textStyle}>{t('legal.terms.intro')}</p>
        </div>

        {/* Sections */}
        {sections.map((section) => (
          <div key={section.title} style={sectionStyle}>
            <h2 style={sectionTitleStyle}>{section.title}</h2>
            {'paragraphs' in section && section.paragraphs ? (
              section.paragraphs.map((p) => (
                <p key={p} style={{ ...textStyle, marginBottom: '8px' }}>
                  {p}
                </p>
              ))
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {section.items?.map((item) => (
                  <li key={item} style={listItemStyle}>
                    <span
                      style={{
                        position: 'absolute',
                        left: 0,
                        color: '#00d4ff',
                      }}
                    >
                      &bull;
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {/* Contact */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>{t('legal.terms.contact.title')}</h2>
          <p style={{ ...textStyle, marginBottom: '12px' }}>
            {t('legal.terms.contact.description')}
          </p>
          <a
            href={`mailto:${t('legal.terms.contact.email')}`}
            style={{
              color: '#00d4ff',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: 500,
            }}
          >
            {t('legal.terms.contact.email')}
          </a>
        </div>
      </div>
    </div>
  );
};
