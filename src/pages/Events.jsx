import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '../features/events/eventsSlice';
import EventCard from '../components/EventCard';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

export default function Events() {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  return (
    <div>
      <h1>Upcoming events</h1>

      {status === 'loading' && <Loader text="Loading events..." />}
      {status === 'failed' && (
        <ErrorMessage message={error} onRetry={() => dispatch(fetchEvents())} />
      )}
      {status === 'succeeded' && list.length === 0 && <p>No events found.</p>}

      {status === 'succeeded' && list.length > 0 && (
        <div className="event-grid">
          {list.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}