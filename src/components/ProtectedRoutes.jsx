import { Routes, Route } from 'react-router-dom';
import IndexTicket from '../views/Ticket/index';
import IndexHooks from '../views/Hooks/index';
import IndexInventory from '../views/Inventory/index';
import IndexDashboard from '../views/Dashboard/index';

const ProtectedRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<IndexTicket />} />
      <Route path="/ticket" element={<IndexTicket />} />
      <Route path="/hooks" element={<IndexHooks />} />
      <Route path="/inventory" element={<IndexInventory />} />
      <Route path="/dashboard" element={<IndexDashboard />} />
    </Routes>
  );
};

export default ProtectedRoutes;
