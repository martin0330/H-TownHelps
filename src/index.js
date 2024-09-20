import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Login from './pages/login';
import Registration from './pages/registration';
import UserProfile from './pages/user-profile';
import EventManage from './pages/event-manage';
import VolunteerMatch from './pages/volunteer-match';
import NotificationSys from './pages/notification-sys';
import VolunteerHist from './pages/volunteer-hist';
import NotFound from './pages/NotFound';
import { BrowserRouter, Routes, Route } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Login />} />
        <Route path="registration" element={<Registration />} />
        <Route path="userprofile" element={<UserProfile />} />
        <Route path="eventmanage" element={<EventManage />} />
        <Route path="volunteermatch" element={<VolunteerMatch />} />
        <Route path="notifications" element={<NotificationSys />} />
        <Route path="volunteerhist" element={<VolunteerHist />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
