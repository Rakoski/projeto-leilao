import BaseService from "./BaseService";

class CategoriaService extends BaseService {
    constructor() {
        super("/categorias");
    }

    async buscarComFiltros(filtros = {}, page = 0, size = 10, sortBy = 'nome', sortDir = 'ASC') {
        const params = new URLSearchParams();
        
        // Adiciona filtros se existirem
        if (filtros.nome) params.append('nome', filtros.nome);
        
        // Paginação e ordenação
        params.append('page', page);
        params.append('size', size);
        params.append('sortBy', sortBy);
        params.append('sortDir', sortDir);
        
        const response = await this.api.get(`${this.endPoint}?${params.toString()}`);
        return response;
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

    // Método público (sem autenticação)
    async buscarPublicas() {
        const response = await fetch(`${this.api.defaults.baseURL}/leiloes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return { data };
    }
}

export default CategoriaService;
