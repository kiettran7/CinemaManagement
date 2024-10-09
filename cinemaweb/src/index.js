import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "@fontsource/be-vietnam-pro"; // Defaults to weight 400
import "@fontsource/be-vietnam-pro/400.css"; // Specify weight
import "@fontsource/be-vietnam-pro/400-italic.css"; // Specify weight italic
import { MovieContextProvider } from './Context/MovieContext';
import { BuyTicketContextProvider } from './Context/BuyTicketContext';
import { LayoutContextProvider } from './Context/LayoutContext';
import { AuthContextProvider } from './Context/AuthContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <LayoutContextProvider>
      <AuthContextProvider>
        <MovieContextProvider>
          <BuyTicketContextProvider>
              <App />
          </BuyTicketContextProvider>
        </MovieContextProvider>
      </AuthContextProvider>
      </LayoutContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
