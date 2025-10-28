import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />,
    },
    {
        path: '/profile',
        element: <ProfilePage />,
    },
]);

export function Router() {
    return <RouterProvider router={router} />;
}