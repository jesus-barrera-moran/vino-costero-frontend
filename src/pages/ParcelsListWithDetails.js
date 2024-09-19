import React from 'react';
import { Table, Button, Space, Collapse, Descriptions, Card } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Panel } = Collapse;

// Simulación de datos de parcelas existentes
const parcelasExistentes = [
  {
    id: 1,
    nombre: 'Parcela 1',
    longitud: '-70.123456',
    latitud: '-33.456789',
    ubicacion: 'Fundo El Olivo',
    superficie: 10,
    dim_longitud: 500,
    dim_anchura: 200,
    pendiente: 15,
    siembras: [
      {
        nombre: 'Siembra 1',
        tipo_uva: 'Chardonnay',
      },
      {
        nombre: 'Siembra 2',
        tipo_uva: 'Sauvignon Blanc',
      },
    ],
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
    superficie: 8,
    dim_longitud: 400,
    dim_anchura: 150,
    pendiente: 12,
    siembras: [
      {
        nombre: 'Siembra 3',
        tipo_uva: 'Pinot Noir',
      },
    ],
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

  // Función para mostrar los detalles de cada parcela
  const expandedRowRender = (parcela) => {
    return (
      <Collapse accordion>
        {/* Acordeón para Dimensiones */}
        <Panel header="Dimensiones" key="1">
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Superficie">{parcela.superficie} hectáreas</Descriptions.Item>
            <Descriptions.Item label="Longitud">{parcela.dim_longitud} metros</Descriptions.Item>
            <Descriptions.Item label="Anchura">{parcela.dim_anchura} metros</Descriptions.Item>
            <Descriptions.Item label="Pendiente">{parcela.pendiente}%</Descriptions.Item>
          </Descriptions>
        </Panel>

        {/* Acordeón para Siembras */}
        <Panel header="Siembras Asociadas" key="2">
          {parcela.siembras.map((siembra, index) => (
            <Collapse key={index} bordered={false}>
              <Panel header={siembra.nombre} key={index + 1}>
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Tipo de Uva">{siembra.tipo_uva}</Descriptions.Item>
                </Descriptions>
              </Panel>
            </Collapse>
          ))}
        </Panel>

        {/* Acordeón para Control de Tierra */}
        <Panel header="Control de Tierra" key="3">
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
