import React, { useState, useEffect } from 'react';
import { Layout, Form, InputNumber, Button, Card, Select, Descriptions, Input, message, Collapse, Spin } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import NavBarMenu from './NavBarMenu';

const { Content, Footer } = Layout;
const { Panel } = Collapse;

// Función para verificar permisos
const checkPermission = (allowedRoles) => {
  const userRoles = JSON.parse(localStorage.getItem("roles")) || [];
  return Array.isArray(userRoles) ? userRoles.some(role => allowedRoles.includes(role)) : allowedRoles.includes(userRoles);
};

const RegisterSoilControl = () => {
  const [form] = Form.useForm();
  const [parcelas, setParcelas] = useState([]);
  const [selectedParcela, setSelectedParcela] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga
  const { id } = useParams(); // Capturar ID si venimos desde el botón "Crear Control" específico de una parcela
  const navigate = useNavigate();

  // Verificar si el usuario tiene el token, sino redirigir a login
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('Debe estar autenticado para acceder a esta página');
      navigate('/login'); // Redirige al login si no hay token
    }
  }, [navigate]);

  // Permisos basados en CU_03
  const canCreate = checkPermission([1, 3]);

  // Redirigir si no tienen permiso para crear
  useEffect(() => {
    if (!canCreate) {
      message.error('No tiene permisos para registrar controles de tierra');
      navigate('/');
    }
  }, [canCreate, navigate]);

  // Obtener las parcelas desde el endpoint
  const fetchParcelas = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); // Obtener el token del localStorage
      const response = await fetch('http://localhost:3000/parcelas', {
        headers: {
          'Authorization': `Bearer ${token}`,  // Incluir el token en la cabecera
          'Content-Type': 'application/json',
        },
      }); // Ajustar la URL si es necesario
      if (response.status === 401) {
        // Si la respuesta es 401, redirigir al login
        message.error('Sesión expirada. Por favor, inicie sesión de nuevo.');
        localStorage.removeItem('token'); // Remover el token inválido
        navigate('/login'); // Redirigir al login
        return;
      }
      if (!response.ok) {
        throw new Error('Error al obtener las parcelas');
      }
      const data = await response.json();
      setParcelas(data);

      // Si venimos desde una parcela específica, la seleccionamos automáticamente
      if (id) {
        const parcela = data.find((p) => p.id === parseInt(id));
        if (parcela) {
          setSelectedParcela(parcela);
        }
      }
      setLoading(false); // Detener el estado de carga cuando se obtienen los datos
    } catch (error) {
      message.error('Error al cargar las parcelas.');
      setLoading(false); // Detener el estado de carga si hay un error
    }
  };

  useEffect(() => {
    fetchParcelas();
  }, [id]);

  // Manejar el cambio de parcela seleccionada (cuando es general)
  const handleParcelaChange = (value) => {
    const parcela = parcelas.find((p) => p.id === value);
    setSelectedParcela(parcela);
  };

  // Al completar el formulario
  const onFinish = async (values) => {
    if (!selectedParcela) {
      message.error('Por favor, seleccione una parcela.');
      return;
    }

    try {
      const token = localStorage.getItem('token'); // Obtener el token del localStorage
      const response = await fetch(`http://localhost:3000/controlesTierra/${selectedParcela.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Incluir el token en la cabecera
        },
        body: JSON.stringify({
          ph_tierra: values.ph,
          condiciones_humedad: values.humedad,
          condiciones_temperatura: values.temperatura,
          observaciones: values.observaciones,
        }),
      });

      if (response.status === 401) {
        // Si la respuesta es 401, redirigir al login
        message.error('Sesión expirada. Por favor, inicie sesión de nuevo.');
        localStorage.removeItem('token'); // Remover el token inválido
        navigate('/login'); // Redirigir al login
        return;
      }

      if (!response.ok) {
        throw new Error('Error al registrar el control de tierra');
      }

      message.success('El control de tierra ha sido registrado exitosamente');
      form.resetFields();
      setSelectedParcela(null);
      navigate('/soil-controls'); // Redirigir al listado de controles de tierra
    } catch (error) {
      message.error('Error al registrar el control de tierra.');
    }
  };

  if (loading) {
    // Mostrar indicador de carga mientras los datos se están obteniendo
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" tip="Cargando parcelas..." />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      {/* Barra de navegación superior */}
      <NavBarMenu defaultSelectedKeys={['2']} />

      {/* Contenido principal */}
      <Content style={{ padding: '24px' }}>
        <Card title="Registrar Control de Tierra" bordered={false} style={{ marginTop: 20 }}>
          <Form
            form={form}
            layout="vertical"
            name="register-soil-control"
            onFinish={onFinish}
          >
            {/* Seleccionar parcela solo si no venimos desde una parcela específica */}
            {!id && (
              <Form.Item
                label="Seleccionar Parcela"
                name="parcela"
                rules={[{ required: true, message: 'Por favor, seleccione una parcela' }]}
              >
                <Select
                  placeholder="Seleccione una parcela"
                  onChange={handleParcelaChange}
                >
                  {parcelas.map((parcela) => (
                    <Select.Option key={parcela.id} value={parcela.id}>
                      {parcela.nombre}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            {/* Acordeones para mostrar información de la parcela y el último control de tierra */}
            {selectedParcela && (
              <Collapse accordion style={{ marginBottom: 20 }}>
                <Panel header="Información de la Parcela" key="1">
                  <Descriptions bordered column={1}>
                    <Descriptions.Item label="Nombre">{selectedParcela.nombre}</Descriptions.Item>
                    <Descriptions.Item label="Longitud (coordenadas)">{selectedParcela.longitud}</Descriptions.Item>
                    <Descriptions.Item label="Latitud (coordenadas)">{selectedParcela.latitud}</Descriptions.Item>
                    <Descriptions.Item label="Ubicación">{selectedParcela.ubicacion}</Descriptions.Item>
                    <Descriptions.Item label="Estado de la Parcela">{selectedParcela.estado}</Descriptions.Item>
                  </Descriptions>
                </Panel>

                <Panel header="Último Control de Tierra" key="2">
                  <Descriptions bordered column={1}>
                    <Descriptions.Item label="PH">{selectedParcela.control_tierra?.ph || 'N/A'}</Descriptions.Item>
                    <Descriptions.Item label="Humedad">{selectedParcela.control_tierra?.humedad || 'N/A'}%</Descriptions.Item>
                    <Descriptions.Item label="Temperatura">{selectedParcela.control_tierra?.temperatura || 'N/A'}°C</Descriptions.Item>
                    <Descriptions.Item label="Observaciones">{selectedParcela.control_tierra?.observaciones || 'N/A'}</Descriptions.Item>
                  </Descriptions>
                </Panel>
              </Collapse>
            )}

            {/* Campos del formulario para ingresar los datos del nuevo control de tierra */}
            <Form.Item
              label="PH de la Tierra"
              name="ph"
              rules={[{ required: true, message: 'Por favor, ingrese el PH de la tierra' }]}
            >
              <InputNumber min={0} max={14} step={0.1} placeholder="PH" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label="Humedad (%)"
              name="humedad"
              rules={[{ required: true, message: 'Por favor, ingrese el porcentaje de humedad' }]}
            >
              <InputNumber min={0} max={100} placeholder="Humedad" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label="Temperatura (°C)"
              name="temperatura"
              rules={[{ required: true, message: 'Por favor, ingrese la temperatura' }]}
            >
              <InputNumber min={-50} max={50} placeholder="Temperatura" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="Observaciones" name="observaciones">
              <Input.TextArea placeholder="Ingrese observaciones" rows={4} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%', backgroundColor: '#8B0000', borderColor: '#8B0000' }}>
                Registrar Control de Tierra
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>

      {/* Footer */}
      <Footer style={{ textAlign: 'center', backgroundColor: '#004d40', color: '#fff' }}>
        Vino Costero ©2024 - Sistema de Control de Producción y Logística
      </Footer>
    </Layout>
  );
};

export default RegisterSoilControl;
