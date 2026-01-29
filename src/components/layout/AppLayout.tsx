import { ReactNode } from 'react';
import { Header } from './Header';
import { MobileNav } from './MobileNav';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen relative" style={{ background: '#000000' }}>
      {/* Gradient background effects */}
      <div className="fixed inset-0 bg-gradient-mesh pointer-events-none" />
      <div className="fixed inset-0 bg-grid pointer-events-none opacity-50" />

      <div className="relative z-10">
        <Header />
        <main
          style={{
            paddingLeft: '16px',
            paddingRight: '16px',
            paddingTop: '40px',
            paddingBottom: '112px',
            maxWidth: '1280px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {children}
        </main>
        <MobileNav />
      </div>
    </div>
  );
};
