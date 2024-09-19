import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Card, Select, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

const { Option } = Select;

// Simulación de datos de parcelas
const parcelasExistentes = [
  { id: 1, nombre: 'Parcela 1' },
  { id: 2, nombre: 'Parcela 2' },
];

const tiposUvaExistentes = [
  {
    id: 1,
    nombre: 'Chardonnay',
    descripcion: 'Uva blanca famosa por su versatilidad en la elaboración de vinos blancos.',
    requisitosSuelo: {
      ph: 6.0,
      nutrientes: 'Moderados',
      humedad: '30-35%',
    },
    tiempoCosecha: 120,
    parcelas: [1],
  },
];

const CreateOrEditGrapeType = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedParcels, setSelectedParcels] = useState([]);

  useEffect(() => {
    if (id) {
      const tipoUva = tiposUvaExistentes.find((uva) => uva.id === parseInt(id));
      if (tipoUva) {
        setIsEditMode(true);
        form.setFieldsValue({
          nombre: tipoUva.nombre,
          descripcion: tipoUva.descripcion,
          ph: tipoUva.requisitosSuelo.ph,
          nutrientes: tipoUva.requisitosSuelo.nutrientes,
          humedad: tipoUva.requisitosSuelo.humedad,
          tiempoCosecha: tipoUva.tiempoCosecha,
          parcelas: tipoUva.parcelas,
        });
        setSelectedParcels(tipoUva.parcelas);
      }
    }
  }, [id, form]);

  const onFinish = (values) => {
    if (isEditMode) {
      console.log('Tipo de uva actualizado:', values);
      message.success('Tipo de uva actualizado exitosamente');
    } else {
      console.log('Nuevo tipo de uva registrado:', values);
      message.success('Nuevo tipo de uva registrado exitosamente');
    }
    navigate('/');
  };

  return (
    <Card title={isEditMode ? 'Modificar Tipo de Uva' : 'Registrar Nuevo Tipo de Uva'} bordered={false} style={{ marginTop: 20 }}>
      <Form form={form} layout="vertical" name="create-edit-grape-type" onFinish={onFinish}>
        <Form.Item
          label="Nombre de la Uva"
          name="nombre"
          rules={[{ required: true, message: 'Por favor, ingrese el nombre de la uva' }]}
        >
          <Input placeholder="Nombre de la uva" />
        </Form.Item>

        <Form.Item
          label="Descripción"
          name="descripcion"
          rules={[{ required: true, message: 'Por favor, ingrese una descripción' }]}
        >
          <Input.TextArea placeholder="Descripción de la uva" />
        </Form.Item>

        <Form.Item
          label="PH del Suelo"
          name="ph"
          rules={[{ required: true, message: 'Por favor, ingrese el PH del suelo' }]}
        >
          <InputNumber min={0} max={14} placeholder="PH del suelo" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Nutrientes Requeridos"
          name="nutrientes"
          rules={[{ required: true, message: 'Por favor, ingrese los nutrientes requeridos' }]}
        >
          <Input placeholder="Nutrientes requeridos" />
        </Form.Item>

        <Form.Item
          label="Humedad (%)"
          name="humedad"
          rules={[{ required: true, message: 'Por favor, ingrese el porcentaje de humedad' }]}
        >
          <InputNumber min={0} max={100} placeholder="Humedad" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Tiempo de Cosecha (días)"
          name="tiempoCosecha"
          rules={[{ required: true, message: 'Por favor, ingrese el tiempo estimado de cosecha' }]}
        >
          <InputNumber min={1} placeholder="Tiempo de cosecha" style={{ width: '100%' }} />
        </Form.Item>

        {/* Selección de Parcelas */}
        <Form.Item
          label="Seleccionar Parcelas"
          name="parcelas"
          rules={[{ required: false }]}
        >
          <Select
            mode="multiple"
            placeholder="Seleccione las parcelas"
            defaultValue={selectedParcels}
            onChange={setSelectedParcels}
          >
            {parcelasExistentes.map((parcela) => (
              <Option key={parcela.id} value={parcela.id}>
                {parcela.nombre}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {isEditMode ? 'Guardar Cambios' : 'Registrar Uva'}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateOrEditGrapeType;
