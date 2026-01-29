import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Subscription } from '@/types';
import { formatCurrency } from '@/utils/calculations';
import { format, addDays, startOfDay, isSameDay, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

interface PaymentTimelineProps {
  subscriptions: Subscription[];
  onSubscriptionClick: (subscription: Subscription) => void;
  daysToShow?: number;
}

interface TimelineEvent {
  date: Date;
  subscriptions: Subscription[];
}

export const PaymentTimeline = ({
  subscriptions,
  onSubscriptionClick,
  daysToShow = 60,
}: PaymentTimelineProps) => {
  const { t } = useTranslation();
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);

  // Group subscriptions by payment date
  const timelineEvents = useMemo(() => {
    const today = startOfDay(new Date());
    const endDate = addDays(today, daysToShow);

    // Filter subscriptions within date range
    const relevantSubs = subscriptions.filter((sub) => {
      const paymentDate = startOfDay(new Date(sub.nextPaymentDate));
      return paymentDate >= today && paymentDate <= endDate;
    });

    // Group by date
    const eventMap = new Map<string, TimelineEvent>();

    relevantSubs.forEach((sub) => {
      const paymentDate = startOfDay(new Date(sub.nextPaymentDate));
      const dateKey = paymentDate.toISOString();

      if (!eventMap.has(dateKey)) {
        eventMap.set(dateKey, {
          date: paymentDate,
          subscriptions: [],
        });
      }

      eventMap.get(dateKey)!.subscriptions.push(sub);
    });

    // Convert to array and sort by date
    return Array.from(eventMap.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [subscriptions, daysToShow]);

  if (timelineEvents.length === 0) {
    return (
      <div
        style={{
          padding: '40px 24px',
          textAlign: 'center',
          background: 'rgba(17, 17, 17, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '16px',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <svg
            style={{ width: '24px', height: '24px', color: '#666666' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p style={{ fontSize: '14px', color: '#666666' }}>{t('timeline.noPayments')}</p>
      </div>
    );
  }

  const today = startOfDay(new Date());

  return (
    <div
      style={{
        background: 'rgba(17, 17, 17, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '16px',
        padding: '24px',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h3
          style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#ededed',
            marginBottom: '4px',
          }}
        >
          {t('timeline.title')}
        </h3>
        <p style={{ fontSize: '13px', color: '#666666' }}>
          {t('timeline.subtitle', { days: daysToShow })}
        </p>
      </div>

      {/* Timeline Container */}
      <div
        style={{
          position: 'relative',
          paddingLeft: '20px',
        }}
      >
        {/* Vertical line */}
        <div
          style={{
            position: 'absolute',
            left: '7px',
            top: '0',
            bottom: '0',
            width: '2px',
            background:
              'linear-gradient(180deg, rgba(0, 212, 255, 0.3) 0%, rgba(0, 212, 255, 0.05) 100%)',
          }}
        />

        {/* Events */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {timelineEvents.map((event) => {
            const isToday = isSameDay(event.date, today);
            const daysFromNow = differenceInDays(event.date, today);
            const eventKey = event.date.toISOString();

            return (
              <div key={eventKey} style={{ position: 'relative' }}>
                {/* Timeline dot */}
                <div
                  style={{
                    position: 'absolute',
                    left: '-20px',
                    top: '8px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: isToday
                      ? 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%)'
                      : 'rgba(255, 255, 255, 0.1)',
                    border: isToday ? '2px solid #000' : '2px solid rgba(0, 0, 0, 0.8)',
                    boxShadow: isToday ? '0 0 16px rgba(0, 212, 255, 0.6)' : 'none',
                    zIndex: 1,
                  }}
                />

                {/* Event card */}
                <div
                  style={{
                    background:
                      hoveredEvent === eventKey
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '16px',
                    transition: 'all 0.2s ease',
                    cursor: 'default',
                  }}
                  onMouseEnter={() => setHoveredEvent(eventKey)}
                  onMouseLeave={() => setHoveredEvent(null)}
                >
                  {/* Date header */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '12px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '13px',
                          fontWeight: 600,
                          color: isToday ? '#00d4ff' : '#ededed',
                          marginBottom: '2px',
                        }}
                      >
                        {format(event.date, "d 'de' MMMM", { locale: es })}
                        {isToday && (
                          <span
                            style={{
                              marginLeft: '8px',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              background: 'rgba(0, 212, 255, 0.15)',
                              fontSize: '11px',
                              fontWeight: 700,
                            }}
                          >
                            HOY
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666666' }}>
                        {daysFromNow === 0
                          ? 'Hoy'
                          : daysFromNow === 1
                            ? 'Mañana'
                            : `En ${daysFromNow} días`}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#ededed',
                      }}
                    >
                      {event.subscriptions.length}{' '}
                      {event.subscriptions.length === 1 ? 'pago' : 'pagos'}
                    </div>
                  </div>

                  {/* Subscription list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {event.subscriptions.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => onSubscriptionClick(sub)}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '10px 12px',
                          background: 'rgba(0, 0, 0, 0.2)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          textAlign: 'left',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(0, 212, 255, 0.08)';
                          e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.2)';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                        }}
                      >
                        <span
                          style={{
                            fontSize: '13px',
                            color: '#ededed',
                            fontWeight: 500,
                          }}
                        >
                          {sub.name}
                        </span>
                        <span
                          style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#00d4ff',
                          }}
                        >
                          {formatCurrency(sub.cost, sub.currency)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
