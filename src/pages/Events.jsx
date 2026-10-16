import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '../features/events/eventsSlice';

export default function Events() {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  if (status === 'loading') return <p>Loading events...</p>;
  if (status === 'failed') return <p className="error">{error}</p>;

  return (
    <div>
      <h1>Events</h1>
      <ul>
        {list.map((event) => (
          <li key={event.id}>{event.name}: {event.dates?.start?.localDate}</li>
        ))}
      </ul>
    </div>
  );
}