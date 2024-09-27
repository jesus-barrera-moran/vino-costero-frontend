import React, { useEffect, useState } from 'react';
import { Form, Input, Button, InputNumber, message, Card, Collapse, Select, Spin } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';

const { Panel } = Collapse;
const { Option } = Select;

// Estados disponibles para la parcela
const estadosParcelas = ['Disponible', 'Ocupada'];

const ParcelForm = () => {
  const [form] = Form.useForm();
  const { id } = useParams(); // Para identificar si estamos editando o creando
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false); // Estado de carga para la petición
  const [loadingData, setLoadingData] = useState(false); // Estado de carga para los datos de la parcela
  const isEditing = Boolean(id); // Si hay un id en la URL, estamos editando

  // Cargar los datos de la parcela si estamos en modo de edición
  useEffect(() => {
    if (isEditing) {
      setLoadingData(true);
      fetch(`http://localhost:3000/parcelas/${id}`) // Ajusta la URL según tu configuración
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
            <Input placeholder="Nombre de la parcela" />
          </Form.Item>

          <Form.Item
            label="Longitud (coordenadas)"
            name="longitud"
            rules={[{ required: true, message: 'Por favor, ingrese la longitud (coordenadas) de la parcela' }]}
          >
            <Input placeholder="Longitud" />
          </Form.Item>

          <Form.Item
            label="Latitud (coordenadas)"
            name="latitud"
            rules={[{ required: true, message: 'Por favor, ingrese la latitud (coordenadas) de la parcela' }]}
          >
            <Input placeholder="Latitud" />
          </Form.Item>

          <Form.Item
            label="Ubicación"
            name="ubicacion"
            rules={[{ required: true, message: 'Por favor, ingrese la ubicación de la parcela' }]}
          >
            <Input placeholder="Descripción de la ubicación" />
          </Form.Item>

          {/* Dropdown para cambiar el estado de la parcela */}
          <Form.Item
            label="Estado de la Parcela"
            name="estado_parcela"
            rules={[{ required: true, message: 'Por favor, seleccione el estado de la parcela' }]}
          >
            <Select placeholder="Seleccione el estado de la parcela">
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
            {!isEditing && (
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
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEditing ? 'Actualizar Parcela' : 'Registrar Parcela'}
            </Button>
          </Form.Item>
        </Form>
      )}
    </Card>
  );
};

export default ParcelForm;
