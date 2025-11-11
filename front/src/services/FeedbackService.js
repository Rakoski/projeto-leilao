import BaseService from './BaseService';

class FeedbackService extends BaseService {
    constructor() {
        super('/feedback');
    }

    async criarFeedback(dados) {
        const response = await this.api.post(this.endPoint, dados);
        return response;
    }

    async buscarPorLeilao(leilaoId) {
        const response = await this.api.get(`${this.endPoint}/leilao/${leilaoId}`);
        return response;
    }

    async buscarPorPessoa(pessoaId, page = 0, size = 10) {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('size', size);
        
        const response = await this.api.get(`${this.endPoint}/pessoa/${pessoaId}?${params.toString()}`);
        return response;
    }

    async podeAvaliar(leilaoId) {
        const response = await this.api.get(`${this.endPoint}/pode-avaliar/${leilaoId}`);
        return response;
    }
}

export default FeedbackService;
