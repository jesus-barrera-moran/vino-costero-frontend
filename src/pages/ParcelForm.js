import React, { useEffect } from 'react';
import { Form, Input, Button, InputNumber, message, Card, Collapse, Select } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';

const { Panel } = Collapse;
const { Option } = Select;

// Simulación de datos existentes para edición
const parcelasExistentes = [
  {
    id: 1,
    nombre: 'Parcela 1',
    longitud: '-70.123456',
    latitud: '-33.456789',
    ubicacion: 'Fundo El Olivo',
    estado_parcela: 'Con siembra activa',
    dimensiones: {
      superficie: 10,
      dim_longitud: 500,
      dim_anchura: 200,
      pendiente: 15,
    },
    control_tierra: {
      ph: 6.5,
      humedad: 35,
      temperatura: 18,
      observaciones: 'Suelo ideal para Chardonnay',
    },
  },
  {
    id: 2,
    nombre: 'Parcela 2',
    longitud: '-70.654321',
    latitud: '-33.123456',
    ubicacion: 'Fundo La Escondida',
    estado_parcela: 'Disponible',
    dimensiones: {
      superficie: 8,
      dim_longitud: 400,
      dim_anchura: 150,
      pendiente: 12,
    },
    control_tierra: {
      ph: 7,
      humedad: 40,
      temperatura: 20,
      observaciones: 'Ideal para Sauvignon Blanc',
    },
  },
];

// Estados disponibles para la parcela
const estadosParcelas = ['Disponible', 'Con siembra activa', 'En mantenimiento'];

const ParcelForm = () => {
  const [form] = Form.useForm();
  const { id } = useParams(); // Para identificar si estamos editando o creando
  const navigate = useNavigate();

  const isEditing = Boolean(id); // Si hay un id en la URL, estamos editando
  const parcela = isEditing ? parcelasExistentes.find((p) => p.id === parseInt(id)) : null;

  useEffect(() => {
    if (isEditing && parcela) {
      // Separar valores de parcela y dimensiones/control de tierra para el formulario
      form.setFieldsValue({
        nombre: parcela.nombre,
        longitud: parcela.longitud,
        latitud: parcela.latitud,
        ubicacion: parcela.ubicacion,
        estado_parcela: parcela.estado_parcela,
        dimensiones: parcela.dimensiones,
        control_tierra: parcela.control_tierra,
      });
    }
  }, [isEditing, parcela, form]);

  const onFinish = (values) => {
    if (isEditing) {
      console.log('Parcela actualizada:', values);
      message.success('La parcela ha sido actualizada exitosamente');
    } else {
      console.log('Parcela creada:', values);
      message.success('La parcela ha sido registrada exitosamente');
    }
    navigate('/'); // Redirige al listado principal después de guardar
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Error:', errorInfo);
    message.error('Hubo un error al procesar la solicitud');
  };

  const isDimensionEditable = !isEditing || parcela?.estado_parcela === 'Disponible';
  const isControlEditable = !isEditing || parcela?.estado_parcela === 'Disponible';

  return (
    <Card title={isEditing ? `Editar Parcela` : `Registrar Nueva Parcela`} bordered={false} style={{ width: 800, margin: '0 auto', marginTop: 50 }}>
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
              name={['dimensiones', 'dim_longitud']}
              rules={[{ required: true, message: 'Por favor, ingrese la longitud de la parcela en metros' }]}
            >
              <InputNumber disabled={!isDimensionEditable} min={0} placeholder="Longitud" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label="Anchura (metros)"
              name={['dimensiones', 'dim_anchura']}
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
          <Panel header="Control de Tierra" key="2">
            <Form.Item
              label="PH de la tierra"
              name={['control_tierra', 'ph']}
              rules={[{ required: true, message: 'Por favor, ingrese el PH de la tierra' }]}
            >
              <InputNumber disabled={!isControlEditable} min={0} max={14} step={0.1} placeholder="PH de la tierra" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label="Humedad del suelo (%)"
              name={['control_tierra', 'humedad']}
              rules={[{ required: true, message: 'Por favor, ingrese el porcentaje de humedad del suelo' }]}
            >
              <InputNumber disabled={!isControlEditable} min={0} max={100} placeholder="Humedad" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label="Temperatura del suelo (°C)"
              name={['control_tierra', 'temperatura']}
              rules={[{ required: true, message: 'Por favor, ingrese la temperatura del suelo' }]}
            >
              <InputNumber disabled={!isControlEditable} min={-50} max={50} placeholder="Temperatura" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="Observaciones" name={['control_tierra', 'observaciones']}>
              <Input.TextArea disabled={!isControlEditable} rows={4} placeholder="Observaciones sobre el control de tierra" />
            </Form.Item>
          </Panel>
        </Collapse>

        <Form.Item style={{ marginTop: 20 }}>
          <Button type="primary" htmlType="submit">
            {isEditing ? 'Actualizar Parcela' : 'Registrar Parcela'}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ParcelForm;
