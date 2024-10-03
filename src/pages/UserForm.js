import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Card, message, Switch, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const { Option } = Select;

// Constantes de roles
const ROLES = [
  { id_rol: 1, nombre: 'Administrador del Sistema' },
  { id_rol: 2, nombre: 'Gestor de Producción' },
  { id_rol: 3, nombre: 'Supervisor de Campo' },
  { id_rol: 4, nombre: 'Operador de Campo' },
  { id_rol: 5, nombre: 'Auditor' }
];

// Función para verificar permisos
const checkPermission = (allowedRoles) => {
  const userRoles = JSON.parse(localStorage.getItem("roles")) || [];
  return Array.isArray(userRoles) ? userRoles.some(role => allowedRoles.includes(role)) : allowedRoles.includes(userRoles);
};

const CreateOrEditUser = () => {
  const [form] = Form.useForm();
  const { username } = useParams(); // ID del usuario para modificar
  const [isEditMode, setIsEditMode] = useState(false); // Determina si es modo edición
  const [loading, setLoading] = useState(false); // Estado de carga
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario tiene el token, sino redirigir a login
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('Debe estar autenticado para acceder a esta página');
      navigate('/login'); // Redirige al login si no hay token
    }
  }, [navigate]);

  // Verificar si el usuario tiene permiso para gestionar usuarios (solo el Administrador del Sistema)
  const canManageUsers = checkPermission([1]);

  // Redirigir si no tienen permiso para gestionar usuarios
  useEffect(() => {
    if ((username && localStorage.getItem('username') !== username) || (!username && !canManageUsers)) {
      message.error('No tiene permisos para gestionar a este usuario');
      navigate('/');
    }
  }, [canManageUsers, navigate]);

  useEffect(() => {
    // Si estamos en modo edición, obtener datos del usuario
    if (username) {
      setIsEditMode(true);
      setLoading(true); // Activar el estado de carga mientras se obtienen los datos
      const fetchUsuario = async () => {
        const token = localStorage.getItem('token'); // Obtener el token del localStorage
        try {
          const response = await axios.get(`http://localhost:3000/auth/usuarios/${username}`, {
            headers: {
              'Authorization': `Bearer ${token}`,  // Incluir el token en la cabecera
            }
          });
          const usuario = response.data;

          form.setFieldsValue({
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            usuario: usuario.usuario,  // Solo si es necesario en modo edición
            email: usuario.correo,      // Ajusta el campo "correo" a "email"
            habilitado: usuario.habilitado,
            rol: usuario.roles.map((role) => role.id_rol), // Cargar el rol actual desde la tabla usuario_roles
          });
        } catch (error) {
          if (error.response.status === 401) {
            // Si la respuesta es 401, redirigir al login
            message.error('Sesión expirada. Por favor, inicie sesión de nuevo.');
            localStorage.removeItem('token'); // Remover el token inválido
            navigate('/login'); // Redirigir al login
            return;
          }
          message.error('Error al obtener datos del usuario');
        } finally {
          setLoading(false); // Desactivar el estado de carga después de obtener los datos
        }
      };
      fetchUsuario();
    }
  }, [username, form]);

  const onFinish = async (values) => {
    const token = localStorage.getItem('token'); // Obtener el token del localStorage

    try {
      if (isEditMode) {
        // Modo edición: actualizar usuario existente
        await axios.put(`http://localhost:3000/auth/update/${username}`, {
          nombre: values.nombre,
          apellido: values.apellido,
          correo: values.email,
          contrasena: values.contrasena || undefined, // Solo enviar la contraseña si fue modificada
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,  // Incluir el token en la cabecera
          }
        });
        message.success('Usuario actualizado exitosamente');
      } else {
        // Modo creación: registrar nuevo usuario
        await axios.post('http://localhost:3000/auth/register', {
          username: values.usuario,
          password: values.contrasena,
          nombre: values.nombre,
          apellido: values.apellido,
          correo: values.email,
          roles: [values.rol], // Enviar el rol seleccionado como array
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,  // Incluir el token en la cabecera
          }
        });
        message.success('Usuario registrado exitosamente');
      }
      navigate('/usuarios'); // Redirigir al listado de usuarios después de guardar
    } catch (error) {
      message.error('Error al guardar el usuario');
    }
  };

  const validatePasswordConfirmation = ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue('contrasena') === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('Las contraseñas no coinciden'));
    },
  });

  return (
    <Card title={isEditMode ? 'Modificar Usuario' : 'Registrar Nuevo Usuario'} bordered={false} style={{ marginTop: 20 }}>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" tip="Cargando datos del usuario..." />
        </div>
      ) : (
        <Form 
          form={form} 
          layout="vertical" 
          name="create-user" 
          onFinish={onFinish}
          initialValues={{
            habilitado: true,  // Valor por defecto de habilitado
          }}
        >
          {/* Nombre */}
          <Form.Item
            label="Nombre"
            name="nombre"
            rules={[{ required: true, message: 'Por favor, ingrese el nombre del usuario' }]}
          >
            <Input placeholder="Nombre del Usuario" />
          </Form.Item>

          {/* Apellido */}
          <Form.Item
            label="Apellido"
            name="apellido"
            rules={[{ required: true, message: 'Por favor, ingrese el apellido del usuario' }]}
          >
            <Input placeholder="Apellido del Usuario" />
          </Form.Item>

          {/* Nombre de Usuario */}
          {!isEditMode && (
            <Form.Item
              label="Nombre de Usuario"
              name="usuario"
              rules={[{ required: true, message: 'Por favor, ingrese el nombre de usuario' }]}
            >
              <Input placeholder="Nombre de Usuario" />
            </Form.Item>
          )}

          {/* Correo Electrónico */}
          <Form.Item
            label="Correo Electrónico"
            name="email"
            rules={[{ required: true, message: 'Por favor, ingrese el correo electrónico' }]}
          >
            <Input placeholder="Correo Electrónico" />
          </Form.Item>

          {/* Contraseña */}
          {!isEditMode && (
            <>
              <Form.Item
                label="Contraseña"
                name="contrasena"
                rules={[{ required: true, message: 'Por favor, ingrese una contraseña' }]}
              >
                <Input.Password placeholder="Contraseña" />
              </Form.Item>

              {/* Confirmar Contraseña */}
              <Form.Item
                label="Confirmar Contraseña"
                name="confirmarContrasena"
                dependencies={['contrasena']}
                hasFeedback
                rules={[
                  { required: true, message: 'Por favor, confirme su contraseña' },
                  validatePasswordConfirmation,
                ]}
              >
                <Input.Password placeholder="Confirmar Contraseña" />
              </Form.Item>
            </>
          )}

          {/* Rol */}
          {!isEditMode && (
            <Form.Item
              label="Rol"
              name="rol"
              rules={[{ required: true, message: 'Por favor, seleccione un rol' }]}
            >
              <Select placeholder="Seleccione un rol">
                {ROLES.map((rol) => (
                  <Option key={rol.id_rol} value={rol.id_rol}>
                    {rol.nombre}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEditMode ? 'Guardar Cambios' : 'Registrar Usuario'}
            </Button>
          </Form.Item>
        </Form>
      )}
    </Card>
  );
};

export default CreateOrEditUser;
