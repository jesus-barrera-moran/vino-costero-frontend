import React, { useState, useEffect } from 'react';
import { Form, InputNumber, Button, Card, Select, DatePicker, Input, Descriptions, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

const { Option } = Select;

// Simulación de datos de parcelas existentes
const parcelasExistentes = [
  {
    id: 1,
    nombre: 'Parcela 1',
    dimensiones: {
      superficie: 10,
      longitud: 500,
      anchura: 200,
    },
    controlesTierra: {
      ph: 6.2,
      humedad: 32,
      temperatura: 18,
    },
  },
  {
    id: 2,
    nombre: 'Parcela 2',
    dimensiones: {
      superficie: 8,
      longitud: 400,
      anchura: 150,
    },
    controlesTierra: {
      ph: 6.5,
      humedad: 35,
      temperatura: 19,
    },
  },
];

// Simulación de tipos de uvas registrados
const tiposDeUva = ['Chardonnay', 'Sauvignon Blanc', 'Pinot Noir', 'Cabernet Sauvignon'];

// Simulación de siembras existentes
const siembrasExistentes = [
  {
    id: 1,
    parcelaId: 1,
    tipoUva: 'Chardonnay',
    fechaPlantacion: '2023-05-01',
    cantidadPlantas: 1000,
    tecnica: 'Siembra directa',
  },
  {
    id: 2,
    parcelaId: 2,
    tipoUva: 'Sauvignon Blanc',
    fechaPlantacion: '2023-04-15',
    cantidadPlantas: 900,
    tecnica: 'Trasplante',
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
        handleParcelaChange(siembra.parcelaId);
        // Cargar los datos en el formulario
        form.setFieldsValue({
          parcela: siembra.parcelaId,
          tipoUva: siembra.tipoUva,
          fechaPlantacion: moment(siembra.fechaPlantacion),
          cantidadPlantas: siembra.cantidadPlantas,
          tecnica: siembra.tecnica,
        });
      }
    }
  }, [id, form]);

  const handleParcelaChange = (parcelaId) => {
    const parcela = parcelasExistentes.find((p) => p.id === parseInt(parcelaId));
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

        {/* Mostrar detalles de la parcela seleccionada */}
        {selectedParcela && (
          <Descriptions title="Detalles de la Parcela Seleccionada" bordered column={1}>
            <Descriptions.Item label="Superficie">
              {selectedParcela.dimensiones.superficie} hectáreas
            </Descriptions.Item>
            <Descriptions.Item label="Longitud">{selectedParcela.dimensiones.longitud} metros</Descriptions.Item>
            <Descriptions.Item label="Anchura">{selectedParcela.dimensiones.anchura} metros</Descriptions.Item>
            <Descriptions.Item label="PH del Suelo">{selectedParcela.controlesTierra.ph}</Descriptions.Item>
            <Descriptions.Item label="Humedad del Suelo">{selectedParcela.controlesTierra.humedad}%</Descriptions.Item>
            <Descriptions.Item label="Temperatura del Suelo">
              {selectedParcela.controlesTierra.temperatura}°C
            </Descriptions.Item>
          </Descriptions>
        )}

        {/* Tipo de Uva */}
        <Form.Item
          label="Tipo de Uva"
          name="tipoUva"
          rules={[{ required: true, message: 'Por favor, seleccione el tipo de uva' }]}
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
          name="fechaPlantacion"
          rules={[{ required: true, message: 'Por favor, seleccione la fecha de plantación' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        {/* Cantidad de Plantas */}
        <Form.Item
          label="Cantidad de Plantas"
          name="cantidadPlantas"
          rules={[{ required: true, message: 'Por favor, ingrese la cantidad de plantas' }]}
        >
          <InputNumber min={1} placeholder="Cantidad de Plantas" style={{ width: '100%' }} />
        </Form.Item>

        {/* Técnica de Siembra */}
        <Form.Item
          label="Técnica de Siembra"
          name="tecnica"
          rules={[{ required: true, message: 'Por favor, ingrese la técnica de siembra utilizada' }]}
        >
          <Input placeholder="Técnica de Siembra (Ej: Siembra directa, Trasplante)" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {isEditMode ? 'Guardar Cambios' : 'Registrar Siembra'}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateSowing;
