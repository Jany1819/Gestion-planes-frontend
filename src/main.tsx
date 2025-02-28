import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error("No se encontró el elemento con ID 'root'.");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);