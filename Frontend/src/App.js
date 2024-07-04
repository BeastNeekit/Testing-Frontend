
import AllRoutes from "./Components/AllRoutes";
import Navbar from "./Components/Navbar";
import "./App.css";
import "./index.css";
import { AuthProvider } from './Components/AuthContext';



function App() {
  return (
      <div>
      <Navbar />

      <AuthProvider>

      <AllRoutes />
      </AuthProvider>
      </div>
  );
}

export default App;
