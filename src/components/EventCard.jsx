import { Link } from 'react-router-dom';
import { getEventImage, getVenue, getCategory, formatEventDate } from '../utils/eventHelpers';

export default function EventCard({ event }) {
  const venue = getVenue(event);
  return (
    <article className="event-card">
      <img src={getEventImage(event)} alt={event.name} loading="lazy" />
      <div className="event-card-body">
        <span className="badge">{getCategory(event)}</span>
        <h3>{event.name}</h3>
        <p>{formatEventDate(event)}</p>
        <p>{venue.name}{venue.city && `, ${venue.city}`}</p>
        <Link to={`/events/${event.id}`} className="btn">View details</Link>
      </div>
    </article>
  );
}