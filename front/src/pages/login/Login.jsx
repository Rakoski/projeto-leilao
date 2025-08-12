import React, { useState } from "react";
import './Login.css';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import AutenticacaoService from "../../services/AutenticacaoService";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const autenticacaoService = new AutenticacaoService();
    const [usuario, setUsuario] = useState({ email: '', senha: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUsuario({ ...usuario, [e.target.name]: e.target.value });
    }

    const login = async () => {
        try {
            const resposta = await autenticacaoService.login(usuario);
            console.log(resposta.data);
            if (resposta.status === 200 && resposta.data.token) {
                localStorage.setItem("usuario", JSON.stringify(resposta.data));
                navigate("/");
            } else {
                alert("Erro ao fazer login");
            }
        } catch (error) {
            console.log(error);
            alert(error.response.data.mensagem);
        }
    }

    return (
        <div className="container">
            <label>Email</label>
            <InputText value={usuario.email} name="email" onChange={handleChange} />
            <label>Senha</label>
            <Password value={usuario.senha} name="senha" onChange={handleChange} />
            <br />
            <Button label="Entrar" onClick={login} />
        </div>
    );
}
export default Login;