import React, { useState, useEffect } from 'react';
import { Form, InputNumber, Button, Card, Select, DatePicker, Input, Descriptions, message, Collapse } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

const { Option } = Select;
const { Panel } = Collapse;

// Simulación de datos de parcelas existentes
const parcelasExistentes = [
  {
    id: 1,
    nombre: 'Parcela 1',
    dimensiones: {
      superficie: 10,
      longitud: 500,
      anchura: 200,
      pendiente: 5,
    },
    controlesTierra: {
      ph: 6.2,
      humedad: 32,
      temperatura: 18,
      observaciones: 'Se realizó un control de tierra el 2023-05-01.',
    },
  },
  {
    id: 2,
    nombre: 'Parcela 2',
    dimensiones: {
      superficie: 8,
      longitud: 400,
      anchura: 150,
      pendiente: 5,
    },
    controlesTierra: {
      ph: 6.5,
      humedad: 35,
      temperatura: 19,
      observaciones: 'Se realizó un control de tierra el 2023-04-15.',
    },
  },
];

// Simulación de tipos de uvas registrados
const tiposDeUva = ['Chardonnay', 'Sauvignon Blanc', 'Pinot Noir', 'Cabernet Sauvignon'];

// Simulación de siembras existentes
const siembrasExistentes = [
  {
    id: 1,
    id_parcela: 1,
    tipo_uva: 'Chardonnay',
    estado: 'Activa',
    fecha_plantacion: '2023-05-01',
    cantidad_plantas: 1000,
    tecnica_siembra: 'Siembra directa',
    observaciones_siembra: 'Observaciones de la siembra...',
  },
  {
    id: 2,
    id_parcela: 2,
    tipo_uva: 'Sauvignon Blanc',
    estado: 'Activa',
    fecha_plantacion: '2023-04-15',
    cantidad_plantas: 900,
    tecnica_siembra: 'Trasplante',
    observaciones_siembra: 'Observaciones de la siembra...',
  },
];

const CreateSowing = () => {
  const [form] = Form.useForm();
  const { id } = useParams(); // ID de la siembra para modificación
  const [selectedParcela, setSelectedParcela] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false); // Determina si es modo edición
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      // Si hay un ID en los parámetros, estamos en modo edición
      setIsEditMode(true);
      // Cargar los datos de la siembra existente
      const siembra = siembrasExistentes.find((s) => s.id === parseInt(id));
      if (siembra) {
        // Seleccionar la parcela correspondiente
        handleParcelaChange(siembra.id_parcela);
        // Cargar los datos en el formulario
        form.setFieldsValue({
          parcela: siembra.id_parcela,
          tipo_uva: siembra.tipo_uva,
          fecha_plantacion: moment(siembra.fecha_plantacion),
          cantidad_plantas: siembra.cantidad_plantas,
          tecnica_siembra: siembra.tecnica_siembra,
        });
      }
    }
  }, [id, form]);

  const handleParcelaChange = (id_parcela) => {
    const parcela = parcelasExistentes.find((p) => p.id === parseInt(id_parcela));
    setSelectedParcela(parcela);
  };

  const onFinish = (values) => {
    if (isEditMode) {
      // Modo edición: actualizar siembra existente
      console.log('Siembra actualizada:', values);
      message.success('Siembra actualizada exitosamente');
    } else {
      // Modo creación: crear nueva siembra
      console.log('Nueva Siembra registrada:', values);
      message.success('Siembra registrada exitosamente');
    }
    navigate('/');
  };

  return (
    <Card title={isEditMode ? 'Modificar Siembra' : 'Registrar Nueva Siembra'} bordered={false} style={{ marginTop: 20 }}>
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
            disabled={isEditMode} // Deshabilitar en modo edición para evitar cambiar la parcela
          >
            {parcelasExistentes.map((parcela) => (
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
                    <Descriptions.Item label="PH del Suelo">{selectedParcela.controlesTierra.ph}</Descriptions.Item>
                    <Descriptions.Item label="Humedad">{selectedParcela.controlesTierra.humedad}%</Descriptions.Item>
                    <Descriptions.Item label="Temperatura">{selectedParcela.controlesTierra.temperatura}°C</Descriptions.Item>
                    <Descriptions.Item label="Observaciones">{selectedParcela.controlesTierra.observaciones}</Descriptions.Item>
                  </Descriptions>
                </Panel>
              </Collapse>
            </Panel>
          </Collapse>
        )}

        {/* Tipo de Uva */}
        <Form.Item
          label="Tipo de Uva"
          name="tipo_uva"
          // rules={[{ required: true, message: 'Por favor, seleccione el tipo de uva' }]}
        >
          <Select placeholder="Seleccione el tipo de uva">
            {tiposDeUva.map((uva, index) => (
              <Option key={index} value={uva}>
                {uva}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Fecha de Plantación */}
        <Form.Item
          label="Fecha de Plantación"
          name="fecha_plantacion"
          rules={[{ required: true, message: 'Por favor, seleccione la fecha de plantación' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        {/* Cantidad de Plantas */}
        <Form.Item
          label="Cantidad de Plantas"
          name="cantidad_plantas"
          rules={[{ required: true, message: 'Por favor, ingrese la cantidad de plantas' }]}
        >
          <InputNumber min={1} placeholder="Cantidad de Plantas" style={{ width: '100%' }} />
        </Form.Item>

        {/* Técnica de Siembra */}
        <Form.Item
          label="Técnica de Siembra"
          name="tecnica_siembra"
          rules={[{ required: true, message: 'Por favor, ingrese la técnica de siembra utilizada' }]}
        >
          <Input placeholder="Técnica de Siembra (Ej: Siembra directa, Trasplante)" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            {isEditMode ? 'Guardar Cambios' : 'Registrar Siembra'}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateSowing;
