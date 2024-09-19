import React, { useEffect } from 'react';
import { Form, Input, Button, InputNumber, message, Card, Divider } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';

// Simulación de datos existentes para edición
const parcelasExistentes = [
  {
    id: 1,
    nombre: 'Parcela 1',
    longitud: '-70.123456',
    latitud: '-33.456789',
    ubicacion: 'Fundo El Olivo',
    superficie: 10,
    dim_longitud: 500,
    dim_anchura: 200,
    pendiente: 15,
    ph: 6.5,
    humedad: 35,
    temperatura: 18,
    observaciones: 'Suelo ideal para Chardonnay',
  },
  {
    id: 2,
    nombre: 'Parcela 2',
    longitud: '-70.654321',
    latitud: '-33.123456',
    ubicacion: 'Fundo La Escondida',
    superficie: 8,
    dim_longitud: 400,
    dim_anchura: 150,
    pendiente: 12,
    ph: 7,
    humedad: 40,
    temperatura: 20,
    observaciones: 'Ideal para Sauvignon Blanc',
  },
];

const ParcelForm = () => {
  const [form] = Form.useForm();
  const { id } = useParams(); // Para identificar si estamos editando o creando
  const navigate = useNavigate();

  const isEditing = Boolean(id); // Si hay un id en la URL, estamos editando
  const parcela = isEditing ? parcelasExistentes.find((p) => p.id === parseInt(id)) : null;

  useEffect(() => {
    if (isEditing && parcela) {
      form.setFieldsValue(parcela); // Cargar los valores de la parcela en el formulario si estamos editando
    }
  }, [isEditing, parcela, form]);

  const onFinish = (values) => {
    if (isEditing) {
      // Simulación de actualización de parcela
      console.log('Parcela actualizada:', values);
      message.success('La parcela ha sido actualizada exitosamente');
    } else {
      // Simulación de creación de parcela
      console.log('Parcela creada:', values);
      message.success('La parcela ha sido registrada exitosamente');
    }
    navigate('/'); // Redirige al listado principal después de guardar
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Error:', errorInfo);
    message.error('Hubo un error al procesar la solicitud');
  };

  return (
    <Card title={isEditing ? `Editar Parcela` : `Registrar Nueva Parcela`} bordered={false} style={{ width: 800, margin: '0 auto', marginTop: 50 }}>
      <Form
        form={form}
        layout="vertical"
        name="parcel-form"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
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
          rules={[{ required: true, message: 'Por favor, ingrese la longitud de la parcela' }]}
        >
          <Input placeholder="Longitud" />
        </Form.Item>

        <Form.Item
          label="Latitud (coordenadas)"
          name="latitud"
          rules={[{ required: true, message: 'Por favor, ingrese la latitud de la parcela' }]}
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
        
        {!isEditing && (
          <>
            <Divider>Dimensiones de la Parcela</Divider>

            <Form.Item
              label="Superficie (hectáreas)"
              name="superficie"
              rules={[{ required: true, message: 'Por favor, ingrese la superficie de la parcela' }]}
            >
              <InputNumber min={0} placeholder="Superficie" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label="Longitud (metros)"
              name="dim_longitud"
              rules={[{ required: true, message: 'Por favor, ingrese la longitud de la parcela en metros' }]}
            >
              <InputNumber min={0} placeholder="Longitud" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label="Anchura (metros)"
              name="dim_anchura"
              rules={[{ required: true, message: 'Por favor, ingrese la anchura de la parcela en metros' }]}
            >
              <InputNumber min={0} placeholder="Anchura" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label="Pendiente (%)"
              name="pendiente"
              rules={[{ required: true, message: 'Por favor, ingrese la pendiente de la parcela en porcentaje' }]}
            >
              <InputNumber min={0} max={100} placeholder="Pendiente" style={{ width: '100%' }} />
            </Form.Item>

            <Divider>Control de Tierra</Divider>

            <Form.Item
              label="PH de la tierra"
              name="ph"
              rules={[{ required: true, message: 'Por favor, ingrese el PH de la tierra' }]}
            >
              <InputNumber min={0} max={14} step={0.1} placeholder="PH de la tierra" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label="Humedad del suelo (%)"
              name="humedad"
              rules={[{ required: true, message: 'Por favor, ingrese el porcentaje de humedad del suelo' }]}
            >
              <InputNumber min={0} max={100} placeholder="Humedad" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label="Temperatura del suelo (°C)"
              name="temperatura"
              rules={[{ required: true, message: 'Por favor, ingrese la temperatura del suelo' }]}
            >
              <InputNumber min={-50} max={50} placeholder="Temperatura" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="Observaciones" name="observaciones">
              <Input.TextArea rows={4} placeholder="Observaciones sobre el control de tierra" />
            </Form.Item>
          </>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {isEditing ? 'Actualizar Parcela' : 'Registrar Parcela'}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ParcelForm;
