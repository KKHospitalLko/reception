import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BillPage from './pages/bill.jsx';
import ReceiptPage from './pages/receipt.jsx';
import RegistrationPage from './pages/registration.jsx';
import PatientPage from './pages/patientPage.jsx';
import NewReportPage from './pages/newReportPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/bill" element={<BillPage />} />
        <Route path="/receipt" element={<ReceiptPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/patient/:id" element={<PatientPage />} />
        <Route path="/patient/:id/new" element={<NewReportPage />} />
      </Routes>
    </Router>
  </StrictMode>,
)
