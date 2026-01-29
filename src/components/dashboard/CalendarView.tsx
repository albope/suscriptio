import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Subscription } from '@/types';
import { formatCurrency } from '@/utils/calculations';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  format,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isToday,
} from 'date-fns';
import { es } from 'date-fns/locale';

interface CalendarViewProps {
  subscriptions: Subscription[];
  onSubscriptionClick: (subscription: Subscription) => void;
}

interface DayWithPayments {
  date: Date;
  subscriptions: Subscription[];
  isCurrentMonth: boolean;
}

export const CalendarView = ({ subscriptions, onSubscriptionClick }: CalendarViewProps) => {
  const { t } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  // Generate calendar days
  const calendarDays = useMemo((): DayWithPayments[] => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Start on Monday
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    return days.map((date) => {
      const daySubscriptions = subscriptions.filter((sub) =>
        isSameDay(new Date(sub.nextPaymentDate), date)
      );

      return {
        date,
        subscriptions: daySubscriptions,
        isCurrentMonth: isSameMonth(date, currentMonth),
      };
    });
  }, [subscriptions, currentMonth]);

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => subMonths(prev, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1));
    setSelectedDay(null);
  };

  const handleDayClick = (day: DayWithPayments) => {
    if (day.subscriptions.length > 0) {
      setSelectedDay(isSameDay(day.date, selectedDay || new Date('1970-01-01')) ? null : day.date);
    }
  };

  const weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  return (
    <div
      style={{
        background: 'rgba(17, 17, 17, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '16px',
        padding: '24px',
      }}
    >
      {/* Header with month navigation */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <div>
          <h3
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#ededed',
              marginBottom: '2px',
            }}
          >
            {format(currentMonth, 'MMMM yyyy', { locale: es })}
          </h3>
          <p style={{ fontSize: '12px', color: '#666666' }}>{t('calendar.subtitle')}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handlePreviousMonth}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#ededed',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
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
          </button>
          <button
            onClick={handleNextMonth}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#ededed',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          >
            <svg
              style={{ width: '16px', height: '16px' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '8px',
          marginBottom: '8px',
        }}
      >
        {weekDays.map((day) => (
          <div
            key={day}
            style={{
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: 600,
              color: '#666666',
              padding: '8px 0',
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '8px',
        }}
      >
        {calendarDays.map((day, index) => {
          const hasPayments = day.subscriptions.length > 0;
          const isSelected = selectedDay && isSameDay(day.date, selectedDay);
          const dayIsToday = isToday(day.date);

          return (
            <button
              key={index}
              onClick={() => handleDayClick(day)}
              disabled={!hasPayments}
              style={{
                aspectRatio: '1',
                borderRadius: '10px',
                background: isSelected
                  ? 'rgba(0, 212, 255, 0.15)'
                  : hasPayments
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'transparent',
                border: dayIsToday
                  ? '2px solid rgba(0, 212, 255, 0.5)'
                  : isSelected
                    ? '1px solid rgba(0, 212, 255, 0.5)'
                    : '1px solid rgba(255, 255, 255, 0.04)',
                cursor: hasPayments ? 'pointer' : 'default',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
                position: 'relative',
                opacity: day.isCurrentMonth ? 1 : 0.3,
              }}
              onMouseEnter={(e) => {
                if (hasPayments) {
                  e.currentTarget.style.background = 'rgba(0, 212, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected && hasPayments) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.04)';
                }
              }}
            >
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: dayIsToday ? 700 : 500,
                  color: dayIsToday ? '#00d4ff' : hasPayments ? '#ededed' : '#666666',
                }}
              >
                {format(day.date, 'd')}
              </span>
              {hasPayments && (
                <div
                  style={{
                    display: 'flex',
                    gap: '2px',
                    marginTop: '4px',
                  }}
                >
                  {day.subscriptions.slice(0, 3).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: 'rgba(0, 212, 255, 0.8)',
                      }}
                    />
                  ))}
                  {day.subscriptions.length > 3 && (
                    <span
                      style={{
                        fontSize: '9px',
                        color: '#00d4ff',
                        fontWeight: 700,
                        marginLeft: '2px',
                      }}
                    >
                      +{day.subscriptions.length - 3}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day details */}
      {selectedDay && (
        <div
          style={{
            marginTop: '20px',
            padding: '16px',
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
          }}
        >
          <h4
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#ededed',
              marginBottom: '12px',
            }}
          >
            {format(selectedDay, "d 'de' MMMM", { locale: es })}
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {calendarDays
              .find((d) => isSameDay(d.date, selectedDay))
              ?.subscriptions.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => onSubscriptionClick(sub)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 12px',
                    background: 'rgba(255, 255, 255, 0.04)',
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
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
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
      )}
    </div>
  );
};
