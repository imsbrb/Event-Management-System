import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEventById, clearSelected } from '../features/events/eventsSlice';
import { getEventImage, getCategory, formatEventDate } from '../utils/eventHelpers';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const STATUS_LABELS = {
  onsale: 'On sale',
  offsale: 'Off sale',
  cancelled: 'Cancelled',
  postponed: 'Postponed',
  rescheduled: 'Rescheduled',
};

function formatPrice(range) {
  if (!range) return null;
  const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: range.currency || 'USD' });
  return range.min === range.max
    ? money.format(range.min)
    : `${money.format(range.min)} – ${money.format(range.max)}`;
}

export default function EventDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selected, selectedStatus, selectedError } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEventById(id));
    return () => {
      dispatch(clearSelected());
    };
  }, [dispatch, id]);

  if (selectedStatus === 'loading' || selectedStatus === 'idle') {
    return <Loader text="Loading event..." />;
  }

  if (selectedStatus === 'failed') {
    return (
      <div>
        <ErrorMessage
          message={selectedError === 'Not found.' ? 'This event could not be found.' : selectedError}
          onRetry={() => dispatch(fetchEventById(id))}
        />
        <Link to="/events">← Back to events</Link>
      </div>
    );
  }

  // Guard: make sure we're not showing a previous event while the new one loads
  if (!selected || selected.id !== id) return <Loader text="Loading event..." />;

  const event = selected;
  const venue = event._embedded?.venues?.[0];
  const genre = event.classifications?.[0]?.genre?.name;
  const statusCode = event.dates?.status?.code;
  const price = formatPrice(event.priceRanges?.[0]);
  const location = [venue?.city?.name, venue?.state?.name, venue?.country?.name]
    .filter(Boolean)
    .join(', ');

  return (
    <article className="event-details">
      <Link to="/events" className="back-link">← Back to events</Link>

      <img className="details-image" src={getEventImage(event)} alt={event.name} />

      <div className="details-header">
        <div className="badges">
          <span className="badge">{getCategory(event)}</span>
          {genre && genre !== 'Undefined' && <span className="badge">{genre}</span>}
          {statusCode && (
            <span className={`badge status-${statusCode}`}>
              {STATUS_LABELS[statusCode] ?? statusCode}
            </span>
          )}
        </div>
        <h1>{event.name}</h1>
      </div>

      <div className="details-grid">
        <section>
          <h3>📅 Date & time</h3>
          <p>{formatEventDate(event)}</p>
          {event.dates?.timezone && <p className="muted">{event.dates.timezone}</p>}
        </section>

        <section>
          <h3>📍 Venue</h3>
          <p>{venue?.name ?? 'Venue TBA'}</p>
          {venue?.address?.line1 && <p className="muted">{venue.address.line1}</p>}
          {location && <p className="muted">{location}</p>}
        </section>

        {price && (
          <section>
            <h3>🎟️ Price range</h3>
            <p>{price}</p>
          </section>
        )}
      </div>

      {/* Registration button goes here in the next part */}

      {(event.info || event.pleaseNote) && (
        <section className="details-notes">
          {event.info && (
            <>
              <h3>About this event</h3>
              <p>{event.info}</p>
            </>
          )}
          {event.pleaseNote && (
            <>
              <h3>Please note</h3>
              <p>{event.pleaseNote}</p>
            </>
          )}
        </section>
      )}

      {event.url && (
        <a href={event.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
          View on Ticketmaster ↗
        </a>
      )}
    </article>
  );
}