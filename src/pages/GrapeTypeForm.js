import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Card, Select, message, Collapse, Descriptions } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

const { Option } = Select;
const { Panel } = Collapse;

const CreateOrEditGrapeType = () => {
  const { id } = useParams(); // Captura el ID del tipo de uva si es edición
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [parcelas, setParcelas] = useState([]); // Estado para las parcelas disponibles
  const [selectedParcels, setSelectedParcels] = useState([]); // Estado para las parcelas seleccionadas
  const [loading, setLoading] = useState(true);

  // Cargar los datos de parcelas y del tipo de uva si es edición
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener todas las parcelas
        const parcelasResponse = await fetch('http://localhost:3000/parcelas');
        const parcelasData = await parcelasResponse.json();
  
        // Filtrar solo las parcelas que tengan siembra activa sin un tipo de uva asignado
        const parcelasFiltradas = !id && parcelasData.filter((parcela) => {
          return (
            parcela.siembra_activa && // Tiene siembra activa
            !parcela.siembra_activa.tipo_uva // No tiene tipo de uva asignado
          );
        });
  
        setParcelas(id ? parcelasData : parcelasFiltradas);
  
        if (id) {
          // Si hay un ID en la URL, estamos en modo de edición
          const tipoUvaResponse = await fetch(`http://localhost:3000/tiposUvas/${id}`);
          const tipoUvaData = await tipoUvaResponse.json();
          setIsEditMode(true);
          form.setFieldsValue({
            nombre: tipoUvaData.nombre,
            descripcion: tipoUvaData.descripcion,
            ph: tipoUvaData.requisito_ph,
            temperatura: tipoUvaData.requisito_temperatura,
            humedad: tipoUvaData.requisito_humedad,
            tiempo_cosecha: tipoUvaData.tiempo_cosecha,
            parcelas: tipoUvaData.parcelas,
          });
          setSelectedParcels(tipoUvaData.parcelas);
        }
        setLoading(false);
      } catch (error) {
        message.error('Error al cargar los datos.');
        setLoading(false);
      }
    };
    fetchData();
  }, [id, form]);  

  const onFinish = async (values) => {
    try {
      const url = isEditMode
        ? `http://localhost:3000/tiposUvas/${id}`
        : 'http://localhost:3000/tiposUvas';
      const method = isEditMode ? 'PUT' : 'POST';

      const payload = {
        nombre: values.nombre,
        descripcion: values.descripcion,
        ph: values.ph,
        temperatura: values.temperatura,
        humedad: values.humedad,
        tiempoCosecha: values.tiempo_cosecha,
      };

      if (!isEditMode && values.parcelas && values.parcelas.length > 0) {
        payload.parcelas = values.parcelas;
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Error en el servidor');
      }

      const messageText = isEditMode ? 'Tipo de uva actualizado' : 'Nuevo tipo de uva registrado';
      message.success(`${messageText} exitosamente`);
      navigate('/grape-types');
    } catch (error) {
      message.error('Error al guardar los datos.');
    }
  };

  const renderParcelDetails = (parcelNombre) => {
    const parcela = parcelas.find((p) => p.nombre === parcelNombre);
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
                  <Descriptions.Item label="PH del Suelo">{parcela.control_tierra.ph}</Descriptions.Item>
                  <Descriptions.Item label="Humedad">{parcela.control_tierra.humedad}%</Descriptions.Item>
                  <Descriptions.Item label="Temperatura">{parcela.control_tierra.temperatura}°C</Descriptions.Item>
                  <Descriptions.Item label="Observaciones">{parcela.control_tierra.observaciones}</Descriptions.Item>
                </Descriptions>
              </Panel>

              {/* Acordeón para la Siembra Activa */}
              {parcela.siembra_activa && (
                <Panel header="Siembra Activa" key={`siembra-${parcela.id}`}>
                  <Descriptions column={1} bordered>
                    <Descriptions.Item label="Cantidad de Plantas">{parcela.siembra_activa.cantidad_plantas}</Descriptions.Item>
                    <Descriptions.Item label="Técnica de Siembra">{parcela.siembra_activa.tecnica}</Descriptions.Item>
                    <Descriptions.Item label="Observaciones">{parcela.siembra_activa.observaciones}</Descriptions.Item>
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

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  return (
    <Card title={isEditMode ? 'Modificar Tipo de Uva' : 'Registrar Nuevo Tipo de Uva'} bordered={false} style={{ marginTop: 20 }}>
      <Form form={form} layout="vertical" name="create-edit-grape-type" onFinish={onFinish}>
        {/* Selección de Parcelas */}
        {parcelas && parcelas.length > 0 && (
          <Form.Item label="Seleccionar Parcelas" name="parcelas">
            <Select
              mode="multiple"
              placeholder="Seleccione las parcelas"
              defaultValue={selectedParcels}
              onChange={setSelectedParcels}
              disabled={isEditMode}
            >
              {parcelas.map((parcela) => (
                <Option key={parcela.id} value={parcela.id}>
                  {parcela.nombre}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {/* Acordeones para las parcelas seleccionadas */}
        {selectedParcels.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            {selectedParcels.map((parcelaId) => renderParcelDetails(parcelaId))}
          </div>
        )}

        <Form.Item label="Nombre de la Uva" name="nombre" rules={[{ required: true, message: 'Por favor, ingrese el nombre de la uva' }]}>
          <Input placeholder="Nombre de la uva" />
        </Form.Item>

        <Form.Item label="Descripción" name="descripcion" rules={[{ required: true, message: 'Por favor, ingrese una descripción' }]}>
          <Input.TextArea placeholder="Descripción de la uva" />
        </Form.Item>

        <Form.Item label="PH del Suelo" name="ph" rules={[{ required: true, message: 'Por favor, ingrese el PH del suelo' }]}>
          <InputNumber min={0} max={14} placeholder="PH del suelo" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Humedad (%)" name="humedad" rules={[{ required: true, message: 'Por favor, ingrese el porcentaje de humedad' }]}>
          <InputNumber min={0} max={100} placeholder="Humedad" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Temperatura (°C)" name="temperatura" rules={[{ required: true, message: 'Por favor, ingrese la temperatura' }]}>
          <InputNumber min={0} placeholder="Temperatura" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Tiempo de Cosecha (días)" name="tiempo_cosecha" rules={[{ required: true, message: 'Por favor, ingrese el tiempo estimado de cosecha' }]}>
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
