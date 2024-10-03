import React, { useState, useEffect } from 'react';
import { Layout, Form, Input, InputNumber, Button, Card, Select, message, Collapse, Descriptions, Spin, Row, Col, Typography } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import NavBarMenu from './NavBarMenu';

const { Content, Footer } = Layout;
const { Option } = Select;
const { Panel } = Collapse;
const { Title } = Typography;

// Función para verificar permisos
const checkPermission = (allowedRoles) => {
  const userRoles = JSON.parse(localStorage.getItem("roles")) || [];
  return Array.isArray(userRoles) ? userRoles.some(role => allowedRoles.includes(role)) : allowedRoles.includes(userRoles);
};

const CreateOrEditGrapeType = () => {
  const { id } = useParams(); // Captura el ID del tipo de uva si es edición
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [parcelas, setParcelas] = useState([]); // Estado para las parcelas disponibles
  const [selectedParcels, setSelectedParcels] = useState([]); // Estado para las parcelas seleccionadas
  const [loading, setLoading] = useState(true);

  // Verificar si el usuario tiene el token, sino redirigir a login
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('Debe estar autenticado para acceder a esta página');
      navigate('/login'); // Redirige al login si no hay token
    }
  }, [navigate]);

  // Permisos basados en CU_04
  const canCreateOrEdit = checkPermission([1, 2]);

  // Redirigir si no tienen permiso para crear o editar
  useEffect(() => {
    if (!canCreateOrEdit) {
      message.error('No tiene permisos para realizar esta acción');
      navigate('/');
    }
  }, [canCreateOrEdit, navigate]);

  // Cargar los datos de parcelas y del tipo de uva si es edición
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token'); // Obtener el token del localStorage

        // Obtener todas las parcelas
        const parcelasResponse = await fetch('http://localhost:3000/parcelas', {
          headers: {
            'Authorization': `Bearer ${token}`,  // Incluir el token en la cabecera
            'Content-Type': 'application/json',
          },
        });

        if (parcelasResponse.status === 401) {
          // Si la respuesta es 401, redirigir al login
          message.error('Sesión expirada. Por favor, inicie sesión de nuevo.');
          localStorage.removeItem('token'); // Remover el token inválido
          navigate('/login'); // Redirigir al login
          return;
        }

        const parcelasData = await parcelasResponse.json();
        const filteredParcelas = parcelasData.filter((parcela) => parcela.siembra_activa && !parcela.siembra_activa.tipo_uva);
        setParcelas(filteredParcelas);

        if (id) {
          // Si hay un ID en la URL, estamos en modo de edición
          const tipoUvaResponse = await fetch(`http://localhost:3000/tiposUvas/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,  // Incluir el token en la cabecera
              'Content-Type': 'application/json',
            },
          });

          if (tipoUvaResponse.status === 401) {
            // Si la respuesta es 401, redirigir al login
            message.error('Sesión expirada. Por favor, inicie sesión de nuevo.');
            localStorage.removeItem('token'); // Remover el token inválido
            navigate('/login'); // Redirigir al login
            return;
          }

          const tipoUvaData = await tipoUvaResponse.json();
          setIsEditMode(true);
          form.setFieldsValue({
            nombre: tipoUvaData.nombre,
            descripcion: tipoUvaData.descripcion,
            ph: tipoUvaData.requisito_ph,
            temperatura: tipoUvaData.requisito_temperatura,
            humedad: tipoUvaData.requisito_humedad,
            tiempo_cosecha: tipoUvaData.tiempo_cosecha,
            parcelas: tipoUvaData.parcelas,
          });
          setSelectedParcels(tipoUvaData.parcelas);
        }

        setLoading(false);
      } catch (error) {
        message.error('Error al cargar los datos.');
        setLoading(false);
      }
    };

    fetchData();
  }, [id, form]);

  const onFinish = async (values) => {
    try {
      const token = localStorage.getItem('token'); // Obtener el token del localStorage
      const url = isEditMode
        ? `http://localhost:3000/tiposUvas/${id}`
        : 'http://localhost:3000/tiposUvas';
      const method = isEditMode ? 'PUT' : 'POST';

      const payload = {
        nombre: values.nombre,
        descripcion: values.descripcion,
        ph: values.ph,
        temperatura: values.temperatura,
        humedad: values.humedad,
        tiempoCosecha: values.tiempo_cosecha,
      };

      if (!isEditMode && values.parcelas && values.parcelas.length > 0) {
        payload.parcelas = values.parcelas;
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Incluir el token en la cabecera
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        // Si la respuesta es 401, redirigir al login
        message.error('Sesión expirada. Por favor, inicie sesión de nuevo.');
        localStorage.removeItem('token'); // Remover el token inválido
        navigate('/login'); // Redirigir al login
        return;
      }

      if (!response.ok) {
        throw new Error('Error en el servidor');
      }

      const messageText = isEditMode ? 'Tipo de uva actualizado' : 'Nuevo tipo de uva registrado';
      message.success(`${messageText} exitosamente`);
      navigate('/grape-types');
    } catch (error) {
      message.error('Error al guardar los datos.');
    }
  };

  const renderParcelDetails = (parcelNombre) => {
    const parcela = parcelas.find((p) => p.nombre === parcelNombre);
    if (parcela) {
      return (
        <Collapse accordion key={parcela.id} style={{ marginBottom: '10px' }}>
          <Panel header={`Parcela: ${parcela.nombre}`} key={`parcela-${parcela.id}`}>
            <Collapse accordion>
              {/* Acordeón para las Dimensiones */}
              <Panel header="Dimensiones" key={`dimensiones-${parcela.id}`}>
                <Descriptions column={2} bordered>
                  <Descriptions.Item label="Superficie">{parcela.dimensiones.superficie} hectáreas</Descriptions.Item>
                  <Descriptions.Item label="Longitud">{parcela.dimensiones.longitud} metros</Descriptions.Item>
                  <Descriptions.Item label="Anchura">{parcela.dimensiones.anchura} metros</Descriptions.Item>
                  <Descriptions.Item label="Pendiente">{parcela.dimensiones.pendiente}%</Descriptions.Item>
                </Descriptions>
              </Panel>

              {/* Acordeón para el Último Control de Tierra */}
              <Panel header="Último Control de Tierra" key={`controlTierra-${parcela.id}`}>
                <Descriptions column={2} bordered>
                  <Descriptions.Item label="PH del Suelo">{parcela.control_tierra.ph}</Descriptions.Item>
                  <Descriptions.Item label="Humedad">{parcela.control_tierra.humedad}%</Descriptions.Item>
                  <Descriptions.Item label="Temperatura">{parcela.control_tierra.temperatura}°C</Descriptions.Item>
                  <Descriptions.Item label="Observaciones">{parcela.control_tierra.observaciones}</Descriptions.Item>
                </Descriptions>
              </Panel>

              {/* Acordeón para la Siembra Activa */}
              {parcela.siembra_activa && (
                <Panel header="Siembra Activa" key={`siembra-${parcela.id}`}>
                  <Descriptions column={1} bordered>
                    <Descriptions.Item label="Cantidad de Plantas">{parcela.siembra_activa.cantidad_plantas}</Descriptions.Item>
                    <Descriptions.Item label="Técnica de Siembra">{parcela.siembra_activa.tecnica}</Descriptions.Item>
                    <Descriptions.Item label="Observaciones">{parcela.siembra_activa.observaciones}</Descriptions.Item>
                  </Descriptions>
                </Panel>
              )}
            </Collapse>
          </Panel>
        </Collapse>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" tip="Cargando tipos de uva..." />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      {/* Barra de navegación superior */}
      <NavBarMenu defaultSelectedKeys={['2']} />

      {/* Contenido principal */}
      <Content style={{ padding: '24px', width: '1000px', margin: 'auto' }}>
        <Card title={isEditMode ? 'Modificar Tipo de Uva' : 'Registrar Nuevo Tipo de Uva'} bordered={false} style={{ marginTop: 20 }}>
          <Form form={form} layout="vertical" name="create-edit-grape-type" onFinish={onFinish}>
            {/* Selección de Parcelas */}
            {parcelas && parcelas.length > 0 && (
              <Form.Item label="Seleccionar Parcelas" name="parcelas">
                <Select
                  mode="multiple"
                  placeholder="Seleccione las parcelas"
                  defaultValue={selectedParcels}
                  onChange={setSelectedParcels}
                  disabled={isEditMode}
                >
                  {parcelas.map((parcela) => (
                    <Option key={parcela.id} value={parcela.id}>
                      {parcela.nombre}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            {/* Acordeones para las parcelas seleccionadas */}
            {selectedParcels.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                {selectedParcels.map((parcelaId) => renderParcelDetails(parcelaId))}
              </div>
            )}

            <Form.Item label="Nombre de la Uva" name="nombre" rules={[{ required: true, message: 'Por favor, ingrese el nombre de la uva' }]}>
              <Input placeholder="Nombre de la uva" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Humedad (%)" name="humedad" rules={[{ required: true, message: 'Por favor, ingrese el porcentaje de humedad' }]}>
                  <InputNumber min={0} max={100} placeholder="Humedad" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Temperatura (°C)" name="temperatura" rules={[{ required: true, message: 'Por favor, ingrese la temperatura' }]}>
                  <InputNumber min={0} placeholder="Temperatura" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="PH del Suelo" name="ph" rules={[{ required: true, message: 'Por favor, ingrese el PH del suelo' }]}>
                  <InputNumber min={0} max={14} placeholder="PH del suelo" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Tiempo de Cosecha (días)" name="tiempo_cosecha" rules={[{ required: true, message: 'Por favor, ingrese el tiempo estimado de cosecha' }]}>
                  <InputNumber min={1} placeholder="Tiempo de cosecha" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Descripción" name="descripcion" rules={[{ required: true, message: 'Por favor, ingrese una descripción' }]}>
              <Input.TextArea placeholder="Descripción de la uva" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%', backgroundColor: '#8B0000', borderColor: '#8B0000' }}>
                {isEditMode ? 'Guardar Cambios' : 'Registrar Uva'}
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

export default CreateOrEditGrapeType;
