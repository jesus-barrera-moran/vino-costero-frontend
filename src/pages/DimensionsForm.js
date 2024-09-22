import React, { useState, useEffect } from 'react';
import { Form, InputNumber, Button, Card, Descriptions, Collapse, Alert, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

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
    siembras: [],
  },
  {
    id: 2,
    nombre: 'Parcela 2',
    longitud: '123.456',
    latitud: '456.789',
    ubicacion: 'Valle de Casablanca',
    estado: 'ocupada',
    dimensionesActuales: {
      superficie: 8,
      longitud: 400,
      anchura: 150,
      pendiente: 12,
    },
    siembras: [
      {
        nombre: 'Siembra Actual',
        tipoUva: 'Pinot Noir',
      },
    ],
  },
];

// Función para calcular el área ocupada
const calcularAreaOcupada = (longitud, anchura) => {
  return (longitud * anchura) / 10000; // Convertir de m² a hectáreas
};

const EditParcelDimensions = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [parcela, setParcela] = useState(null);
  const [areaOcupada, setAreaOcupada] = useState(0);
  const [porcentajeOcupado, setPorcentajeOcupado] = useState(0);
  const [warning, setWarning] = useState('');

  // Simulación de búsqueda de parcela por ID
  useEffect(() => {
    const selectedParcela = parcelasExistentes.find((p) => p.id === parseInt(id));
    if (selectedParcela) {
      setParcela(selectedParcela);
      const { longitud, anchura, superficie } = selectedParcela.dimensionesActuales;
      const area = calcularAreaOcupada(longitud, anchura);
      setAreaOcupada(area);
      setPorcentajeOcupado(((area / superficie) * 100).toFixed(2));
      form.setFieldsValue({
        superficie: superficie,
        longitud: longitud,
        anchura: anchura,
        pendiente: selectedParcela.dimensionesActuales.pendiente,
      });
    } else {
      message.error('Parcela no encontrada');
    }
  }, [id, form]);

  // Función para manejar los cambios en las dimensiones
  const handleDimensionChange = () => {
    const { longitud, anchura } = form.getFieldsValue(['longitud', 'anchura']);
    if (longitud && anchura) {
      const area = calcularAreaOcupada(longitud, anchura);
      setAreaOcupada(area);
      const superficie = form.getFieldValue('superficie');
      const porcentaje = ((area / superficie) * 100).toFixed(2);
      setPorcentajeOcupado(porcentaje);

      // Advertencia si el área ocupada supera el 100%
      if (porcentaje > 100) {
        setWarning('El área ocupada supera la superficie total de la parcela.');
      } else {
        setWarning('');
      }
    }
  };

  const onFinish = (values) => {
    console.log('Dimensiones actualizadas:', values);
    message.success('Las dimensiones se han actualizado exitosamente');
    navigate('/');
  };

  if (!parcela) {
    return null;
  }

  // Validación: Si la parcela tiene una siembra activa, no permitimos la edición
  const tieneSiembraActiva = parcela.siembras.length > 0;

  return (
    <Card title={`Editar Dimensiones de ${parcela.nombre}`} bordered={false} style={{ marginTop: 20, padding: '20px 40px' }}>
      {/* Formulario para editar dimensiones */}
      {!tieneSiembraActiva && (
        <Form
          form={form}
          layout="vertical"
          name="edit-dimensions"
          onFinish={onFinish}
          onValuesChange={handleDimensionChange}
          style={{ marginBottom: 30 }}
        >

          {tieneSiembraActiva && (
            <Alert
              message="No es posible editar las dimensiones de una parcela con siembra activa."
              type="error"
              showIcon
              style={{ marginBottom: 30 }}
            />
          )}

          {/* Acordeones para información adicional de la parcela */}
          <Collapse accordion style={{ marginBottom: '10px' }}>
            <Panel header="Información General de la Parcela" key="1">
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Nombre">{parcela.nombre}</Descriptions.Item>
                <Descriptions.Item label="Longitud (coordenadas)">{parcela.longitud}</Descriptions.Item>
                <Descriptions.Item label="Latitud (coordenadas)">{parcela.latitud}</Descriptions.Item>
                <Descriptions.Item label="Ubicación">{parcela.ubicacion}</Descriptions.Item>
                <Descriptions.Item label="Estado de la Parcela">{parcela.estado}</Descriptions.Item>
              </Descriptions>
            </Panel>

            <Panel header="Dimensiones Actuales" key="2">
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Superficie">{parcela.dimensionesActuales.superficie} metros</Descriptions.Item>
                <Descriptions.Item label="Longitud">{parcela.dimensionesActuales.longitud} metros</Descriptions.Item>
                <Descriptions.Item label="Anchura">{parcela.dimensionesActuales.anchura} metros</Descriptions.Item>
                <Descriptions.Item label="Pendiente">{parcela.dimensionesActuales.pendiente}%</Descriptions.Item>
              </Descriptions>
            </Panel>
          </Collapse>

          <Form.Item
            label="Superficie (hectáreas)"
            name="superficie"
            rules={[{ required: true, message: 'Por favor, ingrese la superficie de la parcela' }]}
          >
            <InputNumber min={0} placeholder="Superficie" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Longitud (metros)"
            name="longitud"
            rules={[{ required: true, message: 'Por favor, ingrese la longitud de la parcela' }]}
          >
            <InputNumber min={0} placeholder="Longitud" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Anchura (metros)"
            name="anchura"
            rules={[{ required: true, message: 'Por favor, ingrese la anchura de la parcela' }]}
          >
            <InputNumber min={0} placeholder="Anchura" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Pendiente (%)"
            name="pendiente"
            rules={[{ required: true, message: 'Por favor, ingrese la pendiente de la parcela' }]}
          >
            <InputNumber min={0} max={100} placeholder="Pendiente" style={{ width: '100%' }} />
          </Form.Item>

          {warning && <Alert message={warning} type="warning" showIcon style={{ marginBottom: 20 }} />}

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%', padding: '10px' }}>
              Guardar Cambios
            </Button>
          </Form.Item>
        </Form>
      )}
    </Card>
  );
};

export default EditParcelDimensions;
