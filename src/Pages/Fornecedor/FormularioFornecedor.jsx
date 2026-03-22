import React from 'react';
import useStyle from '../../components/Hooks/UseStyle';

const FormularioFornecedor = () => {

    const {S,theme} = useStyle();

    const [formData, setFormData] = React.useState({
        nome: '',
        email: '',
        telefone: '',
        endereco: '',
        observacao: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Dados do fornecedor:', formData);
    };

    return (
        <div className="formulario-fornecedor">
            <form onSubmit={handleSubmit}>
                <label htmlFor="nome" style={S.inputLabel}>Nome*</label>
                <input  style={{...S.inp}}
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="cnpj" style={S.inputLabel}>Cnpj</label>
                <input style={S.inp}
                    type="text"
                    name="cnjp"
                    value={formData.email}
                    onChange={handleChange}
                    required
                /> 
                <label style={S.inputLabel} htmlFor='telefone'>Telefone</label>
                <input style={S.inp}
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                />
                <label style={S.inputLabel} htmlFor='endereco'>Endereço</label>
                <input style={S.inp}
                    type="text"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                />
                <label style={S.inputLabel} htmlFor='observacao'>Observação</label>
                <input style={S.inp}
                    type="textarea"
                    name="observacao"
                    value={formData.observacao}
                    placeholder='Opcional'
                    onChange={handleChange}
                />
            </form>
        </div>
    );
};

export default FormularioFornecedor;