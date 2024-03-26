import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import App from './views/App.tsx';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<div>Hello world from sign up</div>} />
        <Route path="/signin" element={<div>Hello world from sign in</div>} />
        <Route path="/">
          <Route path="devices/">
            <Route path="notify" element={<div>Set Notify for device here</div>} />
            <Route path="script" element={<div>Set Script for device here</div>} />
            <Route index element={<div>Control device manually here</div>} />
          </Route>
          <Route path="setting" element={<div>Setting system here</div>} />
          <Route path="user/">
              <Route path="manage" element={<div>Manage User</div>} />
              <Route path="create" element={<div>Create User</div>} />
              <Route index element={<div>User info</div>} />
          </Route>
          <Route path="guide" element={<div>Guide</div>} />
          <Route index element={"dashboard"} />
        </Route>

      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
