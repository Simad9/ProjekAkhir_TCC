import { AuthProvider } from "./auth/AuthProvider";
import Router from "./routes/RouterApp"; // halaman-halaman
import AxiosInterceptor from "./api/AxiosInterceptor";
import "./css/index.css";

function App() {
  return (
    <AuthProvider>
      <AxiosInterceptor>
        <Router />
      </AxiosInterceptor>
    </AuthProvider>
  )
}

export default App
