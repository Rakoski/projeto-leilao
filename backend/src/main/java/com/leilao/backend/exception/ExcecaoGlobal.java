package com.leilao.backend.exception;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import com.leilao.backend.dto.RespostaErro;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;

@RestControllerAdvice
public class ExcecaoGlobal {

    @ExceptionHandler(NaoEncontradoExcecao.class)
    public ResponseEntity<RespostaErro> naoEncontrado(NaoEncontradoExcecao ex, WebRequest request) {
        RespostaErro respostaErro = new RespostaErro(HttpStatus.NOT_FOUND.value(), "Não Encontrado",
                ex.getMessage(),
                request.getDescription(false), null);
        return new ResponseEntity<>(respostaErro, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(NegocioExcecao.class)
    public ResponseEntity<RespostaErro> negocio(NegocioExcecao ex, WebRequest request) {
        RespostaErro respostaErro = new RespostaErro(HttpStatus.UNPROCESSABLE_ENTITY.value(), "Erro de Negócio",
                ex.getMessage(),
                request.getDescription(false), null);
        return new ResponseEntity<>(respostaErro, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<RespostaErro> validacao(MethodArgumentNotValidException ex, WebRequest request) {
        List<String> erros = ex.getBindingResult().getFieldErrors().stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage()).collect(Collectors.toList());

        RespostaErro respostaErro = new RespostaErro(HttpStatus.BAD_REQUEST.value(), "Erro de Validação",
                "Campos Inválidos",
                request.getDescription(false), erros);

        return new ResponseEntity<>(respostaErro, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<RespostaErro> jwtExpirado(ExpiredJwtException ex, WebRequest request) {
        RespostaErro respostaErro = new RespostaErro(
                HttpStatus.UNAUTHORIZED.value(),
                "Token Expirado",
                "Seu token de autenticação expirou. Por favor, faça login novamente.",
                request.getDescription(false),
                null);
        return new ResponseEntity<>(respostaErro, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(SignatureException.class)
    public ResponseEntity<RespostaErro> jwtAssinaturaInvalida(SignatureException ex, WebRequest request) {
        RespostaErro respostaErro = new RespostaErro(
                HttpStatus.UNAUTHORIZED.value(),
                "Token Inválido",
                "Assinatura do token inválida.",
                request.getDescription(false),
                null);
        return new ResponseEntity<>(respostaErro, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(MalformedJwtException.class)
    public ResponseEntity<RespostaErro> jwtMalformado(MalformedJwtException ex, WebRequest request) {
        RespostaErro respostaErro = new RespostaErro(
                HttpStatus.UNAUTHORIZED.value(),
                "Token Inválido",
                "Token de autenticação malformado.",
                request.getDescription(false),
                null);
        return new ResponseEntity<>(respostaErro, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(JwtException.class)
    public ResponseEntity<RespostaErro> jwtGenerico(JwtException ex, WebRequest request) {
        RespostaErro respostaErro = new RespostaErro(
                HttpStatus.UNAUTHORIZED.value(),
                "Erro de Autenticação",
                "Token de autenticação inválido ou não fornecido.",
                request.getDescription(false),
                null);
        return new ResponseEntity<>(respostaErro, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<RespostaErro> credenciaisInvalidas(BadCredentialsException ex, WebRequest request) {
        RespostaErro respostaErro = new RespostaErro(
                HttpStatus.UNAUTHORIZED.value(),
                "Credenciais Inválidas",
                "Email ou senha incorretos.",
                request.getDescription(false),
                null);
        return new ResponseEntity<>(respostaErro, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<RespostaErro> autenticacao(AuthenticationException ex, WebRequest request) {
        RespostaErro respostaErro = new RespostaErro(
                HttpStatus.UNAUTHORIZED.value(),
                "Erro de Autenticação",
                "Falha na autenticação. Por favor, verifique suas credenciais.",
                request.getDescription(false),
                null);
        return new ResponseEntity<>(respostaErro, HttpStatus.UNAUTHORIZED);
    }

    // método global
    @ExceptionHandler(Exception.class)
    public ResponseEntity<RespostaErro> global(Exception ex, WebRequest request) {
        RespostaErro respostaErro = new RespostaErro(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Erro Interno",
                ex.getMessage(),
                request.getDescription(false), null);
        return new ResponseEntity<>(respostaErro, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
