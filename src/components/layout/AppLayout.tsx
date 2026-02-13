import { ReactNode } from 'react';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { OfflineIndicator } from './OfflineIndicator';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen relative" style={{ background: '#000000' }}>
      {/* Skip to main content link for keyboard users */}
      <a
        href="#main-content"
        className="skip-to-main"
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '0',
          zIndex: 9999,
          padding: '12px 24px',
          background: '#00d4ff',
          color: '#000',
          fontWeight: 600,
          fontSize: '14px',
          textDecoration: 'none',
          borderRadius: '0 0 8px 8px',
        }}
        onFocus={(e) => {
          e.currentTarget.style.left = '16px';
        }}
        onBlur={(e) => {
          e.currentTarget.style.left = '-9999px';
        }}
      >
        Saltar al contenido principal
      </a>

      {/* Gradient background effects */}
      <div className="fixed inset-0 bg-gradient-mesh pointer-events-none" aria-hidden="true" />
      <div className="fixed inset-0 bg-grid pointer-events-none opacity-50" aria-hidden="true" />

      <div className="relative z-10">
        <OfflineIndicator />
        <Header />
        <main
          id="main-content"
          tabIndex={-1}
          style={{
            paddingLeft: '16px',
            paddingRight: '16px',
            paddingTop: '40px',
            paddingBottom: '112px',
            maxWidth: '1280px',
            marginLeft: 'auto',
            marginRight: 'auto',
            outline: 'none',
          }}
        >
          {children}
        </main>
        <MobileNav />
      </div>
    </div>
  );
};
