import { Link } from 'react-router-dom';
import { formatEventDate } from '../utils/eventHelpers';

export default function RegisteredEventCard({ registration, onCancel }) {
  // Reuse the date formatter by giving it the same shape as an API event
  const date = formatEventDate({
    dates: { start: { localDate: registration.localDate, localTime: registration.localTime } },
  });

  return (
    <article className="event-card">
      {registration.image && <img src={registration.image} alt={registration.name} loading="lazy" />}
      <div className="event-card-body">
        <span className="badge">{registration.category}</span>
        <h3>{registration.name}</h3>
        <p>{date}</p>
        <p>
          {registration.venueName}
          {registration.city && `, ${registration.city}`}
        </p>
        <div className="card-actions">
          <Link to={`/events/${registration.eventId}`} className="btn">Details</Link>
          {onCancel && (
            <button className="btn btn-danger" onClick={() => onCancel(registration)}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </article>
  );
}