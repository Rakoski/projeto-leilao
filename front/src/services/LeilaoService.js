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



    async buscarTodos() {
        const resposta = await this.api.get(this.endPoint);
        return resposta; // Retorna resposta original
    }

    async buscarComFiltros(filtros = {}) {
        const params = new URLSearchParams();
        
        // Adiciona apenas os filtros que têm valor
        Object.keys(filtros).forEach(key => {
            const value = filtros[key];
            if (value !== null && value !== undefined && value !== '') {
                if (value instanceof Date) {
                    params.append(key, value.toISOString());
                } else {
                    params.append(key, value);
                }
            }
        });

        const queryString = params.toString();
        const url = queryString ? `${this.endPoint}/filtros?${queryString}` : this.endPoint;
        const resposta = await this.api.get(url);
        return resposta; // Retorna resposta original sem processamento
    }

    // Métodos públicos (sem autenticação)
    async buscarPublicos(filtros = {}) {
        const params = new URLSearchParams();
        
        // Adiciona apenas os filtros que têm valor
        Object.keys(filtros).forEach(key => {
            const value = filtros[key];
            if (value !== null && value !== undefined && value !== '') {
                if (value instanceof Date) {
                    params.append(key, value.toISOString());
                } else {
                    params.append(key, value);
                }
            }
        });

        const queryString = params.toString();
        
        // Faz a requisição sem o cabeçalho de autorização
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

    async buscarPublicoPorId(id) {
        const response = await fetch(`${this.api.defaults.baseURL}${this.endPoint}/publicos/${id}`, {
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

export default LeilaoService;
