import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RiderForm from './components/RiderForm';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RiderForm />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
