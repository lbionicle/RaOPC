import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import CoordinatorEventsPage from './pages/CoordinatorEventsPage.jsx';
import CoordinatorEventDetailsPage from './pages/CoordinatorEventDetailsPage.jsx';
import AttendeeInvitePage from './pages/AttendeeInvitePage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import AdminUsersPage from './pages/AdminUsersPage.jsx';
import AdminUserDetailsPage from './pages/AdminUserDetailsPage.jsx';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path='/' element={<HomePage />} />

        <Route path='/coordinator/events' element={<CoordinatorEventsPage />} />
        <Route
          path='/coordinator/events/new'
          element={<CoordinatorEventDetailsPage />}
        />
        <Route
          path='/coordinator/events/:id'
          element={<CoordinatorEventDetailsPage />}
        />

        <Route
          path='/attendee/invite/:eventId'
          element={<AttendeeInvitePage />}
        />

        <Route path='/admin' element={<AdminDashboardPage />} />
        <Route path='/admin/users' element={<AdminUsersPage />} />
        <Route path='/admin/users/:userId' element={<AdminUserDetailsPage />} />

        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </Layout>
  );
}
