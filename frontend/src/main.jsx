// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { FlowerProvider } from "./contexts/FlowerContext.jsx";
import { CartProvider } from "./contexts/CartContext.jsx";
import { OrderProvider } from "./contexts/OrderContext.jsx";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <BrowserRouter>
    <AuthProvider>
      <FlowerProvider>
        <CartProvider>
          <OrderProvider>
            <App />
          </OrderProvider>
        </CartProvider>
      </FlowerProvider>
    </AuthProvider>
    ,
  </BrowserRouter>,
  // </StrictMode>
);
