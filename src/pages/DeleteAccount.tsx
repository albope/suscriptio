import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { clearAllLocalData } from '@/utils/clearLocalData';

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

export const DeleteAccount = () => {
  const { t } = useTranslation();
  const { user, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmWord = t('auth.deleteAccountConfirmWord');
  const isConfirmed = confirmText === confirmWord;

  const handleDelete = async () => {
    setError(null);
    setLoading(true);

    clearAllLocalData();

    const { error: deleteError } = await deleteAccount();
    if (deleteError) {
      setError(t('auth.errors.deleteAccountFailed'));
      setLoading(false);
      return;
    }

    toast.success(t('auth.accountDeleted'));
    navigate('/');
  };

  const deletedItems = [
    t('legal.deleteAccount.whatGetsDeleted.email'),
    t('legal.deleteAccount.whatGetsDeleted.subscriptions'),
    t('legal.deleteAccount.whatGetsDeleted.profile'),
    t('legal.deleteAccount.whatGetsDeleted.premium'),
    t('legal.deleteAccount.whatGetsDeleted.local'),
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
          {t('legal.deleteAccount.title')}
        </h1>
        <p
          style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '32px',
          }}
        >
          {t('legal.deleteAccount.lastUpdated')}
        </p>

        {/* Intro */}
        <div style={sectionStyle}>
          <p style={textStyle}>{t('legal.deleteAccount.intro')}</p>
        </div>

        {/* What gets deleted */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>{t('legal.deleteAccount.whatGetsDeleted.title')}</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {deletedItems.map((item) => (
              <li key={item} style={listItemStyle}>
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    color: '#ef4444',
                  }}
                >
                  &bull;
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* How to delete */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>{t('legal.deleteAccount.howToDelete.title')}</h2>

          {user ? (
            <>
              <div
                style={{
                  padding: '16px',
                  background: 'rgba(0, 212, 255, 0.06)',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 212, 255, 0.15)',
                  marginBottom: '16px',
                }}
              >
                <h3
                  style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#00d4ff',
                    marginBottom: '6px',
                  }}
                >
                  {t('legal.deleteAccount.howToDelete.loggedInTitle')}
                </h3>
                <p style={{ fontSize: '14px', color: '#999' }}>
                  {t('legal.deleteAccount.howToDelete.loggedInDescription')}
                </p>
              </div>

              <button
                onClick={() => setModalOpen(true)}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '15px',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                {t('auth.deleteAccountButton')}
              </button>
            </>
          ) : (
            <div
              style={{
                padding: '16px',
                background: 'rgba(245, 158, 11, 0.06)',
                borderRadius: '12px',
                border: '1px solid rgba(245, 158, 11, 0.15)',
              }}
            >
              <h3
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#f59e0b',
                  marginBottom: '6px',
                }}
              >
                {t('legal.deleteAccount.howToDelete.notLoggedInTitle')}
              </h3>
              <p style={{ fontSize: '14px', color: '#999', marginBottom: '12px' }}>
                {t('legal.deleteAccount.howToDelete.notLoggedInDescription')}
              </p>
              <Link
                to="/login"
                style={{
                  display: 'inline-block',
                  padding: '10px 20px',
                  background: 'linear-gradient(180deg, #00d4ff 0%, #00a8cc 100%)',
                  color: '#000',
                  fontWeight: 600,
                  fontSize: '14px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  transition: 'opacity 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                {t('legal.deleteAccount.howToDelete.loginLink')}
              </Link>
            </div>
          )}
        </div>

        {/* Alternative */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>
            {t('legal.deleteAccount.howToDelete.alternativeTitle')}
          </h2>
          <p style={{ ...textStyle, marginBottom: '12px' }}>
            {t('legal.deleteAccount.howToDelete.alternativeDescription')}
          </p>
        </div>

        {/* Contact */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>{t('legal.deleteAccount.contact.title')}</h2>
          <p style={{ ...textStyle, marginBottom: '12px' }}>
            {t('legal.deleteAccount.contact.description')}
          </p>
          <a
            href="mailto:albertobort@gmail.com"
            style={{
              color: '#00d4ff',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: 500,
            }}
          >
            albertobort@gmail.com
          </a>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setConfirmText('');
          setError(null);
        }}
        title={t('auth.deleteAccountConfirmTitle')}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {error && (
            <div
              style={{
                background: 'rgba(255, 68, 68, 0.1)',
                border: '1px solid rgba(255, 68, 68, 0.2)',
                borderRadius: '10px',
                padding: '12px 16px',
                color: '#ff6b6b',
                fontSize: '14px',
              }}
            >
              {error}
            </div>
          )}

          {/* Warning */}
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '12px',
              padding: '16px',
            }}
          >
            <p
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#ef4444',
                marginBottom: '10px',
              }}
            >
              {t('auth.deleteAccountWarning')}
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['email', 'subscriptions', 'profile', 'premium'].map((key) => (
                <li
                  key={key}
                  style={{
                    fontSize: '13px',
                    color: '#999',
                    paddingLeft: '16px',
                    position: 'relative',
                    marginBottom: '4px',
                  }}
                >
                  <span style={{ position: 'absolute', left: 0, color: '#ef4444' }}>&bull;</span>
                  {t(`auth.deleteAccountWarningItems.${key}`)}
                </li>
              ))}
            </ul>
          </div>

          {/* Confirm input */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                color: '#888888',
                marginBottom: '8px',
              }}
            >
              {t('auth.deleteAccountConfirmLabel')}
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={confirmWord}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                fontSize: '14px',
                color: '#ededed',
                backgroundColor: '#0a0a0a',
                outline: 'none',
              }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button
              variant="secondary"
              onClick={() => {
                setModalOpen(false);
                setConfirmText('');
                setError(null);
              }}
              style={{ flex: 1 }}
            >
              {t('common.cancel')}
            </Button>
            <button
              onClick={handleDelete}
              disabled={!isConfirmed || loading}
              style={{
                flex: 1,
                padding: '12px 20px',
                background:
                  !isConfirmed || loading
                    ? '#333333'
                    : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: !isConfirmed || loading ? '#666666' : '#fff',
                fontWeight: 600,
                fontSize: '14px',
                border: 'none',
                borderRadius: '10px',
                cursor: !isConfirmed || loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {loading ? t('auth.deleteAccountDeleting') : t('auth.deleteAccountButton')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
