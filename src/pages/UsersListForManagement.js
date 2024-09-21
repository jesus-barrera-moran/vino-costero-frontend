import React, { useState } from 'react';
import { Table, Button, Select, Switch, message, Card } from 'antd';

const { Option } = Select;

const UserManagement = () => {
  // Datos falsos de usuarios para pruebas
  const [usuarios, setUsuarios] = useState([
    {
      id_usuario: 1,
      usuario: 'johndoe',
      nombre: 'John',
      apellido: 'Doe',
      correo: 'johndoe@example.com',
      rol: 'Administrador del Sistema',
      habilitado: true,
    },
    {
      id_usuario: 2,
      usuario: 'janedoe',
      nombre: 'Jane',
      apellido: 'Doe',
      correo: 'janedoe@example.com',
      rol: 'Gestor de Producción',
      habilitado: false,
    },
    {
      id_usuario: 3,
      usuario: 'bobsponge',
      nombre: 'Bob',
      apellido: 'Sponge',
      correo: 'bobsponge@example.com',
      rol: 'Operador de Campo',
      habilitado: true,
    },
    {
      id_usuario: 4,
      usuario: 'alicesmith',
      nombre: 'Alice',
      apellido: 'Smith',
      correo: 'alicesmith@example.com',
      rol: 'Supervisor de Campo',
      habilitado: false,
    },
    {
      id_usuario: 5,
      usuario: 'chrisrock',
      nombre: 'Chris',
      apellido: 'Rock',
      correo: 'chrisrock@example.com',
      rol: 'Auditor',
      habilitado: true,
    },
  ]);

  // Función para manejar el cambio de rol
  const handleRoleChange = (value, record) => {
    setUsuarios((prevUsuarios) =>
      prevUsuarios.map((usuario) =>
        usuario.id_usuario === record.id_usuario ? { ...usuario, rol: value } : usuario
      )
    );
  };

  // Función para manejar el cambio de estado
  const handleToggleEstado = (checked, record) => {
    setUsuarios((prevUsuarios) =>
      prevUsuarios.map((usuario) =>
        usuario.id_usuario === record.id_usuario ? { ...usuario, habilitado: checked } : usuario
      )
    );
  };

  // Función para guardar cambios de usuario (simulación)
  const handleGuardarCambios = (record) => {
    message.success(`Cambios guardados para el usuario ${record.nombre} ${record.apellido}`);
    console.log('Datos guardados:', record);
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
    <Card title="Gestión de Usuarios (Datos de Prueba)" bordered={false} style={{ marginTop: 20 }}>
      <Button
        type="primary"
        style={{ marginBottom: 20 }}
        onClick={() => message.info('Crear nuevo usuario - Función en desarrollo')}
      >
        Nuevo Usuario +
      </Button>
      <Table columns={columns} dataSource={usuarios} rowKey="id_usuario" />
    </Card>
  );
};

export default UserManagement;
