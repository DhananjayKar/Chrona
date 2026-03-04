import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Calendar from "./pages/Calendar";
import { Toaster } from "react-hot-toast";
import Auth from "./pages/Auth";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { user } = useAuth();
  console.log( user );
  return (
    <BrowserRouter>
      <AppLayout>
         <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#ebeefa",
              color: "#000",
              borderRadius: "16px",
              padding: "12px 16px",
            },
            success: {
              iconTheme: {
                primary: "green",
                secondary: "white",
              },
            },
          }}
        />
        <Header />
        <Routes>
          <Route path="/" element={user ? <Home /> : <Navigate to="/auth" />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" />} />
        </Routes>
        <Footer />
      </AppLayout>
    </BrowserRouter>
  );
}
