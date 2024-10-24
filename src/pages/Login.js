import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CryptoJS from 'crypto-js'; // Importar CryptoJS para la encriptación

const { Title, Text } = Typography;

const { BACKEND_HOST } = require('../config/config');

// Clave de encriptación (usa una más segura y ocúltala en variables de entorno)
const SECRET_KEY = 'tuClaveSecreta';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Si ya existe un token, redirigir a la pantalla de inicio
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/'); // Redirigir al dashboard o la pantalla principal
    }
  }, [navigate]);

  // Función para encriptar credenciales
  const encryptCredentials = (username, password) => {
    const encryptedUsername = CryptoJS.AES.encrypt(username, SECRET_KEY).toString();
    const encryptedPassword = CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
    return { encryptedUsername, encryptedPassword };
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Encriptar las credenciales antes de enviarlas
      const { encryptedUsername, encryptedPassword } = encryptCredentials(values.usuario, values.contrasena);

      // Petición al backend con credenciales encriptadas
      const response = await axios.post(`${BACKEND_HOST}/auth/login`, {
        username: encryptedUsername,
        password: encryptedPassword,
      });

      if (response.data.token) {
        // Guardar el token JWT en localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('roles', JSON.stringify(response.data.roles));
        localStorage.setItem('username', response.data.username);

        message.success('Inicio de sesión exitoso', 1);
        navigate('/'); // Redirigir al dashboard o la pantalla principal
      } else {
        message.error('Nombre de usuario o contraseña incorrectos');
      }
    } catch (error) {
      message.error(`Error en el inicio de sesión. ${error.response?.data?.error || 'Verifique sus credenciales'}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <Card
        bordered={false}
        style={{
          width: 400,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3} style={{ color: '#8B0000', fontWeight: 'bold' }}>
            Iniciar Sesión
          </Title>
          <Text type="secondary">
            Bienvenido al Sistema de Control de Producción y Logística de Vino Costero
          </Text>
        </div>
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
        >
          {/* Nombre de Usuario */}
          <Form.Item
            label="Nombre de Usuario"
            name="usuario"
            rules={[{ required: true, message: 'Por favor ingrese su nombre de usuario' }]}
          >
            <Input placeholder="Nombre de Usuario" />
          </Form.Item>

          {/* Contraseña */}
          <Form.Item
            label="Contraseña"
            name="contrasena"
            rules={[{ required: true, message: 'Por favor ingrese su contraseña' }]}
          >
            <Input.Password placeholder="Contraseña" />
          </Form.Item>

          {/* Botón de Inicio de Sesión */}
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block style={{ backgroundColor: '#8B0000', borderColor: '#8B0000' }}>
              Iniciar Sesión
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
