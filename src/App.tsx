import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { PageNotFound } from "./pages/PageNotFound";
import { PasswordReset } from "./pages/PasswordReset";
import { Profile } from "./pages/Profile";
import { LocationGuess } from "./pages/LocationGuess";
import { AdminPanel } from "./pages/AdminPanel";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/location-guess" element={<LocationGuess />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pass-reset" element={<PasswordReset />} />
          <Route path="/panel" element={<AdminPanel />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
