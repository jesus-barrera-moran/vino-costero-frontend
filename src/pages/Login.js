import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Petición al backend para autenticar usuario
      const response = await axios.post('http://localhost:3000/login', {
        username: values.usuario,
        password: values.contrasena,
      });

      if (response.data.token) {
        // Guardar el token JWT en localStorage
        localStorage.setItem('token', response.data.token);

        // Mensaje de éxito y redirección
        message.success('Inicio de sesión exitoso');
        navigate('/'); // Redirigir al dashboard o la pantalla principal
      } else {
        message.error('Nombre de usuario o contraseña incorrectos');
      }
    } catch (error) {
      message.error('Error en el inicio de sesión. Verifique sus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <Card title="Iniciar Sesión" bordered={false} style={{ width: 400 }}>
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
            <Button type="primary" htmlType="submit" loading={loading} block>
              Iniciar Sesión
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
