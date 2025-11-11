/**
 * Utilitários para manipulação de dados de API e arrays
 */

/**
 * Processa resposta da API que pode vir em formato paginado (Spring Data)
 * @param {Object} response - Resposta da API
 * @returns {Object} Objeto com dados processados
 */
export const processarRespostaPaginada = (response) => {
    if (!response || !response.data) {
        return {
            data: [],
            totalElements: 0,
            totalPages: 0,
            currentPage: 0,
            pageSize: 10
        };
    }

    // Verifica se é formato paginado do Spring Data
    if (response.data.content && Array.isArray(response.data.content)) {
        return {
            data: response.data.content,
            totalElements: response.data.totalElements || response.data.content.length,
            totalPages: response.data.totalPages || 1,
            currentPage: response.data.number || 0,
            pageSize: response.data.size || response.data.content.length
        };
    }

    // Se é array simples
    if (Array.isArray(response.data)) {
        return {
            data: response.data,
            totalElements: response.data.length,
            totalPages: 1,
            currentPage: 0,
            pageSize: response.data.length
        };
    }

    // Fallback
    return {
        data: [],
        totalElements: 0,
        totalPages: 0,
        currentPage: 0,
        pageSize: 10
    };
};

/**
 * Garante que um valor seja sempre um array
 * @param {any} valor - Valor a ser verificado
 * @returns {Array} Array seguro
 */
export const garantirArray = (valor) => {
    if (Array.isArray(valor)) return valor;
    if (valor === null || valor === undefined) return [];
    return [valor];
};

/**
 * Remove itens duplicados de um array baseado em uma chave
 * @param {Array} array - Array original
 * @param {string} chave - Chave para comparação
 * @returns {Array} Array sem duplicatas
 */
export const removerDuplicatas = (array, chave) => {
    if (!Array.isArray(array)) return [];
    
    const seen = new Set();
    return array.filter(item => {
        const valor = chave ? item[chave] : item;
        if (seen.has(valor)) {
            return false;
        }
        seen.add(valor);
        return true;
    });
};

/**
 * Ordena array por múltiplos critérios
 * @param {Array} array - Array a ser ordenado
 * @param {Array} criterios - Array de critérios de ordenação
 * @returns {Array} Array ordenado
 */
export const ordenarPorMultiplosCriterios = (array, criterios) => {
    if (!Array.isArray(array) || !Array.isArray(criterios)) return array;
    
    return [...array].sort((a, b) => {
        for (const criterio of criterios) {
            const { campo, direcao = 'asc' } = criterio;
            let valorA = a[campo];
            let valorB = b[campo];
            
            // Tratamento para valores nulos/undefined
            if (valorA == null && valorB == null) continue;
            if (valorA == null) return direcao === 'asc' ? 1 : -1;
            if (valorB == null) return direcao === 'asc' ? -1 : 1;
            
            // Tratamento para datas
            if (valorA instanceof Date || valorB instanceof Date) {
                valorA = new Date(valorA);
                valorB = new Date(valorB);
            }
            
            // Tratamento para strings (case insensitive)
            if (typeof valorA === 'string' && typeof valorB === 'string') {
                valorA = valorA.toLowerCase();
                valorB = valorB.toLowerCase();
            }
            
            if (valorA < valorB) return direcao === 'asc' ? -1 : 1;
            if (valorA > valorB) return direcao === 'asc' ? 1 : -1;
        }
        return 0;
    });
};

/**
 * Filtra array por múltiplos critérios
 * @param {Array} array - Array a ser filtrado
 * @param {Object} filtros - Objeto com filtros
 * @returns {Array} Array filtrado
 */
export const filtrarPorCriterios = (array, filtros) => {
    if (!Array.isArray(array) || !filtros || typeof filtros !== 'object') {
        return array;
    }
    
    return array.filter(item => {
        return Object.entries(filtros).every(([chave, valor]) => {
            // Ignora filtros vazios
            if (valor === null || valor === undefined || valor === '') return true;
            
            const valorItem = item[chave];
            
            // Tratamento para strings (busca parcial, case insensitive)
            if (typeof valor === 'string' && typeof valorItem === 'string') {
                return valorItem.toLowerCase().includes(valor.toLowerCase());
            }
            
            // Tratamento para arrays (se o valor está contido no array)
            if (Array.isArray(valorItem)) {
                return valorItem.includes(valor);
            }
            
            // Tratamento para objetos (comparação por ID ou valor)
            if (typeof valorItem === 'object' && valorItem !== null) {
                return valorItem.id === valor || valorItem.value === valor;
            }
            
            // Comparação direta
            return valorItem === valor;
        });
    });
};

/**
 * Agrupa array por uma chave específica
 * @param {Array} array - Array a ser agrupado
 * @param {string|Function} chave - Chave ou função para agrupamento
 * @returns {Object} Objeto com itens agrupados
 */
export const agruparPor = (array, chave) => {
    if (!Array.isArray(array)) return {};
    
    return array.reduce((grupos, item) => {
        const valorChave = typeof chave === 'function' ? chave(item) : item[chave];
        const chaveGrupo = valorChave || 'undefined';
        
        if (!grupos[chaveGrupo]) {
            grupos[chaveGrupo] = [];
        }
        
        grupos[chaveGrupo].push(item);
        return grupos;
    }, {});
};

/**
 * Calcula estatísticas básicas de um array numérico
 * @param {Array} array - Array de números
 * @param {string} campo - Campo numérico (opcional)
 * @returns {Object} Estatísticas calculadas
 */
export const calcularEstatisticas = (array, campo = null) => {
    if (!Array.isArray(array) || array.length === 0) {
        return {
            total: 0,
            minimo: 0,
            maximo: 0,
            media: 0,
            soma: 0
        };
    }
    
    const valores = campo 
        ? array.map(item => item[campo]).filter(val => typeof val === 'number' && !isNaN(val))
        : array.filter(val => typeof val === 'number' && !isNaN(val));
    
    if (valores.length === 0) {
        return {
            total: 0,
            minimo: 0,
            maximo: 0,
            media: 0,
            soma: 0
        };
    }
    
    const soma = valores.reduce((acc, val) => acc + val, 0);
    
    return {
        total: valores.length,
        minimo: Math.min(...valores),
        maximo: Math.max(...valores),
        media: soma / valores.length,
        soma: soma
    };
};

/**
 * Pagina um array manualmente
 * @param {Array} array - Array a ser paginado
 * @param {number} pagina - Página atual (0-indexed)
 * @param {number} tamanho - Tamanho da página
 * @returns {Object} Resultado da paginação
 */
export const paginarArray = (array, pagina = 0, tamanho = 10) => {
    if (!Array.isArray(array)) {
        return {
            data: [],
            totalElements: 0,
            totalPages: 0,
            currentPage: 0,
            pageSize: tamanho
        };
    }
    
    const inicio = pagina * tamanho;
    const fim = inicio + tamanho;
    const data = array.slice(inicio, fim);
    
    return {
        data: data,
        totalElements: array.length,
        totalPages: Math.ceil(array.length / tamanho),
        currentPage: pagina,
        pageSize: tamanho
    };
};
