import BaseService from './BaseService';

class PessoaService extends BaseService {
    constructor() {
        super('/pessoa');
    }

    async buscarComFiltros(filtros = {}, page = 0, size = 10, sortBy = 'nome', sortDir = 'ASC') {
        const params = new URLSearchParams();
        
        // Adiciona filtros se existirem
        if (filtros.nome) params.append('nome', filtros.nome);
        if (filtros.email) params.append('email', filtros.email);
        if (filtros.ativo !== null && filtros.ativo !== undefined) {
            params.append('ativo', filtros.ativo);
        }
        
        // Paginação e ordenação
        params.append('page', page);
        params.append('size', size);
        params.append('sortBy', sortBy);
        params.append('sortDir', sortDir);
        
        const response = await this.api.get(`${this.endPoint}?${params.toString()}`);
        return response;
    }

    async buscarPerfil() {
        const response = await this.api.get(`${this.endPoint}/me`);
        return response;
    }

    async alterarSenha(senhaAtual, novaSenha) {
        const dados = {
            senhaAtual,
            novaSenha
        };
        const response = await this.api.post(`${this.endPoint}/alterar-senha`, dados);
        return response;
    }

    async recuperarSenha(email) {
        const dados = { email };
        const response = await this.api.post(`${this.endPoint}/recuperar-senha`, dados);
        return response;
    }

    async redefinirSenha(email, codigoValidacao, novaSenha) {
        const dados = {
            codigoValidacao,
            novaSenha
        };
        const response = await this.api.post(`${this.endPoint}/redefinir-senha?email=${email}`, dados);
        return response;
    }

    async adicionarPerfil(pessoaId, perfilId) {
        const response = await this.api.post(`/pessoa-perfil`, {
            pessoaId,
            perfilId
        });
        return response;
    }

    async removerPerfil(pessoaId, perfilId) {
        const response = await this.api.delete(`/pessoa-perfil/${pessoaId}/${perfilId}`);
        return response;
    }
}

export default PessoaService;
