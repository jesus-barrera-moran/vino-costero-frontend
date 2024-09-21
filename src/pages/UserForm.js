import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Card, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const { Option } = Select;

const CreateOrEditUser = () => {
  const [form] = Form.useForm();
  const { id } = useParams(); // ID del usuario para modificar
  const [isEditMode, setIsEditMode] = useState(false); // Determina si es modo edición
  const [roles, setRoles] = useState([]); // Roles predefinidos desde la base de datos
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener roles predefinidos
    const fetchRoles = async () => {
      try {
        const response = await axios.get('/api/roles');
        setRoles(response.data);
      } catch (error) {
        message.error('Error al obtener roles');
      }
    };

    fetchRoles();

    // Si estamos en modo edición, obtener datos del usuario
    if (id) {
      setIsEditMode(true);
      const fetchUsuario = async () => {
        try {
          const response = await axios.get(`/api/usuarios/${id}`);
          const usuario = response.data;
          form.setFieldsValue({
            nombre: usuario.nombre,
            usuario: usuario.usuario,
            email: usuario.correo,
            rol: usuario.rol, // Cargar el rol actual desde la tabla usuario_roles
          });
        } catch (error) {
          message.error('Error al obtener datos del usuario');
        }
      };
      fetchUsuario();
    }
  }, [id, form]);

  const onFinish = async (values) => {
    try {
      if (isEditMode) {
        // Modo edición: actualizar usuario existente
        await axios.put(`/api/usuarios/${id}`, values);
        message.success('Usuario actualizado exitosamente');
      } else {
        // Modo creación: registrar nuevo usuario
        await axios.post('/api/usuarios', values);
        message.success('Usuario registrado exitosamente');
      }
      navigate('/');
    } catch (error) {
      message.error('Error al guardar el usuario');
    }
  };

  return (
    <Card title={isEditMode ? 'Modificar Usuario' : 'Registrar Nuevo Usuario'} bordered={false} style={{ marginTop: 20 }}>
      <Form form={form} layout="vertical" name="create-user" onFinish={onFinish}>
        {/* Nombre */}
        <Form.Item
          label="Nombre"
          name="nombre"
          rules={[{ required: true, message: 'Por favor, ingrese el nombre del usuario' }]}
        >
          <Input placeholder="Nombre del Usuario" />
        </Form.Item>

        {/* Nombre de Usuario */}
        <Form.Item
          label="Nombre de Usuario"
          name="usuario"
          rules={[{ required: true, message: 'Por favor, ingrese el nombre de usuario' }]}
        >
          <Input placeholder="Nombre de Usuario" />
        </Form.Item>

        {/* Correo Electrónico */}
        <Form.Item
          label="Correo Electrónico"
          name="email"
          rules={[{ required: true, message: 'Por favor, ingrese el correo electrónico' }]}
        >
          <Input placeholder="Correo Electrónico" />
        </Form.Item>

        {/* Rol */}
        <Form.Item
          label="Rol"
          name="rol"
          rules={[{ required: true, message: 'Por favor, seleccione un rol' }]}
        >
          <Select placeholder="Seleccione un rol">
            {roles.map((rol) => (
              <Option key={rol.id_rol} value={rol.id_rol}>
                {rol.nombre}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {isEditMode ? 'Guardar Cambios' : 'Registrar Usuario'}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateOrEditUser;
