import React, { useEffect, useState } from 'react';
import { Form, Input, Button, InputNumber, message, Card, Collapse, Select, Spin } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';

const { Panel } = Collapse;
const { Option } = Select;

// Estados disponibles para la parcela
const estadosParcelas = ['Disponible', 'Ocupada'];

// Función para verificar permisos
const checkPermission = (allowedRoles) => {
  const userRoles = JSON.parse(localStorage.getItem("roles")) || [];
  return Array.isArray(userRoles) ? userRoles.some(role => allowedRoles.includes(role)) : allowedRoles.includes(userRoles);
};

const ParcelForm = () => {
  const [form] = Form.useForm();
  const { id } = useParams(); // Para identificar si estamos editando o creando
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false); // Estado de carga para la petición
  const [loadingData, setLoadingData] = useState(false); // Estado de carga para los datos de la parcela
  const isEditing = Boolean(id); // Si hay un id en la URL, estamos editando

  // Verificar si el usuario tiene el token, sino redirigir a login
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('Debe estar autenticado para acceder a esta página');
      navigate('/login'); // Redirige al login si no hay token
    }
  }, [navigate]);

  // Verificar permisos basados en el CU_01
  const canCreate = checkPermission([1, 2, 3, 4]); // Administrador del Sistema, Gestor de Producción, Supervisor de Campo
  const canEdit = checkPermission([1, 2, 3, 4]);      // Administrador del Sistema, Gestor de Producción
  const canView = checkPermission([1, 2, 3, 4, 5]); // Todos pueden consultar

  // Redirigir si no tienen permiso para ver
  useEffect(() => {
    if (!canView) {
      message.error('No tiene permisos para ver esta página');
      navigate('/');
    }
  }, [canView, navigate]);

  // Cargar los datos de la parcela si estamos en modo de edición
  useEffect(() => {
    const token = localStorage.getItem('token'); // Obtener el token del localStorage
    if (isEditing) {
      setLoadingData(true);
      fetch(`http://localhost:3000/parcelas/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Incluir el token en la cabecera de autorización
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          form.setFieldsValue({
            nombre: data.nombre,
            longitud: data.longitud,
            latitud: data.latitud,
            ubicacion: data.ubicacion,
            estado_parcela: data.estado,
            dimensiones: data.dimensiones,
            control_tierra: data.control_tierra,
          });
          setLoadingData(false); // Desactivar el estado de carga de datos
        })
        .catch((error) => {
          message.error('Error al cargar los datos de la parcela');
          setLoadingData(false); // Desactivar el estado de carga de datos en caso de error
        });
    }
  }, [isEditing, id, form]);

  // Función para manejar el submit del formulario
  const onFinish = async (values) => {
    const token = localStorage.getItem('token'); // Obtener el token del localStorage
    const url = isEditing
      ? `http://localhost:3000/parcelas/${id}` // Para editar
      : 'http://localhost:3000/parcelas'; // Para crear

    const method = isEditing ? 'PUT' : 'POST'; // Elegir el método de la solicitud

    setLoading(true); // Activamos el estado de carga

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Incluir el token en la cabecera de autorización
        },
        body: JSON.stringify({
          nombre_parcela: values.nombre,
          ubicacion_descripcion: values.ubicacion,
          ubicacion_longitud: values.longitud,
          ubicacion_latitud: values.latitud,
          id_estado_parcela: estadosParcelas.indexOf(values.estado_parcela) + 1, // Convertimos a ID (asumiendo que en la base de datos los IDs son 1, 2, 3)
          dimensiones: values.dimensiones,
          control_tierra: values.control_tierra,
        }),
      });

      if (response.ok) {
        const messageText = isEditing ? 'La parcela ha sido actualizada exitosamente' : 'La parcela ha sido registrada exitosamente';
        message.success(messageText);
        navigate('/parcels'); // Redirige al listado principal después de guardar
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error) {
      message.error('Hubo un error al procesar la solicitud');
    } finally {
      setLoading(false); // Desactivamos el estado de carga
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Error:', errorInfo);
    message.error('Hubo un error al procesar la solicitud');
  };

  const isDimensionEditable = !isEditing || form.getFieldValue('estado_parcela') === 'Disponible';

  return (
    <Card title={isEditing ? `Editar Parcela` : `Registrar Nueva Parcela`} bordered={false} style={{ width: 800, margin: '0 auto', marginTop: 50 }}>
      {loadingData ? (
        <Spin tip="Cargando datos..." />
      ) : (
        <Form
          form={form}
          layout="vertical"
          name="parcel-form"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          {/* Datos generales de la parcela */}
          <Form.Item
            label="Nombre de la parcela"
            name="nombre"
            rules={[{ required: true, message: 'Por favor, ingrese el nombre de la parcela' }]}
          >
            <Input placeholder="Nombre de la parcela" disabled={isEditing && !canEdit} />
          </Form.Item>

          <Form.Item
            label="Longitud (coordenadas)"
            name="longitud"
            rules={[{ required: true, message: 'Por favor, ingrese la longitud (coordenadas) de la parcela' }]}
          >
            <Input placeholder="Longitud" disabled={isEditing && !canEdit} />
          </Form.Item>

          <Form.Item
            label="Latitud (coordenadas)"
            name="latitud"
            rules={[{ required: true, message: 'Por favor, ingrese la latitud (coordenadas) de la parcela' }]}
          >
            <Input placeholder="Latitud" disabled={isEditing && !canEdit} />
          </Form.Item>

          <Form.Item
            label="Ubicación"
            name="ubicacion"
            rules={[{ required: true, message: 'Por favor, ingrese la ubicación de la parcela' }]}
          >
            <Input placeholder="Descripción de la ubicación" disabled={isEditing && !canEdit} />
          </Form.Item>

          {/* Dropdown para cambiar el estado de la parcela */}
          <Form.Item
            label="Estado de la Parcela"
            name="estado_parcela"
            rules={[{ required: true, message: 'Por favor, seleccione el estado de la parcela' }]}
          >
            <Select placeholder="Seleccione el estado de la parcela" disabled={isEditing && !canEdit}>
              {estadosParcelas.map((estado) => (
                <Option key={estado} value={estado}>
                  {estado}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Collapse defaultActiveKey={['1']} accordion>
            {/* Sección de Dimensiones */}
            <Panel header="Dimensiones de la Parcela" key="1">
              <Form.Item
                label="Superficie (hectáreas)"
                name={['dimensiones', 'superficie']}
                rules={[{ required: true, message: 'Por favor, ingrese la superficie de la parcela' }]}
              >
                <InputNumber disabled={!isDimensionEditable} min={0} placeholder="Superficie" style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                label="Longitud (metros)"
                name={['dimensiones', 'longitud']}
                rules={[{ required: true, message: 'Por favor, ingrese la longitud de la parcela en metros' }]}
              >
                <InputNumber disabled={!isDimensionEditable} min={0} placeholder="Longitud" style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                label="Anchura (metros)"
                name={['dimensiones', 'anchura']}
                rules={[{ required: true, message: 'Por favor, ingrese la anchura de la parcela en metros' }]}
              >
                <InputNumber disabled={!isDimensionEditable} min={0} placeholder="Anchura" style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                label="Pendiente (%)"
                name={['dimensiones', 'pendiente']}
                rules={[{ required: true, message: 'Por favor, ingrese la pendiente de la parcela en porcentaje' }]}
              >
                <InputNumber disabled={!isDimensionEditable} min={0} max={100} placeholder="Pendiente" style={{ width: '100%' }} />
              </Form.Item>
            </Panel>

            {/* Sección de Control de Tierra */}
            {!isEditing && canCreate && (
              <Panel header="Control de Tierra" key="2">
                <Form.Item
                  label="PH de la tierra"
                  name={['control_tierra', 'ph']}
                  rules={[{ required: true, message: 'Por favor, ingrese el PH de la tierra' }]}
                >
                  <InputNumber min={0} max={14} step={0.1} placeholder="PH de la tierra" style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  label="Humedad del suelo (%)"
                  name={['control_tierra', 'humedad']}
                  rules={[{ required: true, message: 'Por favor, ingrese el porcentaje de humedad del suelo' }]}
                >
                  <InputNumber min={0} max={100} placeholder="Humedad" style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  label="Temperatura del suelo (°C)"
                  name={['control_tierra', 'temperatura']}
                  rules={[{ required: true, message: 'Por favor, ingrese la temperatura del suelo' }]}
                >
                  <InputNumber min={-50} max={50} placeholder="Temperatura" style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item label="Observaciones" name={['control_tierra', 'observaciones']}>
                  <Input.TextArea rows={4} placeholder="Observaciones sobre el control de tierra" />
                </Form.Item>
              </Panel>
            )}
          </Collapse>

          <Form.Item style={{ marginTop: 20 }}>
            <Button type="primary" htmlType="submit" loading={loading} disabled={!canCreate && !canEdit}>
              {isEditing ? 'Actualizar Parcela' : 'Registrar Parcela'}
            </Button>
          </Form.Item>
        </Form>
      )}
    </Card>
  );
};

export default ParcelForm;
