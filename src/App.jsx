import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./assets/component/Home";
import Login from "./assets/component/auth/Login";
import Final from "./assets/component/Final";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Final" element={<Final />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
