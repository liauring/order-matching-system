import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Home from './pages/Home';
import { StatusProvider } from './global/useStatus'

ReactDOM.render(

  // <React.StrictMode>
  <StatusProvider>
    <Home />
  </StatusProvider>
  // </React.StrictMode>
  ,
  document.getElementById('root')
);