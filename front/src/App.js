import './App.css';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import Calculadora from './pages/calculadora/Calculadora';
import Home from './pages/home/Home';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Cadastro from './pages/tarefa/Cadastro';
import Login from './pages/login/Login';
import RotaPrivadaLayout from './components/layout/RotaPrivadaLayout';
import PadraoLayout from './components/layout/PadraoLayout';
import Perfil from './pages/perfil/Perfil';

function App() {
  return (
    <>
     {/*  <Header nome="Frank" /> */}
      <BrowserRouter>
        <Routes>
          <Route element={<RotaPrivadaLayout/>}>
            <Route path='/' element={<PadraoLayout>
              <Home/>
            </PadraoLayout>} />
            <Route path='/perfil' element={<PadraoLayout>
              <Perfil />
            </PadraoLayout>} />
          </Route>          
          
          <Route path='/calculadora' Component={Calculadora} />
          <Route path='/cadastro' Component={Cadastro} />
          <Route path='/login' Component={() => <Login />} />
        </Routes>
      </BrowserRouter>
      {/* <Footer /> */}
    </>
  );
}

export default App;
