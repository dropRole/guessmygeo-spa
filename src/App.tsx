import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import Cookies from "universal-cookie";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { PageNotFound } from "./pages/PageNotFound";
import { PasswordReset } from "./pages/PasswordReset";
import { Profile } from "./pages/Profile";

function App() {
  const cookies: Cookies = new Cookies();

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/register"
            element={
              cookies.get("guessmygeo_token") ? (
                <Navigate to="/" />
              ) : (
                <Register />
              )
            }
          />
          <Route
            path="/login"
            element={
              cookies.get("guessmygeo_token") ? <Navigate to="/" /> : <Login />
            }
          />
          <Route path="/pass-reset" element={<PasswordReset />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
