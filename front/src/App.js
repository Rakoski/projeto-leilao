import './App.css';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import Calculadora from './pages/calculadora/Calculadora';
import Home from './pages/home/Home';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Cadastro from './pages/tarefa/Cadastro';
import Login from './pages/login/Login';

function App() {
  return (
    <>
      <Header nome="Frank" />
      <BrowserRouter>
        <Routes>
          <Route path='/' Component={() => <Home />} />
          <Route path='/calculadora' Component={Calculadora} />
          <Route path='/cadastro' Component={Cadastro} />
          <Route path='/login' Component={() => <Login />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  );
}

export default App;
