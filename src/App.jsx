import Login from "./pages/Login";
import Register from "./pages/Register";
import EmergencyProviders from "./pages/EmergencyProviders";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Providers from "./pages/Providers";
import ProviderDetails from "./pages/ProviderDetails";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/providers" element={<Providers />} />
        <Route
  path="/emergency"
  element={<EmergencyProviders />}
/>
       <Route path="/providers/:id" element={<ProviderDetails />} />
       <Route path="/register" element={<Register />} />
       <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;