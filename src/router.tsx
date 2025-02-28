import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '@/pages/Login';
import LagoutPage from '@/pages/LagoutPage';
import CrearPlan from '@/pages/lagout/CrearPlan';
import PlanEvaluacion from '@/pages/lagout/PlanEvaluacion';
import PlanAprendizaje from '@/pages/lagout/PlanAprendizaje';
import ListarPlanes from '@/pages/lagout/ListarPlanes';
import ModificarPlan from '@/pages/lagout/ModificarPlan';
import ProtectedRoute from '@/components/ProtectedRoute';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" />, 
  },
  {
    path: '/login',
    element: <Login />, 
  },
  {
    path: '/lagout',
    element: (
      <ProtectedRoute>
        <LagoutPage /> {/* Protege la ruta del dashboard */}
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="listar-planes" />, 
      },
      {
        path: 'crear-plan',
        element: <CrearPlan />, 
      },
      {
        path: 'crear-plan/evaluacion',
        element: <PlanEvaluacion />, 
      },
      {
        path: 'crear-plan/aprendizaje',
        element: <PlanAprendizaje />, 
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