import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';

import Overview from './pages/dashboard/Overview';
import ResumeUpload from './pages/dashboard/ResumeUpload';
import InterviewHistory from './pages/dashboard/InterviewHistory';
import Profile from './pages/dashboard/Profile';

import InterviewSetup from './pages/interview/InterviewSetup';
import MockInterview from './pages/interview/MockInterview';
import InterviewResult from './pages/interview/InterviewResult';

import NotFound from './pages/NotFound';

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#111827',
            color: '#F8FAFC',
            border: '1px solid rgba(148, 163, 184, 0.12)',
          },
        }}
      />

      <Routes>
        {/* Public site */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Authenticated app */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Overview />} />
            <Route path="/dashboard/resume" element={<ResumeUpload />} />
            <Route path="/dashboard/history" element={<InterviewHistory />} />
            <Route path="/dashboard/profile" element={<Profile />} />
            <Route path="/dashboard/interview/setup" element={<InterviewSetup />} />
            <Route path="/dashboard/interview/session/:id" element={<MockInterview />} />
            <Route path="/dashboard/interview/result" element={<InterviewResult />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
