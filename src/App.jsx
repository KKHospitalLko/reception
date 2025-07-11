import React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
export default function App() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <h1>Welcome to the App</h1>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
      <Button variant="outlined" component={Link} to="/bill">Bill</Button>
      <Button variant="outlined" component={Link} to="/receipt">Receipt</Button>
      <Button variant="outlined" component={Link} to="/registration">Registration</Button>
      <Button variant="outlined" component={Link} to="/bedManagement">Bed Allotment</Button>
    </div>
  </div>
  );
}
