import { useState, useEffect } from 'react';

export default function SearchFilters({ keyword, city, category, categories, onChange }) {
  // What the user is typing right now (updates on every keystroke)
  const [text, setText] = useState(keyword);
  const [cityText, setCityText] = useState(city);

  // Debounce: only send the search 500ms after the user stops typing
  useEffect(() => {
    if (text.trim() === keyword && cityText.trim() === city) return;
    const timer = setTimeout(() => {
      onChange({ keyword: text.trim(), city: cityText.trim() });
    }, 500);
    return () => clearTimeout(timer);
  }, [text, cityText, keyword, city, onChange]);

  
  function handleClear() {
    setText('');
    setCityText('');
    onChange({ keyword: '', city: '', category: '' });
  }

  return (
    <div className="filters">
      <input
        type="search"
        placeholder="Search events, artists, teams..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <input
        type="text"
        placeholder="City"
        value={cityText}
        onChange={(e) => setCityText(e.target.value)}
      />
      <select value={category} onChange={(e) => onChange({ category: e.target.value })}>
        <option value="">All categories</option>
        {categories.map((name) => (
          <option key={name} value={name}>{name}</option>
        ))}
      </select>
      <button type="button" onClick={handleClear}>Clear</button>
    </div>
  );
}