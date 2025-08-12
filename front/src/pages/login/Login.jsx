import React from "react";
import './Login.css';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';

const Login = () =>{

    return (
        <div className="container">
            <label>Email</label>
            <InputText/>
            <label>Senha</label>
            <Password/>
            <br/>
            <Button label="Entrar"/>            
        </div>
    );
}
export default Login;