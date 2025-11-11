/**
 * Utilitários para formatação de strings
 */

/**
 * Formata um valor monetário para o padrão brasileiro
 * @param {number} valor - Valor a ser formatado
 * @param {string} currency - Moeda (padrão: BRL)
 * @param {string} locale - Locale (padrão: pt-BR)
 * @returns {string} Valor formatado como moeda
 */
export const formatarMoeda = (valor, currency = 'BRL', locale = 'pt-BR') => {
    if (valor === null || valor === undefined || isNaN(valor)) {
        return 'R$ 0,00';
    }
    
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
    }).format(valor);
};

/**
 * Formata uma data para o padrão brasileiro
 * @param {string|Date} data - Data a ser formatada
 * @param {Object} options - Opções de formatação
 * @returns {string} Data formatada
 */
export const formatarData = (data, options = {}) => {
    if (!data) return '-';
    
    const defaultOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'America/Sao_Paulo',
        ...options
    };
    
    try {
        const dataObj = typeof data === 'string' ? new Date(data) : data;
        return dataObj.toLocaleDateString('pt-BR', defaultOptions);
    } catch (error) {
        console.error('Erro ao formatar data:', error);
        return '-';
    }
};

/**
 * Formata uma data e hora para o padrão brasileiro
 * @param {string|Date} data - Data a ser formatada
 * @returns {string} Data e hora formatadas
 */
export const formatarDataHora = (data) => {
    if (!data) return '-';
    
    try {
        const dataObj = typeof data === 'string' ? new Date(data) : data;
        return dataObj.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'America/Sao_Paulo'
        });
    } catch (error) {
        console.error('Erro ao formatar data e hora:', error);
        return '-';
    }
};

/**
 * Trunca um texto e adiciona reticências se necessário
 * @param {string} texto - Texto a ser truncado
 * @param {number} limite - Limite de caracteres
 * @returns {string} Texto truncado
 */
export const truncarTexto = (texto, limite = 50) => {
    if (!texto || typeof texto !== 'string') return '';
    
    if (texto.length <= limite) return texto;
    
    return texto.substring(0, limite).trim() + '...';
};

/**
 * Capitaliza a primeira letra de cada palavra
 * @param {string} texto - Texto a ser capitalizado
 * @returns {string} Texto capitalizado
 */
export const capitalizarTexto = (texto) => {
    if (!texto || typeof texto !== 'string') return '';
    
    return texto
        .toLowerCase()
        .split(' ')
        .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
        .join(' ');
};

/**
 * Remove acentos de um texto
 * @param {string} texto - Texto a ser processado
 * @returns {string} Texto sem acentos
 */
export const removerAcentos = (texto) => {
    if (!texto || typeof texto !== 'string') return '';
    
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

/**
 * Formata um número de telefone brasileiro
 * @param {string} telefone - Número de telefone
 * @returns {string} Telefone formatado
 */
export const formatarTelefone = (telefone) => {
    if (!telefone) return '';
    
    const numeroLimpo = telefone.replace(/\D/g, '');
    
    if (numeroLimpo.length === 11) {
        return numeroLimpo.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (numeroLimpo.length === 10) {
        return numeroLimpo.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    
    return telefone;
};

/**
 * Formata um CPF
 * @param {string} cpf - CPF a ser formatado
 * @returns {string} CPF formatado
 */
export const formatarCPF = (cpf) => {
    if (!cpf) return '';
    
    const numeroLimpo = cpf.replace(/\D/g, '');
    
    if (numeroLimpo.length === 11) {
        return numeroLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    
    return cpf;
};

/**
 * Gera iniciais a partir de um nome
 * @param {string} nome - Nome completo
 * @param {number} limite - Limite de iniciais (padrão: 2)
 * @returns {string} Iniciais em maiúsculo
 */
export const obterIniciais = (nome, limite = 2) => {
    if (!nome || typeof nome !== 'string') return '??';
    
    const palavras = nome.trim().split(' ').filter(p => p.length > 0);
    
    if (palavras.length === 0) return '??';
    
    if (palavras.length >= limite) {
        return palavras
            .slice(0, limite)
            .map(palavra => palavra[0])
            .join('')
            .toUpperCase();
    }
    
    // Se há menos palavras que o limite, usa as primeiras letras da primeira palavra
    return palavras[0].substring(0, limite).toUpperCase();
};

/**
 * Mascara um nome para preservar privacidade
 * @param {string} nome - Nome a ser mascarado
 * @param {number} caracteresVisiveis - Número de caracteres visíveis no início
 * @returns {string} Nome mascarado
 */
export const mascarNome = (nome, caracteresVisiveis = 2) => {
    if (!nome || typeof nome !== 'string') return nome;
    
    if (nome.length <= caracteresVisiveis) return nome;
    
    return nome.substring(0, caracteresVisiveis) + '*'.repeat(nome.length - caracteresVisiveis);
};

/**
 * Converte um texto para slug (URL amigável)
 * @param {string} texto - Texto a ser convertido
 * @returns {string} Slug
 */
export const gerarSlug = (texto) => {
    if (!texto || typeof texto !== 'string') return '';
    
    return removerAcentos(texto)
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
        .replace(/\s+/g, '-') // Substitui espaços por hífens
        .replace(/-+/g, '-') // Remove hífens duplicados
        .replace(/^-|-$/g, ''); // Remove hífens do início e fim
};
