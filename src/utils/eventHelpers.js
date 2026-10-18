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
// What we store when someone registers: a small copy of the event
export function toRegistration(event) {
  const venue = getVenue(event);
  const start = event.dates?.start ?? {};
  return {
    eventId: event.id,
    name: event.name,
    image: getEventImage(event),
    category: getCategory(event),
    venueName: venue.name,
    city: venue.city,
    localDate: start.localDate ?? null,
    localTime: start.localTime ?? null,
    dateTime: start.dateTime ?? null,
    url: event.url ?? null,
    registeredAt: new Date().toISOString(),
  };
}

// Has this registered event already happened?
export function isPastRegistration(reg) {
  const when = reg.dateTime ?? (reg.localDate ? `${reg.localDate}T23:59:59` : null);
  if (!when) return false; // no date known, so treat it as upcoming
  return new Date(when) < new Date();
}

// Sort key: date + time as one string, e.g. "2026-11-02T19:30:00"
export function registrationSortKey(reg) {
  return `${reg.localDate ?? '9999-12-31'}T${reg.localTime ?? '00:00:00'}`;
}