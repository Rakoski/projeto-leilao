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
import Pessoas from './pages/pessoas/Pessoas';
import Perfis from './pages/perfis/Perfis';
import Feedbacks from './pages/feedbacks/Feedbacks';
import LeiloesPublicos from './pages/leiloes-publicos/LeiloesPublicos';
import LeilaoDetalhePublico from './pages/leilao-detalhe-publico/LeilaoDetalhePublico';

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
          {/* Rotas Públicas */}
          <Route path='/' element={<LeiloesPublicos />} />
          <Route path='/leiloes/:id' element={<LeilaoDetalhePublico />} />
          
          {/* Rotas Protegidas */}
          <Route element={<RotaPrivadaLayout/>}>
            <Route path='/admin' element={<PadraoLayout>
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
            <Route path='/pessoas' element={<PadraoLayout>
              <Pessoas />
            </PadraoLayout>} />
            <Route path='/perfis' element={<PadraoLayout>
              <Perfis />
            </PadraoLayout>} />
            <Route path='/feedbacks' element={<PadraoLayout>
              <Feedbacks />
            </PadraoLayout>} />
          </Route>          
          
          {/* Outras Rotas Públicas */}
          <Route path='/calculadora' Component={Calculadora} />
          <Route path='/cadastro' Component={Cadastro} />
          <Route path='/login' Component={() => <Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
