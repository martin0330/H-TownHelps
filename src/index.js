import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Login from './pages/login';
import Registration from './pages/registration';
import MainPage from './pages/mainPage';
import UserProfile from './pages/userProfile';
import EventManage from './pages/addEvent';
import EventList from './pages/eventList';
import EditEvent from './pages/editEvent';
import NotificationSys from './pages/notifications';
import VolunteerHist from './pages/volunteerHist';
import VolunteerMatchingForm from './pages/volunteerMatch';
import NotFound from './pages/notFound';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/authContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthProvider>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<App />}>
                    <Route index element={<Login />} />
                    <Route path='registration' element={<Registration />} />
                    <Route path='main' element={<MainPage />} />{' '}
                    <Route path='userprofile' element={<UserProfile />} />
                    <Route path='events' element={<EventList />} />
                    <Route path='eventmanage' element={<EventManage />} />
                    <Route path='editEvent/:id' element={<EditEvent />} />
                    <Route
                        path='volunteer-match'
                        element={<VolunteerMatchingForm />}
                    />
                    <Route path='notifications' element={<NotificationSys />} />
                    <Route path='volunteerhist' element={<VolunteerHist />} />
                    <Route path='*' element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </AuthProvider>
);
