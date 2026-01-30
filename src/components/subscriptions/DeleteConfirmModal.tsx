import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useCallback, useId } from 'react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  subscriptionName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export const DeleteConfirmModal = ({
  isOpen,
  subscriptionName,
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteConfirmModalProps) => {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  // Focus trap implementation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isDeleting) {
        onCancel();
        return;
      }

      if (e.key !== 'Tab' || !modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    },
    [onCancel, isDeleting]
  );

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      requestAnimationFrame(() => {
        const cancelButton = modalRef.current?.querySelector<HTMLElement>('button');
        cancelButton?.focus();
      });
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';

      if (previousActiveElement.current && isOpen) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={isDeleting ? undefined : onCancel}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '400px',
          background:
            'linear-gradient(145deg, rgba(20, 20, 20, 0.98) 0%, rgba(10, 10, 10, 0.98) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: `
            0 0 0 1px rgba(255, 255, 255, 0.03) inset,
            0 24px 48px -12px rgba(0, 0, 0, 0.5),
            0 0 60px rgba(239, 68, 68, 0.1)
          `,
          animation: 'modalIn 0.2s ease-out',
          outline: 'none',
        }}
      >
        <style>
          {`
            @keyframes modalIn {
              from {
                opacity: 0;
                transform: scale(0.95) translateY(-10px);
              }
              to {
                opacity: 1;
                transform: scale(1) translateY(0);
              }
            }
          `}
        </style>

        {/* Warning Icon */}
        <div
          aria-hidden="true"
          style={{
            width: '56px',
            height: '56px',
            margin: '0 auto 20px',
            borderRadius: '14px',
            background:
              'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 30px rgba(239, 68, 68, 0.15)',
          }}
        >
          <svg
            style={{ width: '28px', height: '28px', color: '#ef4444' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>

        {/* Title */}
        <h2
          id={titleId}
          style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#ededed',
            textAlign: 'center',
            marginBottom: '12px',
          }}
        >
          {t('subscriptions.deleteConfirm.title', 'Eliminar suscripción')}
        </h2>

        {/* Description */}
        <p
          id={descriptionId}
          style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.6)',
            textAlign: 'center',
            marginBottom: '8px',
            lineHeight: 1.5,
          }}
        >
          {t('subscriptions.deleteConfirm.message', '¿Estás seguro de que deseas eliminar')}
        </p>
        <p
          style={{
            fontSize: '15px',
            fontWeight: 600,
            color: '#00d4ff',
            textAlign: 'center',
            marginBottom: '8px',
          }}
        >
          "{subscriptionName}"
        </p>
        <p
          style={{
            fontSize: '13px',
            color: 'rgba(255, 255, 255, 0.4)',
            textAlign: 'center',
            marginBottom: '24px',
          }}
        >
          {t('subscriptions.deleteConfirm.warning', 'Esta acción no se puede deshacer.')}
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onCancel}
            disabled={isDeleting}
            style={{
              flex: 1,
              padding: '12px 20px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#888888',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              opacity: isDeleting ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isDeleting) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            {t('common.cancel', 'Cancelar')}
          </button>

          <button
            onClick={onConfirm}
            disabled={isDeleting}
            style={{
              flex: 1,
              padding: '12px 20px',
              background: isDeleting
                ? 'rgba(239, 68, 68, 0.3)'
                : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#fff',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: isDeleting ? 'none' : '0 4px 16px rgba(239, 68, 68, 0.25)',
            }}
            onMouseEnter={(e) => {
              if (!isDeleting) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.35)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(239, 68, 68, 0.25)';
            }}
          >
            {isDeleting ? (
              <>
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }}
                />
                <style>
                  {`
                    @keyframes spin {
                      to { transform: rotate(360deg); }
                    }
                  `}
                </style>
                {t('common.deleting', 'Eliminando...')}
              </>
            ) : (
              <>
                <svg
                  style={{ width: '16px', height: '16px' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                {t('common.delete', 'Eliminar')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
