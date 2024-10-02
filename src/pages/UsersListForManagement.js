import React, { useState, useEffect } from 'react';
import { Table, Button, Select, Switch, message, Card } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

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
  const [changes, setChanges] = useState([]); // State to track changes
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Verificar si el usuario tiene el token, sino redirigir a login
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('Debe estar autenticado para acceder a esta página');
      navigate('/login'); // Redirige al login si no hay token
    }
  }, [navigate]);

  // Verificar permisos basados en el rol
  const canEdit = checkPermission([1]); // Solo el Administrador puede editar usuarios
  const canView = checkPermission([1, 2, 3, 4, 5]); // Todos pueden ver la lista

  // Redirigir si no tienen permiso para ver
  useEffect(() => {
    if (!canView) {
      message.error('No tiene permisos para ver esta página');
      navigate('/');
    }
  }, [canView, navigate]);

  // Cargar los usuarios desde el backend
  useEffect(() => {
    const fetchUsuarios = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/auth/usuarios', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  // Función para manejar el cambio de rol (solo guarda localmente)
  const handleRoleChange = (value, record) => {
    const updatedUser = { ...record, rol: value };

    // Update the local state
    setUsuarios((prevUsuarios) =>
      prevUsuarios.map((usuario) =>
        usuario.id_usuario === record.id_usuario ? updatedUser : usuario
      )
    );

    // Track the changes
    setChanges((prevChanges) => {
      const existingChange = prevChanges.find((change) => change.id_usuario === record.id_usuario);
      if (existingChange) {
        return prevChanges.map((change) =>
          change.id_usuario === record.id_usuario ? { ...change, rol: value } : change
        );
      } else {
        return [...prevChanges, { id_usuario: record.id_usuario, rol: value }];
      }
    });
  };

  // Función para manejar el cambio de estado (solo guarda localmente)
  const handleToggleEstado = (checked, record) => {
    const updatedUser = { ...record, habilitado: checked };

    // Update the local state
    setUsuarios((prevUsuarios) =>
      prevUsuarios.map((usuario) =>
        usuario.id_usuario === record.id_usuario ? updatedUser : usuario
      )
    );

    // Track the changes
    setChanges((prevChanges) => {
      const existingChange = prevChanges.find((change) => change.id_usuario === record.id_usuario);
      if (existingChange) {
        return prevChanges.map((change) =>
          change.id_usuario === record.id_usuario ? { ...change, habilitado: checked } : change
        );
      } else {
        return [...prevChanges, { id_usuario: record.id_usuario, habilitado: checked }];
      }
    });
  };

  // Guardar todos los cambios en una sola solicitud
  const saveChanges = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:3000/auth/usuarios/batch', // Usar el nuevo endpoint para batch updates
        { usuarios: changes },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success('Cambios guardados exitosamente');
      setChanges([]); // Clear changes after saving
    } catch (error) {
      message.error('Error al guardar los cambios');
    }
  };

  // Mapeo de roles para mostrar los nombres en vez de los IDs
  const roleMap = ROLES.reduce((map, role) => {
    map[role.id_rol] = role.nombre; // Mapeo: { 1: 'Administrador del Sistema', 2: 'Gestor de Producción', ... }
    return map;
  }, {});

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
        <Select
          value={roleMap[rol]} // Mostrar el nombre del rol en vez del ID
          style={{ width: 220 }}
          onChange={(value) => handleRoleChange(value, record)}
          disabled={!canEdit} // Solo habilitar si el usuario tiene permisos para editar
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
          disabled={!canEdit} // Solo habilitar si el usuario tiene permisos para editar
        />
      ),
    },
  ];

  return (
    <Card title="Gestión de Usuarios" bordered={false} style={{ marginTop: 20 }}>
      <Button
        type="primary"
        style={{ marginBottom: 20 }}
        onClick={() => navigate('/create-user')}
        disabled={!canEdit} // Solo habilitar si el usuario tiene permisos para crear usuarios
      >
        Nuevo Usuario +
      </Button>
      <Table columns={columns} dataSource={usuarios} rowKey="id_usuario" loading={loading} />
      {changes.length > 0 && (
        <Button type="primary" onClick={saveChanges} style={{ marginTop: 20 }}>
          Guardar Cambios
        </Button>
      )}
    </Card>
  );
};

export default UserManagement;
