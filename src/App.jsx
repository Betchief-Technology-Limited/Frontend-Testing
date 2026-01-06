import ApiKeys from "./ApiKeys";
import { Routes, Route } from "react-router-dom"
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
import CheckEmailForVerification from "./pages/CheckEmail";
import UserVerification from "./pages/UserVerification";

function App(){
  return(
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/check-email" element={<CheckEmailForVerification />} />
      <Route path="user-verification" element={<UserVerification />} />
      <Route path="/api-keys" element={<ApiKeys />} />
    </Routes>
  )
}

export default App