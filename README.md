# Evntly: Event Management System

A React + Redux Toolkit app for exploring real events from the Ticketmaster Discovery API, registering for them, and managing your registrations.

Web Programming, Assignment 2

## Features
- **Authentication:** register, log in, log out (frontend simulation), with session persisted in localStorage
- **Event exploration:** upcoming events from Ticketmaster, keyword search (debounced), category and city filters, pagination
- **Event details:** image, date and time, venue and location, category and genre, status, price range, notes, Ticketmaster link
- **Registration:** register or cancel, duplicate prevention, confirmation messages, registrations tied to the logged-in user
- **My Events:** upcoming and completed tabs, cancel upcoming registrations
- **Protected routes:** My Events requires login, and users return to the page they wanted after logging in
- Loading, error and empty states throughout, plus a responsive layout

## Tech stack
React (Vite), Redux Toolkit, React Redux, React Router, Ticketmaster Discovery API v2

## Getting started

### 1. Get a Ticketmaster API key
Create an account at https://developer.ticketmaster.com/, open **My Apps**, and copy the **Consumer Key**.

### 2. Install and configure
```bash
git clone https://github.com/imsbrb/Event-Management-System.git
cd Event-Management-System
npm install
```
Copy `.env.example` to `.env` and add your key:
```
VITE_TM_API_KEY=your_consumer_key
```

### 3. Run
```bash
npm run dev
```
Open http://localhost:5173

## Project structure
```
src/
  api/ticketmaster.js         API helper (base URL, key, error handling)
  app/store.js                Redux store + localStorage persistence
  features/
    auth/authSlice.js         users, current user, auth errors
    events/eventsSlice.js     event list, selected event, categories (async thunks)
    registrations/            registrations per user + selectors
  components/                 reusable UI (EventCard, Loader, SearchFilters, ProtectedRoute...)
  pages/                      one component per route
  utils/                      storage, event helpers
```

## Routes
| Path | Page | Access |
|---|---|---|
| `/` | Home | Public |
| `/events` | Event list with search and filters | Public |
| `/events/:id` | Event details | Public |
| `/login`, `/register` | Auth forms | Logged-out users |
| `/my-events` | My registrations | Logged-in users only |

## Redux structure
- **auth:** `users`, `currentUser`, `error`. Reducers: `registerUser`, `login`, `logout`, `clearAuthError`.
- **events:** `list`, `page`, `status`, `error`, `selected`, `categories`. Async thunks: `fetchEvents`, `fetchEventById`, `fetchCategories`.
- **registrations:** `byUser: { [userId]: [...] }`. Reducers: `registerForEvent`, `cancelRegistration`. Selectors: `selectMyRegistrations`, `selectIsRegistered`.

## Design decisions
- **Only user-created data is persisted** (auth and registrations). Event data is always fetched fresh, so it never goes stale.
- **Registrations store a snapshot** of each event (name, date, venue, image), so My Events needs no extra API calls and stays within the rate limit.
- **Registrations are keyed by user id**, so multiple users on one browser each see only their own.
- **Filters live in the URL** (`/events?keyword=jazz&category=Music`), so searches survive refresh, work with Back and Forward, and can be shared. Category tiles on the Home page link directly to filtered results.
- **Search is debounced (500 ms)** to respect Ticketmaster's 2 requests/second limit.
- **Default country is US**, since Ticketmaster has very few events listed in Pakistan.
- **Pagination is capped** at Ticketmaster's 1000-result deep-paging limit.

## Limitations
- Authentication is a frontend simulation: passwords are stored in localStorage and are not secure. A real app would use a backend.
- The API key is kept out of GitHub via `.env`, but in a frontend-only app it is still visible in the browser's network requests.
- Registration is local to this app and does not buy real tickets.