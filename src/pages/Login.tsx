import React, { useState } from 'react';
import { Input } from '../components/ui/Input'; 
import { Button } from '../components/ui/button'; 

const Login: React.FC = () => {
  const [cedula, setCedula] = useState(''); 
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Cédula:', cedula); // Lógica de autenticación
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#2c2c2c' }}> 

      {/* Barra superior */}
      <div
        className="w-full py-4 px-6 flex items-center justify-between"
        style={{
          backgroundColor: '#050A30',
        }}
      >
        <div className="flex items-center">
          {/* Logo */}
          <img
            src="/src/assets/Logo-unexca.png" 
            alt="Logo"
            className="w-10 h-10 mr-3"
            />
        </div>
      </div>

      {/* Formulario de login */}
      <div className="flex-grow flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-md p-8 rounded-lg w-full max-w-md"
          style={{
            boxShadow: '0 0 20px 5px #050a30',
          }}
        >
          <h2 className="text-white text-2xl font-bold mb-6 text-center">Inicia Sesión</h2>
          <div className="mb-6">
            <Input
              type="text"
              placeholder="V-16708924"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              className="w-full p-3 rounded-md bg-white/20  placeholder-white"
              style={{
                border: '1px solid #050A30', 
              }}
            />

          </div>
          <Button
            type="submit"
            className="w-full py-3 text-sm font-bold rounded-md transition-colors"
            style={{
              backgroundColor: '#ececec', 
              color: '#8b8383', 
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#050A30'; 
              e.currentTarget.style.color = '#ececec'; 
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#ececec'; 
              e.currentTarget.style.color = '#8b8383'; 
            }}
          >
            Acceder
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;