import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  cancelRegistration,
  selectMyRegistrations,
} from '../features/registrations/registrationsSlice';
import { isPastRegistration, registrationSortKey } from '../utils/eventHelpers';
import RegisteredEventCard from '../components/RegisteredEventCard';
import Toast from '../components/Toast';

export default function MyEvents() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const registrations = useSelector(selectMyRegistrations);
  const [tab, setTab] = useState('upcoming');
  const [toast, setToast] = useState('');
  const closeToast = useCallback(() => setToast(''), []);

  const upcoming = registrations
    .filter((r) => !isPastRegistration(r))
    .sort((a, b) => registrationSortKey(a).localeCompare(registrationSortKey(b)));

  const completed = registrations
    .filter((r) => isPastRegistration(r))
    .sort((a, b) => registrationSortKey(b).localeCompare(registrationSortKey(a)));

  function handleCancel(registration) {
    if (!window.confirm(`Cancel your registration for ${registration.name}?`)) return;
    dispatch(cancelRegistration({ userId: currentUser.id, eventId: registration.eventId }));
    setToast('Registration cancelled.');
  }

  const shown = tab === 'upcoming' ? upcoming : completed;

  return (
    <div>
      <h1>My events</h1>

      <div className="tabs" role="tablist">
        <button
          role="tab"
          aria-selected={tab === 'upcoming'}
          className={tab === 'upcoming' ? 'tab active' : 'tab'}
          onClick={() => setTab('upcoming')}
        >
          Upcoming ({upcoming.length})
        </button>
        <button
          role="tab"
          aria-selected={tab === 'completed'}
          className={tab === 'completed' ? 'tab active' : 'tab'}
          onClick={() => setTab('completed')}
        >
          Completed ({completed.length})
        </button>
      </div>

      {shown.length === 0 ? (
        <div className="empty-state">
          {tab === 'upcoming' ? (
            <>
              <p>You haven't registered for any upcoming events yet.</p>
              <Link to="/events" className="btn btn-primary">Browse events</Link>
            </>
          ) : (
            <p>No completed events yet. Events you attended will appear here.</p>
          )}
        </div>
      ) : (
        <div className="event-grid">
          {shown.map((reg) => (
            <RegisteredEventCard
              key={reg.eventId}
              registration={reg}
              onCancel={tab === 'upcoming' ? handleCancel : undefined}
            />
          ))}
        </div>
      )}

      <Toast message={toast} type="info" onClose={closeToast} />
    </div>
  );
}