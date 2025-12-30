import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './components/dashboard/Dashboard';
import { SubscriptionList } from './components/subscriptions/SubscriptionList';
import { useAutoAdvanceDates } from './hooks/useAutoAdvanceDates';

function App() {
  useAutoAdvanceDates();

  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/subscriptions" element={<SubscriptionList />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
