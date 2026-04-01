import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {ToastContainer} from "react-toastify";

import LoginPage from './pages/login/LoginPage';

import HomePage from "./pages/home/HomePage.tsx";
import ArticlePage from "./pages/article/ArticlePage.tsx";
import NewArticlePage from "./pages/article/NewArticlePage.tsx";
import ClientsPage from './pages/clients/ClientsPage';
import OpenCloseCashRegisterPage from './pages/cashRegister/OpenCloseCashRegisterPage.tsx';
import IngressCashRegisterPage from "./pages/cashRegister/IngressCashRegisterPage.tsx";
import EgressCashRegisterPage from "./pages/cashRegister/EgressCashRegisterPage.tsx";
import CashMovementsPage from "./pages/cashRegister/cashMovements/CashMovementsPage.tsx";

import BrandsPage from "./pages/admin/brands/BrandsPage.tsx";
import AdminClientsPage from "./pages/admin/clients/AdminClientsPage.tsx";
import EmployeesPage from "./pages/admin/employees/EmployeesPage.tsx";
import PaymentMethodsPage from "./pages/admin/paymentMethods/PaymentMethodsPage.tsx";

import Clock from './components/Clock/Clock';
import './App.css';

function App() {
  // 1. Definimos el estado. Le decimos a TypeScript que solo puede ser 'claro' o 'oscuro'.
  // Intentamos leer si el usuario ya tenía una preferencia guardada, si no, usamos 'claro'.
  const [tema, setTema] = useState<'claro' | 'oscuro'>(() => {
    // return (localStorage.getItem('temaApp') as 'claro' | 'oscuro') || 'claro';
    // return 'oscuro';
    return 'claro'
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema);
    localStorage.setItem('temaApp', tema);
  }, [tema]);

  const cambiarTema = () => {
    setTema(tema === 'claro' ? 'oscuro' : 'claro');
  };

  return (
    <Router>
      <div className="App">
        <Clock />
        <Routes>
          <Route path="/" element={<LoginPage/>} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/clientes" element={<ClientsPage />} />

          <Route path="/articulos" element={<ArticlePage />} />
          <Route path="/articulos/nuevo" element={<NewArticlePage />} />

          <Route path="/caja/abrir-cerrar" element={<OpenCloseCashRegisterPage />} />
          <Route path="/caja/ingreso" element={<IngressCashRegisterPage />} />
          <Route path="/caja/egreso" element={<EgressCashRegisterPage />} />
          <Route path="/caja" element={<CashMovementsPage />} />

          <Route path="/admin/marcas" element={<BrandsPage />} />
          <Route path="/admin/clientes" element={<AdminClientsPage />} />
          <Route path="/admin/empleados" element={<EmployeesPage />} />
          <Route path="/admin/medios-pago" element={<PaymentMethodsPage />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          draggable
          pauseOnHover
          theme={tema === 'claro' ? 'light' : 'dark'}
        />
      </div>
    </Router>
  );
}

export default App;