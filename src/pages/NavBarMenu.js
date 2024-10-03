import React from "react";
import { Layout, Menu, Dropdown, Avatar, Space, message } from 'antd';
import { DatabaseOutlined, AppstoreAddOutlined, FileDoneOutlined, BarChartOutlined, UserOutlined, LogoutOutlined, SettingOutlined, UserAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

const NavBarMenu = ({ defaultSelectedKeys }) => {
  const navigate = useNavigate(); // Hook para navegar
  const roles = localStorage.getItem('roles'); // Roles del usuario

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

  // Función para redirigir al home al hacer clic en el logo
  const handleLogoClick = () => {
    navigate('/');
  };

  // Función para manejar las acciones del menú de usuario
  const handleUserMenuClick = ({ key }) => {
    switch (key) {
      case 'profile':
        const username = localStorage.getItem('username');
        navigate('/edit-user/' + username);
        break;
      case 'logout':
        // Lógica para cerrar sesión
        message.success('Sesión cerrada');
        localStorage.removeItem('token'); // Remover el token de sesión
        navigate('/login');
        break;
      case 'users':
        navigate('/users');
        break;
      case 'create-user':
        navigate('/create-user');
        break;
      default:
        break;
    }
  };

  // Menú desplegable del usuario
  const userMenu = (
    <Menu onClick={handleUserMenuClick}>
      <Menu.Item key="profile" icon={<UserAddOutlined />}>
        Perfil
      </Menu.Item>
      {roles && roles.includes(1) && (
        <Menu.Item key="create-user" icon={<UserAddOutlined />}>
          Crear Usuario
        </Menu.Item>
      )}
      {roles && roles.includes(1) && (
        <Menu.Item key="users" icon={<SettingOutlined />}>
          Administrar Usuarios
        </Menu.Item>
      )}
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Cerrar Sesión
      </Menu.Item>
    </Menu>
  );

  return (
    <Header style={{ backgroundColor: '#004d40', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '1200px' }}>
        {/* Logo de Vino Costero */}
        <div style={{ display: 'flex', alignItems: 'center', marginRight: 'auto', cursor: 'pointer' }} onClick={handleLogoClick}>
          <img 
            src="/logo-vino-costero.png" 
            alt="Vino Costero" 
            style={{ height: '40px', marginLeft: '20px' }}
          />
        </div>

        {/* Menú centrado */}
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={defaultSelectedKeys ? defaultSelectedKeys : null}
          style={{ backgroundColor: '#004d40', flexGrow: 1, justifyContent: 'center', borderBottom: 'none' }}
          onClick={handleMenuClick} // Evento para manejar clicks
        >
          <Menu.Item key="1" icon={<DatabaseOutlined />}>Producción de vinos</Menu.Item>
          <Menu.Item key="2" icon={<AppstoreAddOutlined />}>Control de parcelas</Menu.Item>
          <Menu.Item key="3" icon={<FileDoneOutlined />}>Control de calidad</Menu.Item>
          <Menu.Item key="4" icon={<BarChartOutlined />}>Logística</Menu.Item>
          <Menu.Item key="5" icon={<UserOutlined />}>Análisis de negocios</Menu.Item>
        </Menu>

        {/* Menú de Usuario */}
        <div style={{ marginLeft: 'auto', marginRight: '20px' }}>
          <Dropdown overlay={userMenu} trigger={['click']}>
            <Space style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} />
              <span style={{ color: '#fff' }}>Usuario</span>
            </Space>
          </Dropdown>
        </div>
      </div>
    </Header>
  );
};

export default NavBarMenu;
