import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Card, Select, message, Collapse, Descriptions } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

const { Option } = Select;
const { Panel } = Collapse;

// Simulación de datos de parcelas con siembras activas
const parcelasExistentes = [
  {
    id: 1,
    nombre: 'Parcela 1',
    dimensiones: {
      superficie: 10,
      longitud: 500,
      anchura: 200,
      pendiente: 15,
    },
    controlTierra: {
      ph: 6.2,
      humedad: 32,
      temperatura: 18,
      observaciones: 'Condiciones normales',
    },
    siembraActiva: {
      fechaPlantacion: '2023-05-10',
      cantidadPlantas: 1000,
      tecnica: 'Siembra directa',
      observaciones: 'Observaciones de la siembra...',
    },
  },
  {
    id: 2,
    nombre: 'Parcela 2',
    dimensiones: {
      superficie: 12,
      longitud: 600,
      anchura: 250,
      pendiente: 18,
    },
    controlTierra: {
      ph: 6.5,
      humedad: 36,
      temperatura: 19,
      observaciones: 'Condiciones óptimas',
    },
    siembraActiva: {
      fechaPlantacion: '2023-04-20',
      cantidadPlantas: 1200,
      tecnica: 'Trasplante',
      observaciones: 'Observaciones de la siembra...',
    },
  },
];

// Simulación de datos de tipos de uva existentes
const tiposUvaExistentes = [
  {
    id: 1,
    nombre: 'Chardonnay',
    descripcion: 'Uva blanca famosa por su versatilidad en la elaboración de vinos blancos.',
    requisito_ph: 6.0,
    requisito_temperatura: 50,
    requisito_humedad: 35,
    tiempo_cosecha: 120,
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
          ph: tipoUva.requisito_ph,
          temperatura: tipoUva.requisito_temperatura,
          humedad: tipoUva.requisito_humedad,
          tiempo_cosecha: tipoUva.tiempo_cosecha,
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

  // Función para renderizar los acordeones con la información de las parcelas y siembras activas
  const renderParcelDetails = (parcelaId) => {
    const parcela = parcelasExistentes.find((p) => p.id === parcelaId);
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
                  <Descriptions.Item label="PH del Suelo">{parcela.controlTierra.ph}</Descriptions.Item>
                  <Descriptions.Item label="Humedad">{parcela.controlTierra.humedad}%</Descriptions.Item>
                  <Descriptions.Item label="Temperatura">{parcela.controlTierra.temperatura}°C</Descriptions.Item>
                  <Descriptions.Item label="Observaciones">{parcela.controlTierra.observaciones}</Descriptions.Item>
                </Descriptions>
              </Panel>

              {/* Acordeón para la Siembra Activa */}
              {parcela.siembraActiva && (
                <Panel header="Siembra Activa" key={`siembra-${parcela.id}`}>
                  <Descriptions column={1} bordered>
                    <Descriptions.Item label="Cantidad de Plantas">{parcela.siembraActiva.cantidadPlantas}</Descriptions.Item>
                    <Descriptions.Item label="Técnica de Siembra">{parcela.siembraActiva.tecnica}</Descriptions.Item>
                    <Descriptions.Item label="Observaciones">{parcela.siembraActiva.observaciones}</Descriptions.Item>
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

  return (
    <Card title={isEditMode ? 'Modificar Tipo de Uva' : 'Registrar Nuevo Tipo de Uva'} bordered={false} style={{ marginTop: 20 }}>
      <Form form={form} layout="vertical" name="create-edit-grape-type" onFinish={onFinish}>
        {/* Selección de Parcelas */}
        <Form.Item
          label="Seleccionar Parcelas"
          name="parcelas"
        >
          <Select
            mode="multiple"
            placeholder="Seleccione las parcelas"
            defaultValue={selectedParcels}
            onChange={setSelectedParcels}
            disabled={isEditMode}
          >
            {parcelasExistentes.map((parcela) => (
              <Option key={parcela.id} value={parcela.id}>
                {parcela.nombre}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Acordeones para las parcelas seleccionadas */}
        {selectedParcels.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            {selectedParcels.map((parcelaId) => renderParcelDetails(parcelaId))}
          </div>
        )}

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
          name="tiempo_cosecha"
          rules={[{ required: true, message: 'Por favor, ingrese el tiempo estimado de cosecha' }]}
        >
          <InputNumber min={1} placeholder="Tiempo de cosecha" style={{ width: '100%' }} />
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
