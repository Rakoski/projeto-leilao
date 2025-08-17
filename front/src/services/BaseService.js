import api from "../configs/axiosConfig";

class BaseService {
    constructor(endPoint) {
        this.endPoint = endPoint;
        this.api = api;
    }

    async inserir(dados) {
        const resposta = await this.api.post(this.endPoint, dados);
        return resposta;
    }

    async alterar(dados) {
        const resposta = await this.api.put(this.endPoint, dados);
        return resposta;
    }

    async atualizar(id, dados) {
        const resposta = await this.api.put(`${this.endPoint}/${id}`, dados);
        return resposta;
    }

    async excluir(id) {
        const resposta = await this.api.delete(`${this.endPoint}/${id}`);
        return resposta;
    }

    async buscarTodos() {
        try {
            const resposta = await this.api.get(this.endPoint);
            return resposta;
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            throw error;
        }
    }

    async buscarPorId(id) {
        const resposta = await this.api.get(`${this.endPoint}/${id}`);
        return resposta;
    }
}

export default BaseService;