import React, { useState, useEffect } from 'react';
import { Layout, Form, InputNumber, Button, Card, Select, DatePicker, Input, Descriptions, message, Collapse, Spin, Row, Col } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import NavBarMenu from './NavBarMenu';
import moment from 'moment';

const { Option } = Select;
const { Panel } = Collapse;
const { Content, Footer } = Layout;

// Función para verificar permisos
const checkPermission = (allowedRoles) => {
  const userRoles = JSON.parse(localStorage.getItem("roles")) || [];
  return Array.isArray(userRoles) ? userRoles.some(role => allowedRoles.includes(role)) : allowedRoles.includes(userRoles);
};

const CreateOrEditSowing = () => {
  const [form] = Form.useForm();
  const { id } = useParams(); // ID de la siembra o parcela
  const [selectedParcela, setSelectedParcela] = useState(null);
  const [parcelas, setParcelas] = useState([]); // Almacena las parcelas obtenidas del backend
  const [tiposDeUva, setTiposDeUva] = useState([]); // Almacena los tipos de uva
  const [siembra, setSiembra] = useState(null); // Detalles de la siembra seleccionada
  const [selectedUva, setSelectedUva] = useState(null); // Detalles del tipo de uva seleccionado
  const [isEditMode, setIsEditMode] = useState(false); // Determina si es modo edición
  const [loading, setLoading] = useState(true); // Estado de carga
  const navigate = useNavigate();

  // Verificar si el usuario tiene el token, sino redirigir a login
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('Debe estar autenticado para acceder a esta página');
      navigate('/login'); // Redirige al login si no hay token
    }
  }, [navigate]);

  // Permisos basados en CU_05
  const canCreateOrEdit = checkPermission([1, 2, 3, 4]); // Administrador del Sistema, Gestor de Producción, Supervisor de Campo, Operador de Campo

  // Redirigir si no tienen permiso para crear o editar
  useEffect(() => {
    if (!canCreateOrEdit) {
      message.error('No tiene permisos para realizar esta acción');
      navigate('/');
    }
  }, [canCreateOrEdit, navigate]);

  useEffect(() => {
    const fetchParcelas = async () => {
      try {
        const token = localStorage.getItem('token'); // Obtener el token del localStorage
        const response = await fetch(`${process.env.BACKEND_HOST}/parcelas`, {
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
        const data = await response.json();
        const parcelasDisponibles = !window.location.pathname.includes('edit-sowing') ? data.filter(parcela => !parcela.siembra_activa) : data;
        setParcelas(parcelasDisponibles);

        if (window.location.pathname.includes('edit-sowing')) {
          setIsEditMode(true);
          await fetchSiembra(parcelasDisponibles);
        }
        await fetchTiposDeUva();
      } catch (error) {
        message.error('Error al cargar las parcelas');
      } finally {
        setLoading(false);
      }
    };

    const fetchTiposDeUva = async () => {
      try {
        const token = localStorage.getItem('token'); // Obtener el token del localStorage
        const response = await fetch(`${process.env.BACKEND_HOST}/tiposUvas`, {
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
        const data = await response.json();
        setTiposDeUva(data);

        // Si ya tienes una siembra cargada, selecciona el tipo de uva una vez que los tipos de uva estén cargados
        if (siembra) {
          const uva = data.find((t) => t.nombre === siembra.tipo_uva);
          setSelectedUva(uva);
        }
      } catch (error) {
        message.error('Error al cargar los tipos de uva');
      }
    };

    const fetchSiembra = async (parcelasDisponibles) => {
      try {
        const token = localStorage.getItem('token'); // Obtener el token del localStorage
        const response = await fetch(`${process.env.BACKEND_HOST}/siembras/${id}`, {
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
        const siembraData = await response.json();
        setSiembra(siembraData);

        const parcela = parcelasDisponibles.find((p) => p.id === siembraData.id_parcela);
        setSelectedParcela(parcela);

        form.setFieldsValue({
          parcela: parcela.id,
          id_tipo_uva: siembraData.tipo_uva,
          fecha_plantacion: moment(siembraData.fecha_plantacion),
          cantidad_plantas: siembraData.cantidad_plantas,
          tecnica_siembra: siembraData.tecnica_siembra,
          observaciones_siembra: siembraData.observaciones_siembra,
        });

        // Cargar tipos de uva después de cargar la siembra
        await fetchTiposDeUva();
      } catch (error) {
        message.error('Error al cargar la siembra');
      }
    };

    fetchParcelas();
  }, [id, form, siembra]);

  const handleParcelaChange = (id_parcela) => {
    const parcela = parcelas.find((p) => p.id === parseInt(id_parcela));
    setSelectedParcela(parcela);
  };

  const handleUvaChange = (nombreUva) => {
    const uva = tiposDeUva.find((t) => t.id === nombreUva);
    if (uva) {
      setSelectedUva(uva);
    }
  };

  const onFinish = async (values) => {
    const token = localStorage.getItem('token'); // Obtener el token del localStorage
    const url = isEditMode
      ? `${process.env.BACKEND_HOST}/siembras/${id}` // Para actualizar siembra existente
      : `${process.env.BACKEND_HOST}/siembras`; // Para crear una nueva siembra
    const method = isEditMode ? 'PUT' : 'POST'; // Determinar el método según el modo

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Incluir el token en la cabecera
        },
        body: JSON.stringify({
          id_parcela: values.parcela,
          id_tipo_uva: values.id_tipo_uva,
          fecha_plantacion: values.fecha_plantacion.format('YYYY-MM-DD'), // Formatear la fecha
          cantidad_plantas: values.cantidad_plantas,
          tecnica_siembra: values.tecnica_siembra,
          observaciones_siembra: values.observaciones_siembra || 'Sin observaciones',
        }),
      });
      if (response.status === 401) {
        // Si la respuesta es 401, redirigir al login
        message.error('Sesión expirada. Por favor, inicie sesión de nuevo.');
        localStorage.removeItem('token'); // Remover el token inválido
        navigate('/login'); // Redirigir al login
        return;
      }

      if (response.ok) {
        const successMessage = isEditMode ? 'Siembra actualizada exitosamente' : 'Siembra registrada exitosamente';
        message.success(successMessage);
        navigate('/sowings'); // Redirigir al listado principal después de guardar
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error) {
      message.error('Hubo un error al procesar la solicitud');
    }
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
      {/* Menú de navegación superior */}
      <NavBarMenu defaultSelectedKeys={['2']} />

      {/* Contenido principal */}
      <Content style={{ padding: '24px' }}>
        <Card title={isEditMode ? 'Modificar Siembra' : 'Registrar Nueva Siembra'} bordered={false} style={{ marginTop: 20, maxWidth: '800px', margin: '0 auto' }}>
          <Form form={form} layout="vertical" name="create-sowing" onFinish={onFinish}>

            {/* Selección de Parcela */}
            <Form.Item
              label="Seleccione Parcela"
              name="parcela"
              rules={[{ required: true, message: 'Por favor, seleccione una parcela' }]}
            >
              <Select
                placeholder="Seleccione una parcela"
                onChange={handleParcelaChange}
                disabled={isEditMode} // Deshabilitar en modo edición
              >
                {parcelas.map((parcela) => (
                  <Option key={parcela.id} value={parcela.id}>
                    {parcela.nombre}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Acordeones para la información de la parcela seleccionada */}
            {selectedParcela && (
              <Collapse accordion style={{ marginBottom: '20px' }}>
                <Panel header={`Detalles de la Parcela: ${selectedParcela.nombre}`} key="1">
                  <Collapse accordion>
                    {/* Acordeón para Dimensiones */}
                    <Panel header="Dimensiones" key="dimensiones">
                      <Descriptions column={2} bordered>
                        <Descriptions.Item label="Superficie">{selectedParcela.dimensiones.superficie} hectáreas</Descriptions.Item>
                        <Descriptions.Item label="Longitud">{selectedParcela.dimensiones.longitud} metros</Descriptions.Item>
                        <Descriptions.Item label="Anchura">{selectedParcela.dimensiones.anchura} metros</Descriptions.Item>
                        <Descriptions.Item label="Pendiente">{selectedParcela.dimensiones.pendiente}%</Descriptions.Item>
                      </Descriptions>
                    </Panel>

                    {/* Acordeón para Control de Tierra */}
                    <Panel header="Último Control de Tierra" key="controlTierra">
                      <Descriptions column={2} bordered>
                        <Descriptions.Item label="PH del Suelo">{selectedParcela.control_tierra?.ph || 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label="Humedad">{selectedParcela.control_tierra?.humedad || 'N/A'}%</Descriptions.Item>
                        <Descriptions.Item label="Temperatura">{selectedParcela.control_tierra?.temperatura || 'N/A'}°C</Descriptions.Item>
                        <Descriptions.Item label="Observaciones">{selectedParcela.control_tierra?.observaciones || 'N/A'}</Descriptions.Item>
                      </Descriptions>
                    </Panel>
                  </Collapse>
                </Panel>
              </Collapse>
            )}

            {/* Tipo de Uva */}
            <Form.Item
              label="Tipo de Uva"
              name="id_tipo_uva"
            // rules={[{ required: true, message: 'Por favor, seleccione el tipo de uva' }]}
            >
              <Select placeholder="Seleccione el tipo de uva" disabled={isEditMode} onChange={handleUvaChange}>
                {tiposDeUva.map((uva, index) => (
                  <Option key={index} value={uva.id}>
                    {uva.nombre}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Detalles del Tipo de Uva Seleccionado */}
            {selectedUva && (
              <Collapse accordion style={{ marginBottom: '20px' }}>
                <Panel header={`Detalles del Tipo de Uva: ${selectedUva.nombre}`} key="uva-details">
                  <Descriptions column={2} bordered>
                    <Descriptions.Item label="PH Requerido">{selectedUva.ph_requerido}</Descriptions.Item>
                    <Descriptions.Item label="Humedad Requerida">{selectedUva.humedad_requerida}%</Descriptions.Item>
                    <Descriptions.Item label="Temperatura Requerida">{selectedUva.temperatura_requerida}°C</Descriptions.Item>
                    <Descriptions.Item label="Tiempo de Cosecha">{selectedUva.tiempoCosecha} días</Descriptions.Item>
                    <Descriptions.Item label="Descripción">{selectedUva.descripcion || 'No disponible'}</Descriptions.Item>
                  </Descriptions>
                </Panel>
              </Collapse>
            )}

            <Row gutter={16}>
              <Col span={12}>
                {/* Fecha de Plantación */}
                <Form.Item
                  label="Fecha de Plantación"
                  name="fecha_plantacion"
                  rules={[{ required: true, message: 'Por favor, seleccione la fecha de plantación' }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                {/* Cantidad de Plantas */}
                <Form.Item
                  label="Cantidad de Plantas"
                  name="cantidad_plantas"
                  rules={[{ required: true, message: 'Por favor, ingrese la cantidad de plantas' }]}
                >
                  <InputNumber min={1} placeholder="Cantidad de Plantas" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                {/* Técnica de Siembra */}
                <Form.Item
                  label="Técnica de Siembra"
                  name="tecnica_siembra"
                  rules={[{ required: true, message: 'Por favor, ingrese la técnica de siembra utilizada' }]}
                >
                  <Input placeholder="Técnica de Siembra (Ej: Siembra directa, Trasplante)" />
                </Form.Item>
              </Col>
            </Row>

            {/* Observaciones de la siembra */}
            <Form.Item
              label="Observaciones"
              name="observaciones_siembra"
            >
              <Input.TextArea rows={4} placeholder="Observaciones sobre la siembra" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%', backgroundColor: '#8B0000', borderColor: '#8B0000' }}>
                {isEditMode ? 'Guardar Cambios' : 'Registrar Siembra'}
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

export default CreateOrEditSowing;
