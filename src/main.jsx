import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CartProvider } from './Context/CartContext.jsx';
import './index.css'
import App from './App.jsx'
import {SocketContextProvider} from "./Context/Socket/SocketContext.jsx"
import {UserProvider} from "./Context/UserContext";
import {DashboardSocketContextProvider} from "./Context/Socket/DashboardContext.jsx"
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <SocketContextProvider>
        <UserProvider>
          <DashboardSocketContextProvider>
            <App />
          </DashboardSocketContextProvider>
          
        </UserProvider>
        
      </SocketContextProvider>
    </CartProvider>
        
  </StrictMode>
)
