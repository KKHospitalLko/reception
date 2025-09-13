import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BillPage from './pages/BillPage.jsx';
import ReceiptPage from './pages/ReceiptPage.jsx';
import RegistrationPage from './pages/Registration.jsx';
import PatientPreview from './pages/PatientPreview.jsx';
import NewReportPage from './pages/newReportPage.jsx';
import BedAllocationPage from './pages/BedAllocationPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ProtectedRoute from './pages/ProtectedRoute.jsx';
// import ReceiptPreview from "./pages/ReceiptPreview.jsx";
import ReceiptsList from "./pages/ReceiptsList.jsx";
import BillList from './pages/BillList.jsx';
import FilterPage from './pages/filter/FilterPage.jsx';

// import New from './pages/New.jsx';

createRoot(document.getElementById('root')).render(
  // <New />
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bill"
          element={
            <ProtectedRoute>
              <BillPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/filter"
          element={
            <ProtectedRoute>
              <FilterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/billList"
          element={
            <ProtectedRoute>
              <BillList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/receipt"
          element={
            <ProtectedRoute>
              <ReceiptPage />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/receipt/preview"
          element={
            <ProtectedRoute>
              <ReceiptPreview />
            </ProtectedRoute>
          } 
        /> */}
        <Route
          path="/receipts/list"
          element={
            <ProtectedRoute>
              <ReceiptsList />
            </ProtectedRoute>
          } 
        />       
        <Route
          path="/bedManagement"
          element={
            <ProtectedRoute>
              <BedAllocationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/registration"
          element={
            <ProtectedRoute>
              <RegistrationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/:id"
          element={
            <ProtectedRoute>
              <PatientPreview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/:id/new"
          element={
            <ProtectedRoute>
              <NewReportPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
);
