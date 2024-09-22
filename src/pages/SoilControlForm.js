import React, { useState, useEffect } from 'react';
import { Form, InputNumber, Button, Card, Select, Descriptions, Input, message } from 'antd';
import { useParams } from 'react-router-dom';

// Simulación de datos de parcelas existentes
const parcelasExistentes = [
  {
    id: 1,
    nombre: 'Parcela 1',
    dimensionesActuales: {
      superficie: 10,
      longitud: 500,
      anchura: 200,
      pendiente: 15,
    },
    siembras: [{ nombre: 'Siembra 1', tipoUva: 'Chardonnay' }],
    tipoUva: 'Chardonnay',
  },
  {
    id: 2,
    nombre: 'Parcela 2',
    dimensionesActuales: {
      superficie: 8,
      longitud: 400,
      anchura: 150,
      pendiente: 12,
    },
    siembras: [{ nombre: 'Siembra 2', tipoUva: 'Pinot Noir' }],
    tipoUva: 'Pinot Noir',
  },
];

const RegisterSoilControl = () => {
  const [form] = Form.useForm();
  const [selectedParcela, setSelectedParcela] = useState(null);
  const { id } = useParams(); // Capturar ID si venimos desde el botón "Crear Control" específico de una parcela

  // Preseleccionar la parcela si venimos desde una específica
  useEffect(() => {
    if (id) {
      const parcela = parcelasExistentes.find((p) => p.id === parseInt(id));
      if (parcela) {
        setSelectedParcela(parcela);
      }
    }
  }, [id]);

  // Manejar el cambio de parcela seleccionada (cuando es general)
  const handleParcelaChange = (value) => {
    const parcela = parcelasExistentes.find((p) => p.id === value);
    setSelectedParcela(parcela);
  };

  // Al completar el formulario
  const onFinish = (values) => {
    if (!selectedParcela) {
      message.error('Por favor, seleccione una parcela.');
      return;
    }

    // Guardar el nuevo control de tierra
    console.log('Control de Tierra registrado:', {
      parcela: selectedParcela.nombre,
      control: values,
    });

    message.success('El control de tierra ha sido registrado exitosamente');
    form.resetFields();
    setSelectedParcela(null);
  };

  return (
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
              {parcelasExistentes.map((parcela) => (
                <Select.Option key={parcela.id} value={parcela.id}>
                  {parcela.nombre}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {/* Mostrar detalles de la parcela seleccionada */}
        {selectedParcela && (
          <Descriptions title="Detalles de la Parcela Seleccionada" bordered style={{ marginBottom: 20 }}>
            <Descriptions.Item label="Superficie">{selectedParcela.dimensionesActuales.superficie} hectáreas</Descriptions.Item>
            <Descriptions.Item label="Longitud">{selectedParcela.dimensionesActuales.longitud} metros</Descriptions.Item>
            <Descriptions.Item label="Anchura">{selectedParcela.dimensionesActuales.anchura} metros</Descriptions.Item>
            <Descriptions.Item label="Tipo de Uva">{selectedParcela.tipoUva}</Descriptions.Item>
            <Descriptions.Item label="Siembra Actual">{selectedParcela.siembras[0].nombre}</Descriptions.Item>
          </Descriptions>
        )}

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
          <Button type="primary" htmlType="submit">
            Registrar Control de Tierra
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default RegisterSoilControl;
