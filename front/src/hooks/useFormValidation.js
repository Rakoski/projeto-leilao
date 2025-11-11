import { useState, useEffect, useCallback } from 'react';

export const useFormValidation = (initialValues, validationRules) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isValid, setIsValid] = useState(false);

    // Função para validar um campo específico
    const validateField = useCallback((fieldName, value) => {
        const rules = validationRules[fieldName];
        if (!rules) return null;

        for (const rule of rules) {
            const error = rule(value, values);
            if (error) return error;
        }
        return null;
    }, [validationRules, values]);

    // Função para validar todos os campos
    const validateAll = useCallback(() => {
        const newErrors = {};
        let formIsValid = true;

        Object.keys(validationRules).forEach(fieldName => {
            const error = validateField(fieldName, values[fieldName]);
            if (error) {
                newErrors[fieldName] = error;
                formIsValid = false;
            }
        });

        setErrors(newErrors);
        setIsValid(formIsValid);
        return formIsValid;
    }, [validateField, values, validationRules]);

    // Atualiza valores e valida em tempo real
    const setValue = useCallback((fieldName, value) => {
        setValues(prev => ({ ...prev, [fieldName]: value }));
        
        // Marca como tocado
        setTouched(prev => ({ ...prev, [fieldName]: true }));
        
        // Valida o campo se já foi tocado
        if (touched[fieldName]) {
            const error = validateField(fieldName, value);
            setErrors(prev => ({ ...prev, [fieldName]: error }));
        }
    }, [validateField, touched]);

    // Marca um campo como tocado
    const setFieldTouched = useCallback((fieldName) => {
        setTouched(prev => ({ ...prev, [fieldName]: true }));
        
        // Valida o campo quando é tocado
        const error = validateField(fieldName, values[fieldName]);
        setErrors(prev => ({ ...prev, [fieldName]: error }));
    }, [validateField, values]);

    // Reseta o formulário
    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
        setIsValid(false);
    }, [initialValues]);

    // Atualiza isValid sempre que errors mudar
    useEffect(() => {
        const hasErrors = Object.values(errors).some(error => error !== null);
        const hasRequiredFields = Object.keys(validationRules).length > 0;
        setIsValid(hasRequiredFields && !hasErrors);
    }, [errors, validationRules]);

    return {
        values,
        errors,
        touched,
        isValid,
        setValue,
        setFieldTouched,
        validateAll,
        reset,
        setValues
    };
};

// Funções utilitárias para validação
export const validationRules = {
    required: (message = 'Este campo é obrigatório') => (value) => {
        if (!value || (typeof value === 'string' && value.trim() === '')) {
            return message;
        }
        return null;
    },

    minLength: (min, message) => (value) => {
        if (value && value.length < min) {
            return message || `Deve ter pelo menos ${min} caracteres`;
        }
        return null;
    },

    maxLength: (max, message) => (value) => {
        if (value && value.length > max) {
            return message || `Deve ter no máximo ${max} caracteres`;
        }
        return null;
    },

    email: (message = 'Email inválido') => (value) => {
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return message;
        }
        return null;
    },

    minValue: (min, message) => (value) => {
        if (value !== null && value !== undefined && value < min) {
            return message || `Deve ser maior ou igual a ${min}`;
        }
        return null;
    },

    maxValue: (max, message) => (value) => {
        if (value !== null && value !== undefined && value > max) {
            return message || `Deve ser menor ou igual a ${max}`;
        }
        return null;
    },

    dateAfter: (compareDate, message) => (value) => {
        if (value && compareDate && new Date(value) <= new Date(compareDate)) {
            return message || 'Data deve ser posterior à data de comparação';
        }
        return null;
    },

    dateBefore: (compareDate, message) => (value) => {
        if (value && compareDate && new Date(value) >= new Date(compareDate)) {
            return message || 'Data deve ser anterior à data de comparação';
        }
        return null;
    },

    custom: (validatorFn, message) => (value, allValues) => {
        if (!validatorFn(value, allValues)) {
            return message || 'Valor inválido';
        }
        return null;
    }
};
