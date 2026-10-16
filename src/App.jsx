import {Routes,Route,BrowserRouter} from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Events from './pages/Events.jsx';
import MyEvents from './pages/MyEvents.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import NotFound from './pages/NotFound.jsx';
import EventDetails from './pages/EventDetails.jsx';
import './App.css';

export default function App() {
    return (
     <>
        <Navbar />
        <main className="container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/my-events" element={<MyEvents />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/events/:id" element={<EventDetails />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
        </main>
     </>
        
    );
}