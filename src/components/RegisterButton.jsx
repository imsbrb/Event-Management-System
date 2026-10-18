import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  registerForEvent,
  cancelRegistration,
  selectIsRegistered,
} from '../features/registrations/registrationsSlice';
import { toRegistration } from '../utils/eventHelpers';
import Toast from './Toast';

export default function RegisterButton({ event }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const isRegistered = useSelector(selectIsRegistered(event.id));
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const closeToast = useCallback(() => setToast({ message: '', type: 'success' }), []);

  const isCancelled = event.dates?.status?.code === 'cancelled';

  function handleRegister() {
    dispatch(registerForEvent({ userId: currentUser.id, registration: toRegistration(event) }));
    setToast({ message: `You're registered for ${event.name}!`, type: 'success' });
  }

  function handleCancel() {
    if (!window.confirm('Cancel your registration for this event?')) return;
    dispatch(cancelRegistration({ userId: currentUser.id, eventId: event.id }));
    setToast({ message: 'Your registration has been cancelled.', type: 'info' });
  }

  let button;
  if (!currentUser) {
    button = (
      <button className="btn btn-primary" onClick={() => navigate('/login', { state: { from: location } })}>
        Log in to register
      </button>
    );
  } else if (isCancelled) {
    button = <button className="btn" disabled>Event cancelled</button>;
  } else if (isRegistered) {
    button = (
      <div className="registered-row">
        <span className="registered-label">✓ You're registered</span>
        <button className="btn btn-danger" onClick={handleCancel}>Cancel registration</button>
      </div>
    );
  } else {
    button = <button className="btn btn-primary" onClick={handleRegister}>Register for this event</button>;
  }

  return (
    <div className="register-box">
      {button}
      <Toast message={toast.message} type={toast.type} onClose={closeToast} />
    </div>
  );
}