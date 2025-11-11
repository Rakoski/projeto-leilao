/**
 * Utilitários para formatação de dados e interface do usuário
 */

/**
 * Mapeia status de leilão para severidade do PrimeReact Tag
 * @param {string} status - Status do leilão
 * @returns {string} Severidade para o componente Tag
 */
export const getStatusSeverity = (status) => {
    const statusMap = {
        'ATIVO': 'success',
        'INATIVO': 'warning',
        'EM_ANALISE': 'info',
        'ENCERRADO': 'secondary',
        'CANCELADO': 'danger'
    };
    
    return statusMap[status] || 'secondary';
};

/**
 * Converte status do backend para texto exibível
 * @param {string} status - Status do backend
 * @returns {string} Texto formatado para exibição
 */
export const getStatusDisplayText = (status) => {
    const statusMap = {
        'EM_ANALISE': 'Em Análise',
        'ATIVO': 'Ativo',
        'INATIVO': 'Inativo',
        'ENCERRADO': 'Encerrado',
        'CANCELADO': 'Cancelado'
    };
    
    return statusMap[status] || status || 'Indefinido';
};

/**
 * Opções de status para dropdowns e filtros
 */
export const STATUS_OPTIONS = [
    { label: 'Todos', value: null },
    { label: 'Ativo', value: 'ATIVO' },
    { label: 'Inativo', value: 'INATIVO' },
    { label: 'Em Análise', value: 'EM_ANALISE' },
    { label: 'Encerrado', value: 'ENCERRADO' },
    { label: 'Cancelado', value: 'CANCELADO' }
];

/**
 * Verifica se um status permite abertura de leilão
 * @param {string} status - Status atual
 * @returns {boolean} Se permite abrir
 */
export const podeAbrirLeilao = (status) => {
    return ['INATIVO', 'EM_ANALISE'].includes(status);
};

/**
 * Verifica se um status permite encerramento de leilão
 * @param {string} status - Status atual
 * @returns {boolean} Se permite encerrar
 */
export const podeEncerrarLeilao = (status) => {
    return status === 'ATIVO';
};

/**
 * Verifica se um status permite cancelamento de leilão
 * @param {string} status - Status atual
 * @returns {boolean} Se permite cancelar
 */
export const podeCancelarLeilao = (status) => {
    return status === 'ATIVO';
};

/**
 * Gera opções para dropdown de categorias
 * @param {Array} categorias - Array de categorias
 * @returns {Array} Opções formatadas para dropdown
 */
export const gerarOpcoesCategoria = (categorias = []) => {
    const opcoes = [{ label: 'Todas as categorias', value: null }];
    
    if (Array.isArray(categorias)) {
        categorias.forEach(categoria => {
            opcoes.push({
                label: categoria.nome || 'Categoria sem nome',
                value: categoria.id
            });
        });
    }
    
    return opcoes;
};

/**
 * Extrai nome da categoria de um objeto leilão
 * @param {Object} leilao - Objeto leilão
 * @returns {string} Nome da categoria
 */
export const obterNomeCategoria = (leilao) => {
    return leilao?.categoriaNome || leilao?.categoria?.nome || 'N/A';
};

/**
 * Valida se um valor é uma data válida
 * @param {any} data - Valor a ser validado
 * @returns {boolean} Se é uma data válida
 */
export const isDataValida = (data) => {
    if (!data) return false;
    
    const dataObj = data instanceof Date ? data : new Date(data);
    return !isNaN(dataObj.getTime());
};

/**
 * Compara duas datas
 * @param {Date|string} data1 - Primeira data
 * @param {Date|string} data2 - Segunda data
 * @returns {number} -1 se data1 < data2, 0 se iguais, 1 se data1 > data2
 */
export const compararDatas = (data1, data2) => {
    if (!isDataValida(data1) || !isDataValida(data2)) {
        return 0;
    }
    
    const d1 = new Date(data1);
    const d2 = new Date(data2);
    
    if (d1 < d2) return -1;
    if (d1 > d2) return 1;
    return 0;
};

/**
 * Formata mensagens de erro para exibição
 * @param {Error|Object} error - Erro recebido
 * @param {string} mensagemPadrao - Mensagem padrão se não conseguir extrair do erro
 * @returns {string} Mensagem de erro formatada
 */
export const formatarMensagemErro = (error, mensagemPadrao = 'Erro inesperado') => {
    if (!error) return mensagemPadrao;
    
    // Se é uma string, retorna diretamente
    if (typeof error === 'string') return error;
    
    // Tenta extrair mensagem de erro do axios/api
    if (error.response?.data?.message) return error.response.data.message;
    if (error.response?.data?.error) return error.response.data.error;
    if (error.message) return error.message;
    
    return mensagemPadrao;
};

/**
 * Debounce function para evitar chamadas excessivas
 * @param {Function} func - Função a ser executada
 * @param {number} delay - Delay em millisegundos
 * @returns {Function} Função com debounce
 */
export const debounce = (func, delay) => {
    let timeoutId;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeoutId);
            func(...args);
        };
        
        clearTimeout(timeoutId);
        timeoutId = setTimeout(later, delay);
    };
};

/**
 * Gera um ID único
 * @returns {string} ID único
 */
export const gerarIdUnico = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
