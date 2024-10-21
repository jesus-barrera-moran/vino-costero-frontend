import React, { useState, useEffect } from 'react';
import { Layout, Table, Button, Select, Switch, message, Spin, Card } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBarMenu from './NavBarMenu';

const { Option } = Select;
const { Header, Content, Footer } = Layout;

const { BACKEND_HOST } = require('../config/config');

// Lista de roles
const ROLES = [
  { id_rol: 1, nombre: 'Administrador del Sistema' },
  { id_rol: 2, nombre: 'Gestor de Producción' },
  { id_rol: 3, nombre: 'Supervisor de Campo' },
  { id_rol: 4, nombre: 'Operador de Campo' },
  { id_rol: 5, nombre: 'Auditor' }
];

// Función para verificar permisos
const checkPermission = (allowedRoles) => {
  const userRoles = JSON.parse(localStorage.getItem('roles')) || [];
  return Array.isArray(userRoles) ? userRoles.some(role => allowedRoles.includes(role)) : allowedRoles.includes(userRoles);
};

const UserManagement = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [changes, setChanges] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('Debe estar autenticado para acceder a esta página');
      navigate('/login');
    }
  }, [navigate]);

  const canEdit = checkPermission([1]);
  const canView = checkPermission([1, 5]);

  useEffect(() => {
    if (!canView) {
      message.error('No tiene permisos para ver esta página');
      navigate('/');
    }
  }, [canView, navigate]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BACKEND_HOST}/auth/usuarios`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuarios(response.data);
      } catch (error) {
        message.error('Error al cargar los usuarios');
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();
  }, []);

  const handleRoleChange = (value, record) => {
    const updatedUser = { ...record, rol: value };
    setUsuarios((prevUsuarios) =>
      prevUsuarios.map((usuario) =>
        usuario.id_usuario === record.id_usuario ? updatedUser : usuario
      )
    );
    setChanges((prevChanges) => {
      const existingChange = prevChanges.find((change) => change.id_usuario === record.id_usuario);
      return existingChange
        ? prevChanges.map((change) =>
            change.id_usuario === record.id_usuario ? { ...change, rol: value } : change
          )
        : [...prevChanges, { id_usuario: record.id_usuario, rol: value }];
    });
  };

  const handleToggleEstado = (checked, record) => {
    const updatedUser = { ...record, habilitado: checked };
    setUsuarios((prevUsuarios) =>
      prevUsuarios.map((usuario) =>
        usuario.id_usuario === record.id_usuario ? updatedUser : usuario
      )
    );
    setChanges((prevChanges) => {
      const existingChange = prevChanges.find((change) => change.id_usuario === record.id_usuario);
      return existingChange
        ? prevChanges.map((change) =>
            change.id_usuario === record.id_usuario ? { ...change, habilitado: checked } : change
          )
        : [...prevChanges, { id_usuario: record.id_usuario, habilitado: checked }];
    });
  };

  const saveChanges = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${BACKEND_HOST}/auth/usuarios/batch`,
        { usuarios: changes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success('Cambios guardados exitosamente');
      setChanges([]);
    } catch (error) {
      message.error('Error al guardar los cambios');
    }
  };

  const roleMap = ROLES.reduce((map, role) => {
    map[role.id_rol] = role.nombre;
    return map;
  }, {});

  const columns = [
    { title: 'Nombre de Usuario', dataIndex: 'usuario', key: 'usuario' },
    { title: 'Correo Electrónico', dataIndex: 'correo', key: 'correo' },
    {
      title: 'Rol',
      dataIndex: 'rol',
      key: 'rol',
      render: (rol, record) => (
        <Select
          value={roleMap[rol]}
          style={{ width: 220 }}
          onChange={(value) => handleRoleChange(value, record)}
          disabled={!canEdit}
        >
          {ROLES.map((role) => (
            <Option key={role.id_rol} value={role.id_rol}>
              {role.nombre}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'habilitado',
      key: 'habilitado',
      render: (habilitado, record) => (
        <Switch
          checked={habilitado}
          onChange={(checked) => handleToggleEstado(checked, record)}
          disabled={!canEdit}
        />
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" tip="Cargando tipos de uva..." />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      <Header style={{ backgroundColor: '#004d40' }}>
        <NavBarMenu defaultSelectedKeys={['4']} />
      </Header>

      <Content style={{ padding: '24px' }}>
        <Card title="Gestión de Usuarios" bordered={false} style={{ margin: '0 auto', marginTop: 20 }}>
          <Button
            type="primary"
            style={{ marginBottom: 20, backgroundColor: '#8B0000', borderColor: '#8B0000' }}
            onClick={() => navigate('/create-user')}
            disabled={!canEdit}
          >
            Nuevo Usuario +
          </Button>
          <Table columns={columns} dataSource={usuarios} rowKey="id_usuario" loading={loading} />
          {changes.length > 0 && (
            <Button
              type="primary"
              style={{ marginBottom: 20, backgroundColor: '#8B0000', borderColor: '#8B0000' }}
              onClick={saveChanges}
            >
              Guardar Cambios
            </Button>
          )}
        </Card>
      </Content>

      <Footer style={{ textAlign: 'center', backgroundColor: '#004d40', color: '#fff' }}>
        Vino Costero ©2024 - Sistema de Control de Producción y Logística
      </Footer>
    </Layout>
  );
};

export default UserManagement;
