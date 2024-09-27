import React, { useState, useEffect } from 'react';
import { Table, Button, Select, Switch, message, Card } from 'antd';
import axios from 'axios';

const { Option } = Select;

const UserManagement = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar los usuarios desde el backend
  useEffect(() => {
    const fetchUsuarios = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/usuarios'); // Ajusta la URL según tu backend
        setUsuarios(response.data);
      } catch (error) {
        message.error('Error al cargar los usuarios');
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  // Función para manejar el cambio de rol
  const handleRoleChange = async (value, record) => {
    try {
      const updatedUser = { ...record, rol: value };
      await axios.put(`http://localhost:3000/usuarios/${record.id_usuario}`, { rol: value });
      setUsuarios((prevUsuarios) =>
        prevUsuarios.map((usuario) =>
          usuario.id_usuario === record.id_usuario ? updatedUser : usuario
        )
      );
      message.success(`Rol actualizado para ${record.nombre}`);
    } catch (error) {
      message.error('Error al actualizar el rol');
    }
  };

  // Función para manejar el cambio de estado
  const handleToggleEstado = async (checked, record) => {
    try {
      const updatedUser = { ...record, habilitado: checked };
      await axios.put(`http://localhost:3000/usuarios/${record.id_usuario}`, { habilitado: checked });
      setUsuarios((prevUsuarios) =>
        prevUsuarios.map((usuario) =>
          usuario.id_usuario === record.id_usuario ? updatedUser : usuario
        )
      );
      message.success(`Estado actualizado para ${record.nombre}`);
    } catch (error) {
      message.error('Error al actualizar el estado');
    }
  };

  // Columnas de la tabla
  const columns = [
    {
      title: 'Nombre de Usuario',
      dataIndex: 'usuario',
      key: 'usuario',
    },
    {
      title: 'Correo Electrónico',
      dataIndex: 'correo',
      key: 'correo',
    },
    {
      title: 'Rol',
      dataIndex: 'rol',
      key: 'rol',
      render: (rol, record) => (
        <Select value={rol} style={{ width: 160 }} onChange={(value) => handleRoleChange(value, record)}>
          <Option value="Administrador del Sistema">Administrador</Option>
          <Option value="Gestor de Producción">Gestor de Producción</Option>
          <Option value="Supervisor de Campo">Supervisor de Campo</Option>
          <Option value="Operador de Campo">Operador de Campo</Option>
          <Option value="Auditor">Auditor</Option>
        </Select>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'habilitado',
      key: 'habilitado',
      render: (habilitado, record) => (
        <Switch checked={habilitado} onChange={(checked) => handleToggleEstado(checked, record)} />
      ),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (record) => (
        <Button type="primary" onClick={() => handleGuardarCambios(record)}>
          Guardar Cambios
        </Button>
      ),
    },
  ];

  return (
    <Card title="Gestión de Usuarios" bordered={false} style={{ marginTop: 20 }}>
      <Button
        type="primary"
        style={{ marginBottom: 20 }}
        onClick={() => message.info('Crear nuevo usuario - Función en desarrollo')}
      >
        Nuevo Usuario +
      </Button>
      <Table columns={columns} dataSource={usuarios} rowKey="id_usuario" loading={loading} />
    </Card>
  );
};

export default UserManagement;
