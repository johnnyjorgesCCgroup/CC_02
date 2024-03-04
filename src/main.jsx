import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'; 
import '@fortawesome/fontawesome-free/css/all.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'admin-lte/dist/css/adminlte.min.css';
import 'admin-lte/plugins/fontawesome-free/css/all.min.css';
import 'admin-lte/plugins/overlayScrollbars/css/OverlayScrollbars.min.css';
import 'admin-lte/dist/js/adminlte.min.js';
import 'admin-lte/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js';

window.axios = axios;
window.axios.defaults.baseURL = axios;
window.axios.defaults.headers.common['Accept'] = 'application/json';
window.axios.defaults.headers.common['Content-type'] = 'application/json';
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.withCredentials = true;



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
