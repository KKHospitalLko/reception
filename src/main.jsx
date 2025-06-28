import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BillPage from './forms/bill.jsx';
import ReceiptPage from './forms/receipt.jsx';
import RegistrationPage from './forms/registration.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/bill" element={<BillPage />} />
        <Route path="/receipt" element={<ReceiptPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
      </Routes>
    </Router>
  </StrictMode>,
)
