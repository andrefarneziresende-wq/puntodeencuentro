import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage, RecoverPasswordPage, CheckEmailPage, NewPasswordPage } from '../pages/auth';
import { 
  HomePage, 
  TestimoniesPage, 
  TestimonyDetailPage, 
  NewTestimonyPage,
  GroupsPage,
  MembersPage,
  MinistriesPage,
  WithdrawalsPage
} from '../pages/dashboard';
import { ProtectedRoute } from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/recuperar-contrasena',
    element: <RecoverPasswordPage />,
  },
  {
    path: '/recuperar-contrasena/revisar-email',
    element: <CheckEmailPage />,
  },
  {
    path: '/nueva-contrasena',
    element: <NewPasswordPage />,
  },
  // Dashboard routes
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/testimonios',
    element: (
      <ProtectedRoute>
        <TestimoniesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/testimonio/:id',
    element: (
      <ProtectedRoute>
        <TestimonyDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/nuevo-testimonio',
    element: (
      <ProtectedRoute>
        <NewTestimonyPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/grupos',
    element: (
      <ProtectedRoute>
        <GroupsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/integrantes',
    element: (
      <ProtectedRoute>
        <MembersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/ministerios',
    element: (
      <ProtectedRoute>
        <MinistriesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/bajas',
    element: (
      <ProtectedRoute>
        <WithdrawalsPage />
      </ProtectedRoute>
    ),
  },
]);
