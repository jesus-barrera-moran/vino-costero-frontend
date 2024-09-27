import React, { useState, useEffect } from 'react';
import { Form, InputNumber, Button, Card, Select, DatePicker, Input, Descriptions, message, Collapse, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

const { Option } = Select;
const { Panel } = Collapse;

const CreateOrEditSowing = () => {
  const [form] = Form.useForm();
  const { id } = useParams(); // ID de la siembra o parcela
  const [selectedParcela, setSelectedParcela] = useState(null);
  const [parcelas, setParcelas] = useState([]); // Almacena las parcelas obtenidas del backend
  const [tiposDeUva, setTiposDeUva] = useState([]); // Almacena los tipos de uva
  const [siembra, setSiembra] = useState(null); // Detalles de la siembra seleccionada
  const [selectedUva, setSelectedUva] = useState(null); // Detalles del tipo de uva seleccionado
  const [isEditMode, setIsEditMode] = useState(false); // Determina si es modo edición
  const [loading, setLoading] = useState(true); // Estado de carga
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParcelas = async () => {
      try {
        const response = await fetch('http://localhost:3000/parcelas');
        const data = await response.json();
        const parcelasDisponibles = !window.location.pathname.includes('edit-sowing') ? data.filter(parcela => !parcela.siembra_activa) : data;
        setParcelas(parcelasDisponibles);
  
        if (window.location.pathname.includes('edit-sowing')) {
          setIsEditMode(true);
          await fetchSiembra(parcelasDisponibles);
          await fetchTiposDeUva();
        }
      } catch (error) {
        message.error('Error al cargar las parcelas');
      } finally {
        setLoading(false);
      }
    };
  
    const fetchTiposDeUva = async () => {
      try {
        const response = await fetch('http://localhost:3000/tiposUvas');
        const data = await response.json();
        setTiposDeUva(data);
  
        // Si ya tienes una siembra cargada, selecciona el tipo de uva una vez que los tipos de uva estén cargados
        if (siembra) {
          const uva = data.find((t) => t.nombre === siembra.tipo_uva);
          setSelectedUva(uva);
        }
      } catch (error) {
        message.error('Error al cargar los tipos de uva');
      }
    };
  
    const fetchSiembra = async (parcelasDisponibles) => {
      try {
        const response = await fetch(`http://localhost:3000/siembras/${id}`);
        const siembraData = await response.json();
        setSiembra(siembraData);
  
        const parcela = parcelasDisponibles.find((p) => p.id === siembraData.id_parcela);
        setSelectedParcela(parcela);
  
        form.setFieldsValue({
          parcela: parcela.id,
          id_tipo_uva: siembraData.tipo_uva,
          fecha_plantacion: moment(siembraData.fecha_plantacion),
          cantidad_plantas: siembraData.cantidad_plantas,
          tecnica_siembra: siembraData.tecnica_siembra,
          observaciones_siembra: siembraData.observaciones_siembra,
        });
  
        // Cargar tipos de uva después de cargar la siembra
        await fetchTiposDeUva();
      } catch (error) {
        message.error('Error al cargar la siembra');
      }
    };
  
    fetchParcelas();
  }, [id, form, siembra]);

  const handleParcelaChange = (id_parcela) => {
    const parcela = parcelas.find((p) => p.id === parseInt(id_parcela));
    setSelectedParcela(parcela);
  };

  const handleUvaChange = (nombreUva) => {
    const uva = tiposDeUva.find((t) => t.id === nombreUva);
    if (uva) {
      setSelectedUva(uva);
    }
  };

  const onFinish = async (values) => {
    const url = isEditMode
      ? `http://localhost:3000/siembras/${id}` // Para actualizar siembra existente
      : 'http://localhost:3000/siembras'; // Para crear una nueva siembra
    const method = isEditMode ? 'PUT' : 'POST'; // Determinar el método según el modo

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_parcela: values.parcela,
          id_tipo_uva: values.id_tipo_uva,
          fecha_plantacion: values.fecha_plantacion.format('YYYY-MM-DD'), // Formatear la fecha
          cantidad_plantas: values.cantidad_plantas,
          tecnica_siembra: values.tecnica_siembra,
          observaciones_siembra: values.observaciones_siembra || 'Sin observaciones',
        }),
      });

      if (response.ok) {
        const successMessage = isEditMode ? 'Siembra actualizada exitosamente' : 'Siembra registrada exitosamente';
        message.success(successMessage);
        navigate('/sowings'); // Redirigir al listado principal después de guardar
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error) {
      message.error('Hubo un error al procesar la solicitud');
    }
  };

  // Mostrar un spinner si los datos aún no están listos
  if (loading) {
    return <Spin tip="Cargando parcelas y tipos de uva..." />;
  }

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
            disabled={isEditMode} // Deshabilitar en modo edición
          >
            {parcelas.map((parcela) => (
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
                    <Descriptions.Item label="PH del Suelo">{selectedParcela.control_tierra?.ph || 'N/A'}</Descriptions.Item>
                    <Descriptions.Item label="Humedad">{selectedParcela.control_tierra?.humedad || 'N/A'}%</Descriptions.Item>
                    <Descriptions.Item label="Temperatura">{selectedParcela.control_tierra?.temperatura || 'N/A'}°C</Descriptions.Item>
                    <Descriptions.Item label="Observaciones">{selectedParcela.control_tierra?.observaciones || 'N/A'}</Descriptions.Item>
                  </Descriptions>
                </Panel>
              </Collapse>
            </Panel>
          </Collapse>
        )}

        {/* Tipo de Uva */}
        <Form.Item
          label="Tipo de Uva"
          name="id_tipo_uva"
          rules={[{ required: true, message: 'Por favor, seleccione el tipo de uva' }]}
        >
          <Select placeholder="Seleccione el tipo de uva" disabled={isEditMode} onChange={handleUvaChange}>
            {tiposDeUva.map((uva, index) => (
              <Option key={index} value={uva.id}>
                {uva.nombre}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Detalles del Tipo de Uva Seleccionado */}
        {selectedUva && (
          <Collapse accordion style={{ marginBottom: '20px' }}>
            <Panel header={`Detalles del Tipo de Uva: ${selectedUva.nombre}`} key="uva-details">
              <Descriptions column={2} bordered>
                <Descriptions.Item label="PH Requerido">{selectedUva.ph_requerido}</Descriptions.Item>
                <Descriptions.Item label="Humedad Requerida">{selectedUva.humedad_requerida}%</Descriptions.Item>
                <Descriptions.Item label="Temperatura Requerida">{selectedUva.temperatura_requerida}°C</Descriptions.Item>
                <Descriptions.Item label="Tiempo de Cosecha">{selectedUva.tiempoCosecha} días</Descriptions.Item>
                <Descriptions.Item label="Descripción">{selectedUva.descripcion || 'No disponible'}</Descriptions.Item>
              </Descriptions>
            </Panel>
          </Collapse>
        )}

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

        {/* Observaciones de la siembra */}
        <Form.Item
          label="Observaciones"
          name="observaciones_siembra"
        >
          <Input.TextArea rows={4} placeholder="Observaciones sobre la siembra" />
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

export default CreateOrEditSowing;
