import React, { useState, useEffect } from 'react';
import { Layout, Form, Input, Button, Select, Card, message, Spin, Row, Col } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import NavBarMenu from './NavBarMenu';

const { Option } = Select;
const { Header, Content, Footer } = Layout;

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
  const { username } = useParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('Debe estar autenticado para acceder a esta página');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (window.location.pathname.includes('create-user')) {
      setIsEditMode(false);
      form.resetFields();
    }
  }, [window.location.pathname]);

  const canManageUsers = checkPermission([1]);
  useEffect(() => {
    if ((username && localStorage.getItem('username') !== username) || (!username && !canManageUsers)) {
      message.error('No tiene permisos para gestionar a este usuario');
      navigate('/');
    }
  }, [canManageUsers, navigate]);

  useEffect(() => {
    if (username) {
      setIsEditMode(true);
      setLoading(true);
      const fetchUsuario = async () => {
        const token = localStorage.getItem('token');
        try {
          const response = await axios.get(`${process.env.BACKEND_HOST}/auth/usuarios/${username}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const usuario = response.data;
          form.setFieldsValue({
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            usuario: usuario.usuario,
            email: usuario.correo,
            habilitado: usuario.habilitado,
            rol: usuario.roles[0],
          });
        } catch (error) {
          if (error.response?.status === 401) {
            message.error('Sesión expirada. Inicie sesión nuevamente.');
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          message.error('Error al obtener datos del usuario');
        } finally {
          setLoading(false);
        }
      };
      fetchUsuario();
    }
  }, [username, form]);

  const onFinish = async (values) => {
    const token = localStorage.getItem('token');
    try {
      if (isEditMode) {
        await axios.put(`${process.env.BACKEND_HOST}/auth/update/${username}`, {
          nombre: values.nombre,
          apellido: values.apellido,
          correo: values.email,
          contrasena: values.contrasena || undefined,
        }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        message.success('Usuario actualizado exitosamente');
      } else {
        await axios.post(`${process.env.BACKEND_HOST}/auth/register`, {
          username: values.usuario,
          password: values.contrasena,
          nombre: values.nombre,
          apellido: values.apellido,
          correo: values.email,
          roles: [values.rol],
        }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        message.success('Usuario registrado exitosamente');
      }
      navigate('/users');
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
        <NavBarMenu defaultSelectedKeys={['3']} />
      </Header>

      <Content style={{ padding: '24px' }}>
        <Card title={isEditMode ? 'Modificar Usuario' : 'Registrar Nuevo Usuario'} bordered={false} style={{ marginTop: 20, maxWidth: '800px', margin: '0 auto' }}>
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
              initialValues={{ habilitado: true }}
              style={{ marginBottom: 30 }}
            >

              <Form.Item
                label="Nombre de Usuario"
                name="usuario"
                rules={[{ required: true, message: 'Por favor, ingrese el nombre de usuario' }]}
              >
                <Input disabled={isEditMode} placeholder="Nombre de Usuario" />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Nombre"
                    name="nombre"
                    rules={[{ required: true, message: 'Por favor, ingrese el nombre del usuario' }]}
                  >
                    <Input placeholder="Nombre del Usuario" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Apellido"
                    name="apellido"
                    rules={[{ required: true, message: 'Por favor, ingrese el apellido del usuario' }]}
                  >
                    <Input placeholder="Apellido del Usuario" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Correo Electrónico"
                name="email"
                rules={[{ required: true, message: 'Por favor, ingrese el correo electrónico' }]}
              >
                <Input placeholder="Correo Electrónico" />
              </Form.Item>

              {!isEditMode && (
                <>
                  <Form.Item
                    label="Contraseña"
                    name="contrasena"
                    rules={[{ required: true, message: 'Por favor, ingrese una contraseña' }]}
                  >
                    <Input.Password placeholder="Contraseña" />
                  </Form.Item>
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

              <Form.Item
                label="Rol"
                name="rol"
                rules={[{ required: true, message: 'Por favor, seleccione un rol' }]}
              >
                <Select disabled={isEditMode} placeholder="Seleccione un rol">
                  {ROLES.map((rol) => (
                    <Option key={rol.id_rol} value={rol.id_rol}>
                      {rol.nombre}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '100%', backgroundColor: '#8B0000', borderColor: '#8B0000' }}>
                  {isEditMode ? 'Guardar Cambios' : 'Registrar Usuario'}
                </Button>
              </Form.Item>
            </Form>
          )}
        </Card>
      </Content>

      <Footer style={{ textAlign: 'center', backgroundColor: '#004d40', color: '#fff' }}>
        Vino Costero ©2024 - Sistema de Control de Producción y Logística
      </Footer>
    </Layout>
  );
};

export default CreateOrEditUser;
