import React, { useState, useEffect } from 'react';
import { Layout, Form, Input, Button, Select, Card, message, Spin, Row, Col } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import NavBarMenu from './NavBarMenu';
import CryptoJS from 'crypto-js'; // Importar CryptoJS para la encriptación

const { Option } = Select;
const { Header, Content, Footer } = Layout;

const { BACKEND_HOST } = require('../config/config');

// Constantes de roles
const ROLES = [
  { id_rol: 1, nombre: 'Administrador del Sistema' },
  { id_rol: 2, nombre: 'Gestor de Producción' },
  { id_rol: 3, nombre: 'Supervisor de Campo' },
  { id_rol: 4, nombre: 'Operador de Campo' },
  { id_rol: 5, nombre: 'Auditor' }
];

// Clave de encriptación (debe ser la misma usada en el backend)
const ENCRYPTION_KEY = 'tuClaveSecreta';

// Función para verificar permisos
const checkPermission = (allowedRoles) => {
  const userRoles = JSON.parse(localStorage.getItem("roles")) || [];
  return Array.isArray(userRoles) ? userRoles.some(role => allowedRoles.includes(role)) : allowedRoles.includes(userRoles);
};

// Función para encriptar texto
const encryptText = (text) => {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
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
          const response = await axios.get(`${BACKEND_HOST}/auth/usuarios/${username}`, {
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
    setLoading(true); // Activamos el estado de carga
    try {
      let response;
  
      if (isEditMode) {
        response = await axios.put(`${BACKEND_HOST}/auth/update/${username}`, {
          nombre: values.nombre,
          apellido: values.apellido,
          correo: values.email,
          contrasena: values.contrasena ? encryptText(values.contrasena) : undefined, // Encriptar la contraseña si se proporciona
        }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        message.success('Usuario actualizado exitosamente');
      } else {
        response = await axios.post(`${BACKEND_HOST}/auth/register`, {
          username: values.usuario,
          password: encryptText(values.contrasena), // Encriptar la contraseña antes de enviarla
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
      // Manejar errores específicos de Axios
      const errorMessage = error.response?.data?.message || 'Error al guardar el usuario';
      message.error(errorMessage); // Mostrar mensaje de error
    } finally {
      setLoading(false); // Desactivamos el estado de carga
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
              >
                <Input disabled={isEditMode} placeholder="Nombre de Usuario" />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Nombre"
                    name="nombre"
                  >
                    <Input placeholder="Nombre del Usuario" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Apellido"
                    name="apellido"
                  >
                    <Input placeholder="Apellido del Usuario" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Correo Electrónico"
                name="email"
              >
                <Input placeholder="Correo Electrónico" />
              </Form.Item>

              {!isEditMode && (
                <>
                  <Form.Item
                    label="Contraseña"
                    name="contrasena"
                  >
                    <Input.Password placeholder="Contraseña" />
                  </Form.Item>
                  <Form.Item
                    label="Confirmar Contraseña"
                    name="confirmarContrasena"
                    dependencies={['contrasena']}
                    hasFeedback
                  >
                    <Input.Password placeholder="Confirmar Contraseña" />
                  </Form.Item>
                </>
              )}

              <Form.Item
                label="Rol"
                name="rol"
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
