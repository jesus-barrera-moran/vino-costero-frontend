import React from 'react';
import { Table, Button, Space, Collapse, Descriptions, Card } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons'; // Íconos
import { useNavigate } from 'react-router-dom';

const { Panel } = Collapse;

// Simulación de datos de parcelas existentes con el nuevo formato según la base de datos
const parcelasExistentes = [
  {
    id: 1,
    nombre: 'Parcela 1',
    longitud: '-70.123456',
    latitud: '-33.456789',
    ubicacion: 'Fundo El Olivo',
    estado: 'Ocupada',
    superficie: 10,
    dim_longitud: 500,
    dim_anchura: 200,
    pendiente: 15,
    siembra_activa: {
      tipo_uva: 'Chardonnay',
      fecha_plantacion: '2023-04-15',
      cantidad_plantas: 500,
      tecnica: 'Siembra directa',
      observaciones: 'Observaciones de la siembra...',
      estado: 'Activa',
    },
    control_tierra: {
      ph: 6.5,
      humedad: 35,
      temperatura: 18,
      observaciones: 'Suelo ideal para Chardonnay',
    },
  },
  {
    id: 2,
    nombre: 'Parcela 2',
    longitud: '-70.654321',
    latitud: '-33.123456',
    ubicacion: 'Fundo La Escondida',
    estado: 'Ocupada',
    superficie: 8,
    dim_longitud: 400,
    dim_anchura: 150,
    pendiente: 12,
    siembra_activa: {
      tipo_uva: 'Pinot Noir',
      fecha_plantacion: '2023-06-10',
      cantidad_plantas: 300,
      tecnica: 'Trasplante',
      observaciones: 'Observaciones de la siembra...',
      estado: 'Finalizada',
    },
    control_tierra: {
      ph: 7,
      humedad: 40,
      temperatura: 20,
      observaciones: 'Ideal para Sauvignon Blanc',
    },
  },
];

const ParcelsListWithDetails = () => {
  const navigate = useNavigate();

  // Columnas para el listado de parcelas
  const columns = [
    {
      title: 'Nombre de la Parcela',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
    },
    {
      title: 'Ubicación',
      dataIndex: 'ubicacion',
      key: 'ubicacion',
    },
    {
      title: 'Superficie (ha)',
      dataIndex: 'superficie',
      key: 'superficie',
    },
    {
      title: 'Pendiente (%)',
      dataIndex: 'pendiente',
      key: 'pendiente',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record.id)}>
            Editar
          </Button>
        </Space>
      ),
    },
  ];

  // Función para manejar la redirección al formulario de edición
  const handleEdit = (id) => {
    navigate(`/edit-parcel/${id}`);
  };

  const handleEditDimensions = (id) => {
    navigate(`/edit-dimensions/${id}`);
  };

  const handleEditSiembra = (id) => {
    navigate(`/edit-sowing/${id}`);
  };

  const handleCreateControlTierra = (id) => {
    navigate(`/create-soil-control/${id}`);
  };

  // Función para mostrar los detalles de cada parcela
  const expandedRowRender = (parcela) => {
    return (
      <Collapse accordion>
        {/* Acordeón para Dimensiones */}
        <Panel
          header="Dimensiones"
          key="1"
          extra={
            <Button
              type="default"
              icon={<EditOutlined />}
              style={{ color: '#1890ff' }}
              onClick={() => handleEditDimensions(parcela.id)}
            >
              Editar
            </Button>
          }
        >
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Superficie">{parcela.superficie} hectáreas</Descriptions.Item>
            <Descriptions.Item label="Longitud">{parcela.dim_longitud} metros</Descriptions.Item>
            <Descriptions.Item label="Anchura">{parcela.dim_anchura} metros</Descriptions.Item>
            <Descriptions.Item label="Pendiente">{parcela.pendiente}%</Descriptions.Item>
          </Descriptions>
        </Panel>

        {/* Siembra Activa */}
        <Panel
          header="Siembra Activa"
          key="2"
          extra={
            <Button
              type="default"
              icon={<EditOutlined />}
              style={{ color: '#52c41a' }} // Verde para la siembra
              onClick={() => handleEditSiembra(parcela.id)}
            >
              Editar
            </Button>
          }
        >
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Tipo de Uva">{parcela.siembra_activa.tipo_uva}</Descriptions.Item>
            <Descriptions.Item label="Fecha de Plantación">{parcela.siembra_activa.fecha_plantacion}</Descriptions.Item>
            <Descriptions.Item label="Cantidad de Plantas">{parcela.siembra_activa.cantidad_plantas}</Descriptions.Item>
            <Descriptions.Item label="Técnica Utilizada">{parcela.siembra_activa.tecnica}</Descriptions.Item>
            <Descriptions.Item label="Estado de la Siembra">{parcela.siembra_activa.estado}</Descriptions.Item>
            <Descriptions.Item label="Observaciones">{parcela.siembra_activa.observaciones}</Descriptions.Item>
          </Descriptions>
        </Panel>

        {/* Acordeón para Control de Tierra */}
        <Panel
          header="Control de Tierra"
          key="3"
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ backgroundColor: '#faad14', borderColor: '#faad14' }} // Naranja para crear control
              onClick={() => handleCreateControlTierra(parcela.id)}
            >
              Crear
            </Button>
          }
        >
          <Descriptions column={1} bordered>
            <Descriptions.Item label="PH de la Tierra">{parcela.control_tierra.ph}</Descriptions.Item>
            <Descriptions.Item label="Humedad">{parcela.control_tierra.humedad}%</Descriptions.Item>
            <Descriptions.Item label="Temperatura">{parcela.control_tierra.temperatura}°C</Descriptions.Item>
            <Descriptions.Item label="Observaciones">{parcela.control_tierra.observaciones}</Descriptions.Item>
          </Descriptions>
        </Panel>
      </Collapse>
    );
  };

  return (
    <Card title="Listado de Parcelas" bordered={false} style={{ marginTop: 20 }}>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={() => navigate('/create-parcel')}>
        Registrar Nueva Parcela
      </Button>
      <Table
        columns={columns}
        dataSource={parcelasExistentes}
        rowKey="id"
        expandable={{
          expandedRowRender: (record) => expandedRowRender(record),
        }}
      />
    </Card>
  );
};

export default ParcelsListWithDetails;
