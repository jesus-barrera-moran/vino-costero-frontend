import React, { useState, useEffect } from 'react';
import { Layout, Form, InputNumber, Button, Card, Descriptions, Collapse, Alert, message, Spin, Row, Col } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import NavBarMenu from './NavBarMenu';

const { Header, Content, Footer } = Layout;
const { Panel } = Collapse;

const { BACKEND_HOST } = require('../config/config');

// Función para calcular el área ocupada
const calcularAreaOcupada = (longitud, anchura) => {
  return (longitud * anchura) / 10000; // Convertir de m² a hectáreas
};

// Función para verificar permisos
const checkPermission = (allowedRoles) => {
  const userRoles = JSON.parse(localStorage.getItem("roles")) || [];
  return Array.isArray(userRoles) ? userRoles.some(role => allowedRoles.includes(role)) : allowedRoles.includes(userRoles);
};

const EditParcelDimensions = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [parcela, setParcela] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga
  const [areaOcupada, setAreaOcupada] = useState(0);
  const [porcentajeOcupado, setPorcentajeOcupado] = useState(0);
  const [warning, setWarning] = useState('');

  // Verificar si el usuario tiene el token, sino redirigir a login
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('Debe estar autenticado para acceder a esta página');
      navigate('/login'); // Redirige al login si no hay token
    }
  }, [navigate]);

  // Permisos basados en CU_02
  const canEdit = checkPermission([1, 3]);
  const canView = checkPermission([1, 3, 5]);

  // Redirigir si no tienen permiso para ver
  useEffect(() => {
    if (!canView) {
      message.error('No tiene permisos para ver esta página');
      navigate('/');
    }
  }, [canView, navigate]);

  // Función para obtener los detalles de la parcela desde el backend
  const fetchParcela = async () => {
    try {
      const token = localStorage.getItem('token'); // Obtener el token del localStorage
      const response = await fetch(`${BACKEND_HOST}/parcelas/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,  // Incluir el token en la cabecera
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 401) {
        // Si la respuesta es 401, redirigir al login
        message.error('Sesión expirada. Por favor, inicie sesión de nuevo.');
        localStorage.removeItem('token'); // Remover el token inválido
        navigate('/login'); // Redirigir al login
        return;
      }
      if (!response.ok) {
        throw new Error('Error al obtener los detalles de la parcela');
      }
      const data = await response.json();
      setParcela(data);

      const { longitud, anchura, superficie } = data.dimensiones;
      const area = calcularAreaOcupada(longitud, anchura);
      setAreaOcupada(area);
      setPorcentajeOcupado(((area / superficie) * 100).toFixed(2));
      form.setFieldsValue({
        superficie: superficie,
        longitud: longitud,
        anchura: anchura,
        pendiente: data.dimensiones.pendiente,
      });
      setLoading(false);
    } catch (error) {
      message.error('Error al cargar la parcela');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParcela();
  }, [id, form]);

  // Función para manejar los cambios en las dimensiones
  const handleDimensionChange = () => {
    const { longitud, anchura } = form.getFieldsValue(['longitud', 'anchura']);
    if (longitud && anchura) {
      const area = calcularAreaOcupada(longitud, anchura);
      setAreaOcupada(area);
      const superficie = form.getFieldValue('superficie');
      const porcentaje = ((area / superficie) * 100).toFixed(2);
      setPorcentajeOcupado(porcentaje);

      // Advertencia si el área ocupada supera el 100%
      if (porcentaje > 100) {
        setWarning('El área ocupada supera la superficie total de la parcela.');
      } else {
        setWarning('');
      }
    }
  };

  // Función para manejar el envío del formulario
  const onFinish = async (values) => {
    try {
      const token = localStorage.getItem('token'); // Obtener el token del localStorage
      const response = await fetch(`${BACKEND_HOST}/dimensiones/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Incluir el token en la cabecera
        },
        body: JSON.stringify({
          superficie: values.superficie,
          longitud: values.longitud,
          anchura: values.anchura,
          pendiente: values.pendiente,
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
        throw new Error('Error al actualizar las dimensiones');
      }
      message.success('Las dimensiones se han actualizado exitosamente');
      navigate('/dimensions');
    } catch (error) {
      message.error('Hubo un error al actualizar las dimensiones');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" tip="Cargando tipos de uva..." />
      </div>
    );
  }

  if (!parcela) {
    return null;
  }

  // Validación: Si la parcela no está disponible, no permitimos la edición
  const esParcelaDisponible = parcela.estado.toLowerCase() === 'disponible';

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      {/* Barra de navegación superior */}
      <NavBarMenu defaultSelectedKeys={['2']} />

      {/* Contenido principal */}
      <Content style={{ padding: '24px' }}>
        <Card title={`Editar Dimensiones de ${parcela.nombre}`} bordered={false} style={{ marginTop: 20, maxWidth: '800px', margin: '0 auto' }}>
          {/* Formulario para editar dimensiones */}
          <Form
            form={form}
            layout="vertical"
            name="edit-dimensions"
            onFinish={onFinish}
            onValuesChange={handleDimensionChange}
            style={{ marginBottom: 30 }}
            disabled={!canEdit || !esParcelaDisponible} // Deshabilitar si no tiene permisos o la parcela no está disponible
          >

            {!esParcelaDisponible && (
              <Alert
                message="No es posible editar las dimensiones de una parcela que no está disponible."
                type="error"
                showIcon
                style={{ marginBottom: 30 }}
              />
            )}

            {/* Acordeones para información adicional de la parcela */}
            <Collapse accordion style={{ marginBottom: '10px' }}>
              <Panel header="Información General de la Parcela" key="1">
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Nombre">{parcela.nombre}</Descriptions.Item>
                  <Descriptions.Item label="Longitud (coordenadas)">{parcela.longitud}</Descriptions.Item>
                  <Descriptions.Item label="Latitud (coordenadas)">{parcela.latitud}</Descriptions.Item>
                  <Descriptions.Item label="Ubicación">{parcela.ubicacion}</Descriptions.Item>
                  <Descriptions.Item label="Estado de la Parcela">{parcela.estado}</Descriptions.Item>
                </Descriptions>
              </Panel>

              <Panel header="Dimensiones Actuales" key="2">
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Superficie">{parcela.dimensiones.superficie} hectáreas</Descriptions.Item>
                  <Descriptions.Item label="Longitud">{parcela.dimensiones.longitud} metros</Descriptions.Item>
                  <Descriptions.Item label="Anchura">{parcela.dimensiones.anchura} metros</Descriptions.Item>
                  <Descriptions.Item label="Pendiente">{parcela.dimensiones.pendiente}%</Descriptions.Item>
                </Descriptions>
              </Panel>
            </Collapse>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Superficie (hectáreas)"
                  name="superficie"
                  rules={[{ required: true, message: 'Por favor, ingrese la superficie de la parcela' }]}
                >
                  <InputNumber min={0} placeholder="Superficie" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Longitud (metros)"
                  name="longitud"
                  rules={[{ required: true, message: 'Por favor, ingrese la longitud de la parcela' }]}
                >
                  <InputNumber min={0} placeholder="Longitud" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Anchura (metros)"
                  name="anchura"
                  rules={[{ required: true, message: 'Por favor, ingrese la anchura de la parcela' }]}
                >
                  <InputNumber min={0} placeholder="Anchura" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Pendiente (%)"
                  name="pendiente"
                  rules={[{ required: true, message: 'Por favor, ingrese la pendiente de la parcela' }]}
                >
                  <InputNumber min={0} max={100} placeholder="Pendiente" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            {warning && <Alert message={warning} type="warning" showIcon style={{ marginBottom: 20 }} />}

            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#8B0000', borderColor: '#8B0000' }} disabled={!canEdit || !esParcelaDisponible}>
                Guardar Cambios
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

export default EditParcelDimensions;
