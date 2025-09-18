import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { PageDataProvider } from "./context/PageDataContext.tsx";
import { FoodDataProvider } from "./context/ResturentDataContext.tsx";
import { MenuBlockProvider } from "./context/MenuContext.tsx";
import { DataProvider } from "./context/DynamicContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <PageDataProvider>
        <FoodDataProvider>
          <MenuBlockProvider>
            <DataProvider>
              <AuthProvider>
                <App />
              </AuthProvider>
            </DataProvider>
          </MenuBlockProvider>
        </FoodDataProvider>
      </PageDataProvider>
    </BrowserRouter>
  </StrictMode>
);
