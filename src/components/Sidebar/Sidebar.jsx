import React from 'react';
import style from './Sidebar.module.css';
import { Box } from '@chakra-ui/react';

const Sidebar = () => {
    return (

        <Box bg="orange.solid" >
            <aside className={style.sidebar}>
                <nav>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li><a href="/dashboard">Dashboard</a></li>
                        <li><a href="/orders">Pedidos</a></li>
                        <li><a href="/products">Produtos</a></li>
                        <li><a href="/clients">Clientes</a></li>
                        <li><a href="/dashboard">Configurações</a></li>
                    </ul>
                </nav>

            </aside>
        </Box >
    );
};

export default Sidebar;