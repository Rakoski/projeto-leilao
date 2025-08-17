import BaseService from "./BaseService";

class CategoriaService extends BaseService {
    constructor() {
        super("/categorias");
    }

    async buscarPorId(id) {
        const resposta = await this.api.get(`${this.endPoint}/${id}`);
        return resposta;
    }

    async buscarPorNome(nome) {
        const resposta = await this.api.get(`${this.endPoint}/buscar?nome=${nome}`);
        return resposta;
    }

    async buscarMinhasCategorias() {
        const resposta = await this.api.get(`${this.endPoint}/minhas`);
        return resposta;
    }

    async atualizar(id, dados) {
        const resposta = await this.api.put(`${this.endPoint}/${id}`, dados);
        return resposta;
    }
}

export default CategoriaService;
