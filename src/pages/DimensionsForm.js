import React, { useState, useEffect } from 'react';
import { Form, InputNumber, Button, Card, Descriptions, message, Alert } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

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
    estado: 'disponible',
    siembras: [],
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
    estado: 'ocupada',
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
  const handleDimensionChange = (changedValues) => {
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
    <Card title={`Editar Dimensiones de ${parcela.nombre}`} bordered={false} style={{ marginTop: 20 }}>
      <Descriptions column={2} bordered style={{ marginBottom: 20 }}>
        <Descriptions.Item label="Superficie Total">{parcela.dimensionesActuales.superficie} hectáreas</Descriptions.Item>
        <Descriptions.Item label="Área Ocupada">{areaOcupada.toFixed(2)} hectáreas</Descriptions.Item>
        <Descriptions.Item label="Porcentaje Ocupado">{porcentajeOcupado}%</Descriptions.Item>
        <Descriptions.Item label="Estado de la Parcela">
          {tieneSiembraActiva ? 'Ocupada (con siembra activa)' : 'Disponible'}
        </Descriptions.Item>
      </Descriptions>

      {warning && <Alert message={warning} type="warning" showIcon style={{ marginBottom: 20 }} />}

      {tieneSiembraActiva ? (
        <Alert
          message="No es posible editar las dimensiones de una parcela con siembra activa."
          type="error"
          showIcon
          style={{ marginBottom: 20 }}
        />
      ) : (
        <Form
          form={form}
          layout="vertical"
          name="edit-dimensions"
          onFinish={onFinish}
          onValuesChange={handleDimensionChange}
        >
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

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Guardar Cambios
            </Button>
          </Form.Item>
        </Form>
      )}
    </Card>
  );
};

export default EditParcelDimensions;
