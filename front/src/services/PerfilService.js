import BaseService from "./BaseService";

class PerfilService extends BaseService {
    constructor() {
        super("/perfil");
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
}

export default PerfilService;