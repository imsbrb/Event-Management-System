import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchEvents, fetchCategories } from '../features/events/eventsSlice';
import EventCard from '../components/EventCard';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import SearchFilters from '../components/SearchFilters';
import Pagination from '../components/Pagination';

export default function Events() {
  const dispatch = useDispatch();
  const { list, status, error, page, categories } = useSelector((state) => state.events);
  const [searchParams, setSearchParams] = useSearchParams();

  // Read current filters from the URL
  const keyword = searchParams.get('keyword') ?? '';
  const category = searchParams.get('category') ?? '';
  const city = searchParams.get('city') ?? '';
  const pageNumber = Number(searchParams.get('page') ?? 0);

  // Load categories once
  useEffect(() => {
    if (categories.length === 0) dispatch(fetchCategories());
  }, [dispatch, categories.length]);

  // Fetch events whenever a filter changes
  const loadEvents = useCallback(() => {
    dispatch(fetchEvents({ keyword, classificationName: category, city, page: pageNumber }));
  }, [dispatch, keyword, category, city, pageNumber]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Update the URL. Any filter change goes back to page 0.
  const updateFilters = useCallback(
    (changes) => {
      const next = { keyword, category, city, page: 0, ...changes };
      const clean = Object.fromEntries(
        Object.entries(next)
          .filter(([, value]) => value !== '' && value !== 0)
          .map(([key, value]) => [key, String(value)])
      );
      setSearchParams(clean);
    },
    [keyword, category, city, setSearchParams]
  );

  function handlePageChange(newPage) {
    updateFilters({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div>
      <h1>Upcoming events</h1>

      <SearchFilters
        keyword={keyword}
        city={city}
        category={category}
        categories={categories}
        onChange={updateFilters}
      />

      {status === 'succeeded' && page && (
        <p className="results-count">{page.totalElements} events found</p>
      )}

      {status === 'loading' && <Loader text="Loading events..." />}
      {status === 'failed' && <ErrorMessage message={error} onRetry={loadEvents} />}
      {status === 'succeeded' && list.length === 0 && (
        <p>No events match your search. Try different filters.</p>
      )}

      {status === 'succeeded' && list.length > 0 && (
        <>
          <div className="event-grid">
            {list.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          <Pagination page={page} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
}