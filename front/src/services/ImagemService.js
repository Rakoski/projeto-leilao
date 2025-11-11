import BaseService from './BaseService';

class ImagemService extends BaseService {
    constructor() {
        super('/imagem');
    }

    async uploadImagem(leilaoId, arquivo) {
        const formData = new FormData();
        formData.append('arquivo', arquivo);
        
        const response = await this.api.post(`${this.endPoint}/leilao/${leilaoId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response;
    }

    async listarPorLeilao(leilaoId) {
        const response = await this.api.get(`${this.endPoint}/leilao/${leilaoId}`);
        return response;
    }

    async excluirImagem(id) {
        const response = await this.api.delete(`${this.endPoint}/${id}`);
        return response;
    }

    async definirImagemPrincipal(leilaoId, imagemId) {
        const response = await this.api.put(`${this.endPoint}/leilao/${leilaoId}/principal/${imagemId}`);
        return response;
    }
}

export default ImagemService;
