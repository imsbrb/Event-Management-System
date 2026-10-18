export default function Pagination({ page, onPageChange }) {
  if (!page || page.totalPages <= 1) return null;

  const current = page.number; // Ticketmaster pages start at 0
  // Ticketmaster refuses requests where size * page >= 1000
  const lastPage = Math.min(page.totalPages, Math.floor(1000 / page.size)) - 1;

  return (
    <div className="pagination">
      <button disabled={current === 0} onClick={() => onPageChange(current - 1)}>
        ← Previous
      </button>
      <span>Page {current + 1} of {lastPage + 1}</span>
      <button disabled={current >= lastPage} onClick={() => onPageChange(current + 1)}>
        Next →
      </button>
    </div>
  );
}