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

export const Privacy = () => {
  const { t } = useTranslation();

  const sections = [
    {
      title: t('legal.privacy.dataCollection.title'),
      items: [
        t('legal.privacy.dataCollection.email'),
        t('legal.privacy.dataCollection.subscriptions'),
        t('legal.privacy.dataCollection.profile'),
        t('legal.privacy.dataCollection.usage'),
      ],
    },
    {
      title: t('legal.privacy.thirdParty.title'),
      items: [
        t('legal.privacy.thirdParty.supabase'),
        t('legal.privacy.thirdParty.revenuecat'),
        t('legal.privacy.thirdParty.noTracking'),
      ],
    },
    {
      title: t('legal.privacy.dataUsage.title'),
      items: [
        t('legal.privacy.dataUsage.functionality'),
        t('legal.privacy.dataUsage.noSelling'),
        t('legal.privacy.dataUsage.noAds'),
      ],
    },
    {
      title: t('legal.privacy.storage.title'),
      items: [
        t('legal.privacy.storage.local'),
        t('legal.privacy.storage.cloud'),
        t('legal.privacy.storage.encryption'),
      ],
    },
    {
      title: t('legal.privacy.rights.title'),
      items: [
        t('legal.privacy.rights.access'),
        t('legal.privacy.rights.deletion'),
        t('legal.privacy.rights.portability'),
        t('legal.privacy.rights.rectification'),
      ],
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
          {t('legal.privacy.title')}
        </h1>
        <p
          style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '32px',
          }}
        >
          {t('legal.privacy.lastUpdated')}
        </p>

        {/* Intro */}
        <div style={sectionStyle}>
          <p style={textStyle}>{t('legal.privacy.intro')}</p>
        </div>

        {/* Sections */}
        {sections.map((section) => (
          <div key={section.title} style={sectionStyle}>
            <h2 style={sectionTitleStyle}>{section.title}</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {section.items.map((item) => (
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
          </div>
        ))}

        {/* Contact */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>{t('legal.privacy.contact.title')}</h2>
          <p style={{ ...textStyle, marginBottom: '12px' }}>
            {t('legal.privacy.contact.description')}
          </p>
          <a
            href={`mailto:${t('legal.privacy.contact.email')}`}
            style={{
              color: '#00d4ff',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: 500,
            }}
          >
            {t('legal.privacy.contact.email')}
          </a>
        </div>
      </div>
    </div>
  );
};
