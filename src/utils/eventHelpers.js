export function getEventImage(event) {
  const images = event.images ?? [];
  const wide = images
    .filter((img) => img.ratio === '16_9')
    .sort((a, b) => b.width - a.width);
  return wide[0]?.url ?? images[0]?.url ?? '';
}

export function getVenue(event) {
  const venue = event._embedded?.venues?.[0];
  return {
    name: venue?.name ?? 'Venue TBA',
    city: venue?.city?.name ?? '',
    country: venue?.country?.name ?? '',
  };
}

export function getCategory(event) {
  return event.classifications?.[0]?.segment?.name ?? 'Other';
}

export function formatEventDate(event) {
  const start = event.dates?.start;
  if (!start?.localDate) return 'Date TBA';
  const date = new Date(`${start.localDate}T${start.localTime ?? '00:00:00'}`);
  return date.toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
    ...(start.localTime && { hour: 'numeric', minute: '2-digit' }),
  });
}