import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CATEGORIES = ['Music', 'Sports', 'Arts & Theatre', 'Family', 'Film', 'Miscellaneous'];

export default function Home() {
  const currentUser = useSelector((state) => state.auth.currentUser);

  return (
    <div className="home">
      <section className="hero">
        <h1>Find your next event</h1>
        <p>Concerts, games, shows and more, all in one place. Register and keep track of what you're going to.</p>
        <div className="hero-actions">
          <Link to="/events" className="btn btn-primary">Browse events</Link>
          {currentUser ? (
            <Link to="/my-events" className="btn">My events</Link>
          ) : (
            <Link to="/register" className="btn">Create an account</Link>
          )}
        </div>
      </section>

      <section>
        <h2>Browse by category</h2>
        <div className="category-grid">
          {CATEGORIES.map((name) => (
            <Link key={name} to={`/events?category=${encodeURIComponent(name)}`} className="category-tile">
              {name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}