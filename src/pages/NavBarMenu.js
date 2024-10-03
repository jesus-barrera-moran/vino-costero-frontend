import React from "react";
import { Layout, Menu } from 'antd';
import { DatabaseOutlined, AppstoreAddOutlined, FileDoneOutlined, BarChartOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

const NavBarMenu = ({ defaultSelectedKeys }) => {
  const navigate = useNavigate(); // Hook para navegar

  // Función para manejar la navegación en base a la selección del menú
  const handleMenuClick = (e) => {
    switch (e.key) {
      case '1':
        navigate('/production-panel');
        break;
      case '2':
        navigate('/parcels-panel');
        break;
      case '3':
        navigate('/quality-panel');
        break;
      case '4':
        navigate('/logistic-panel');
        break;
      case '5':
        navigate('/business-panel');
        break;
      default:
        navigate('/');
        break;
    }
  };

  return (
    <Header style={{ backgroundColor: '#004d40', padding: 0 }}>
      <Menu 
        theme="dark" 
        mode="horizontal" 
        defaultSelectedKeys={defaultSelectedKeys ? defaultSelectedKeys : null} 
        style={{ backgroundColor: '#004d40' }}
        onClick={handleMenuClick} // Evento para manejar clicks
      >
        <Menu.Item key="1" icon={<DatabaseOutlined />}>Producción de vinos</Menu.Item>
        <Menu.Item key="2" icon={<AppstoreAddOutlined />}>Control de parcelas</Menu.Item>
        <Menu.Item key="3" icon={<FileDoneOutlined />}>Control de calidad</Menu.Item>
        <Menu.Item key="4" icon={<BarChartOutlined />}>Logística</Menu.Item>
        <Menu.Item key="5" icon={<UserOutlined />}>Análisis de negocios</Menu.Item>
      </Menu>
    </Header>
  );
};

export default NavBarMenu;
