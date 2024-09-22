import React, { useState, useEffect } from 'react';
import { Form, InputNumber, Button, Card, Select, Descriptions, Input, message, Collapse } from 'antd';
import { useParams } from 'react-router-dom';

const { Panel } = Collapse;

// Simulación de datos de parcelas existentes
const parcelasExistentes = [
  {
    id: 1,
    nombre: 'Parcela 1',
    longitud: '123.456',
    latitud: '456.789',
    ubicacion: 'Valle de Casablanca',
    estado: 'disponible',
    dimensionesActuales: {
      superficie: 10,
      longitud: 500,
      anchura: 200,
      pendiente: 15,
    },
    ultimoControlTierra: {
      ph: 6.5,
      humedad: 35,
      temperatura: 15,
      observaciones: 'Condiciones normales',
      fecha: '2023-07-14',
    },
  },
  {
    id: 2,
    nombre: 'Parcela 2',
    longitud: '123.456',
    latitud: '456.789',
    ubicacion: 'Valle de Casablanca',
    estado: 'disponible',
    dimensionesActuales: {
      superficie: 8,
      longitud: 400,
      anchura: 150,
      pendiente: 12,
    },
    ultimoControlTierra: {
      ph: 6.8,
      humedad: 38,
      temperatura: 18,
      observaciones: 'Condiciones óptimas',
      fecha: '2023-06-28',
    },
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
                <Descriptions.Item label="PH">{selectedParcela.ultimoControlTierra.ph}</Descriptions.Item>
                <Descriptions.Item label="Humedad">{selectedParcela.ultimoControlTierra.humedad}%</Descriptions.Item>
                <Descriptions.Item label="Temperatura">{selectedParcela.ultimoControlTierra.temperatura}°C</Descriptions.Item>
                <Descriptions.Item label="Observaciones">{selectedParcela.ultimoControlTierra.observaciones}</Descriptions.Item>
                <Descriptions.Item label="Fecha">{selectedParcela.ultimoControlTierra.fecha}</Descriptions.Item>
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
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Registrar Control de Tierra
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default RegisterSoilControl;
