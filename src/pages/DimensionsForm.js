import React, { useState, useEffect } from 'react';
import { Form, InputNumber, Button, Card, Descriptions, Collapse, Alert, message, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

const { Panel } = Collapse;

// Función para calcular el área ocupada
const calcularAreaOcupada = (longitud, anchura) => {
  return (longitud * anchura) / 10000; // Convertir de m² a hectáreas
};

const EditParcelDimensions = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [parcela, setParcela] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga
  const [areaOcupada, setAreaOcupada] = useState(0);
  const [porcentajeOcupado, setPorcentajeOcupado] = useState(0);
  const [warning, setWarning] = useState('');

  // Función para obtener los detalles de la parcela desde el backend
  const fetchParcela = async () => {
    try {
      const response = await fetch(`http://localhost:3000/parcelas/${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener los detalles de la parcela');
      }
      const data = await response.json();
      setParcela(data);

      const { longitud, anchura, superficie } = data.dimensiones;
      const area = calcularAreaOcupada(longitud, anchura);
      setAreaOcupada(area);
      setPorcentajeOcupado(((area / superficie) * 100).toFixed(2));
      form.setFieldsValue({
        superficie: superficie,
        longitud: longitud,
        anchura: anchura,
        pendiente: data.dimensiones.pendiente,
      });
      setLoading(false);
    } catch (error) {
      message.error('Error al cargar la parcela');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParcela();
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

  // Función para manejar el envío del formulario
  const onFinish = async (values) => {
    try {
      const response = await fetch(`http://localhost:3000/dimensiones/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          superficie: values.superficie,
          longitud: values.longitud,
          anchura: values.anchura,
          pendiente: values.pendiente,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar las dimensiones');
      }
      message.success('Las dimensiones se han actualizado exitosamente');
      navigate('/dimensions');
    } catch (error) {
      message.error('Hubo un error al actualizar las dimensiones');
    }
  };

  if (loading) {
    return <Spin tip="Cargando datos de la parcela..." />;
  }

  if (!parcela) {
    return null;
  }

  // Validación: Si la parcela no está disponible, no permitimos la edición
  const esParcelaDisponible = parcela.estado.toLowerCase() === 'disponible';

  return (
    <Card title={`Editar Dimensiones de ${parcela.nombre}`} bordered={false} style={{ marginTop: 20, padding: '20px 40px' }}>
      {/* Formulario para editar dimensiones */}
      <Form
        form={form}
        layout="vertical"
        name="edit-dimensions"
        onFinish={onFinish}
        onValuesChange={handleDimensionChange}
        style={{ marginBottom: 30 }}
        disabled={!esParcelaDisponible} // Deshabilitar si no está disponible
      >

        {!esParcelaDisponible && (
          <Alert
            message="No es posible editar las dimensiones de una parcela que no está disponible."
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
              <Descriptions.Item label="Superficie">{parcela.dimensiones.superficie} hectáreas</Descriptions.Item>
              <Descriptions.Item label="Longitud">{parcela.dimensiones.longitud} metros</Descriptions.Item>
              <Descriptions.Item label="Anchura">{parcela.dimensiones.anchura} metros</Descriptions.Item>
              <Descriptions.Item label="Pendiente">{parcela.dimensiones.pendiente}%</Descriptions.Item>
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
          <Button type="primary" htmlType="submit" style={{ width: '100%', padding: '10px' }} disabled={!esParcelaDisponible}>
            Guardar Cambios
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default EditParcelDimensions;
