import './App.css';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './contexts/AuthContext';
import Calculadora from './pages/calculadora/Calculadora';
import Home from './pages/home/Home';
import Cadastro from './pages/tarefa/Cadastro';
import Login from './pages/login/Login';
import RotaPrivadaLayout from './components/layout/RotaPrivadaLayout';
import PadraoLayout from './components/layout/PadraoLayout';
import Perfil from './pages/perfil/Perfil';
import Leiloes from './pages/leiloes/Leiloes';
import Categorias from './pages/categorias/Categorias';

function App() {
  return (
    <AuthProvider>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      
      <BrowserRouter>
        <Routes>
          {/* Rotas Protegidas */}
          <Route element={<RotaPrivadaLayout/>}>
            <Route path='/' element={<PadraoLayout>
              <Home/>
            </PadraoLayout>} />
            <Route path='/perfil' element={<PadraoLayout>
              <Perfil />
            </PadraoLayout>} />
            <Route path='/leiloes' element={<PadraoLayout>
              <Leiloes />
            </PadraoLayout>} />
            <Route path='/categorias' element={<PadraoLayout>
              <Categorias />
            </PadraoLayout>} />
          </Route>          
          
          {/* Rotas Públicas */}
          <Route path='/calculadora' Component={Calculadora} />
          <Route path='/cadastro' Component={Cadastro} />
          <Route path='/login' Component={() => <Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
