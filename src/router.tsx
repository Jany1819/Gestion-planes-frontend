import { createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import DashboardPage from './pages/DashboardPage';
import Home from './pages/dashboard/Home'; 
import CrearPlan from './pages/dashboard/CrearPlan';
import ListarPlanes from './pages/dashboard/ListarPlanes';
import ModificarPlan from './pages/dashboard/ModificarPlan';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
    children: [
      {
        path: 'home', 
        element: <Home />,
      },
      {
        path: 'crear-plan',
        element: <CrearPlan />,
      },
      {
        path: 'listar-planes',
        element: <ListarPlanes />,
      },
      {
        path: 'modificar-plan',
        element: <ModificarPlan />,
      },
    ],
  },
]);

export default router;