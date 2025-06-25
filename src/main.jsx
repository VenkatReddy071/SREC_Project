import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CartProvider } from './Context/CartContext.jsx';
import './index.css'
import App from './App.jsx'
import {SocketContextProvider} from "./Context/Socket/SocketContext.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <SocketContextProvider>
        <App />
      </SocketContextProvider>
    </CartProvider>
        
  </StrictMode>
)
