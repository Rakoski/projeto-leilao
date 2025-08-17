import BaseService from "./BaseService";

class LeilaoService extends BaseService {
    constructor() {
        super("/leiloes");
    }

    async buscarPorId(id) {
        const resposta = await this.api.get(`${this.endPoint}/${id}`);
        return resposta;
    }

    async buscarPorStatus(status) {
        const resposta = await this.api.get(`${this.endPoint}/status/${status}`);
        return resposta;
    }

    async buscarPorCategoria(categoriaId) {
        const resposta = await this.api.get(`${this.endPoint}/categoria/${categoriaId}`);
        return resposta;
    }

    async buscarPorTitulo(titulo) {
        const resposta = await this.api.get(`${this.endPoint}/buscar?titulo=${titulo}`);
        return resposta;
    }

    async buscarMeusLeiloes() {
        const resposta = await this.api.get(`${this.endPoint}/meus`);
        return resposta;
    }

    async abrirLeilao(id) {
        const resposta = await this.api.put(`${this.endPoint}/${id}/abrir`);
        return resposta;
    }

    async encerrarLeilao(id) {
        const resposta = await this.api.put(`${this.endPoint}/${id}/encerrar`);
        return resposta;
    }

    async cancelarLeilao(id) {
        const resposta = await this.api.put(`${this.endPoint}/${id}/cancelar`);
        return resposta;
    }

    async atualizar(id, dados) {
        const resposta = await this.api.put(`${this.endPoint}/${id}`, dados);
        return resposta;
    }
}

export default LeilaoService;
