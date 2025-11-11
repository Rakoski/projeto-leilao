/**
 * Arquivo de índice para exportar todas as funções utilitárias
 */

// String utilities
export {
    formatarMoeda,
    formatarData,
    formatarDataHora,
    truncarTexto,
    capitalizarTexto,
    removerAcentos,
    formatarTelefone,
    formatarCPF,
    obterIniciais,
    mascarNome,
    gerarSlug
} from './stringUtils';

// UI utilities
export {
    getStatusSeverity,
    getStatusDisplayText,
    STATUS_OPTIONS,
    podeAbrirLeilao,
    podeEncerrarLeilao,
    podeCancelarLeilao,
    gerarOpcoesCategoria,
    obterNomeCategoria,
    isDataValida,
    compararDatas,
    formatarMensagemErro,
    debounce,
    gerarIdUnico
} from './uiUtils';

// Data utilities
export {
    processarRespostaPaginada,
    garantirArray,
    removerDuplicatas,
    ordenarPorMultiplosCriterios,
    filtrarPorCriterios,
    agruparPor,
    calcularEstatisticas,
    paginarArray
} from './dataUtils';
