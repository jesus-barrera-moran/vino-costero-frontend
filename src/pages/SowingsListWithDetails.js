import React from 'react';
import { Table, Card, Collapse, Descriptions, Timeline, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { EditOutlined } from '@ant-design/icons'; // Íconos

const { Panel } = Collapse;

// Simulación de datos de parcelas y siembras
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
    siembraActual: {
      tipoUva: 'Chardonnay',
      fechaCreacion: '2023-05-01',
      cantidadPlantas: 1000,
      tecnica: 'Siembra directa',
      observaciones: 'Se plantaron 1000 plantas de uva Chardonnay en la parcela 1.',
    },
    historialSiembras: [
      {
        tipoUva: 'Pinot Noir',
        fechaCreacion: '2022-06-10',
        cantidadPlantas: 800,
        tecnica: 'Trasplante',
        observaciones: 'Se trasplantaron 800 plantas de uva Pinot Noir en la parcela 1.',
      },
    ],
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
    siembraActual: {
      tipoUva: 'Sauvignon Blanc',
      fechaCreacion: '2023-04-15',
      cantidadPlantas: 900,
      tecnica: 'Siembra directa',
      observaciones: 'Se plantaron 900 plantas de uva Sauvignon Blanc en la parcela 2.',
    },
    historialSiembras: [
      {
        tipoUva: 'Cabernet Sauvignon',
        fechaCreacion: '2021-08-20',
        cantidadPlantas: 850,
        tecnica: 'Siembra directa',
        observaciones: 'Se plantaron 850 plantas de uva Cabernet Sauvignon en la parcela 2.',
      },
    ],
  },
];

const ParcelSowingOverview = () => {
  const navigate = useNavigate();

  // Columnas para el listado de parcelas
  const columns = [
    {
      title: 'Nombre de la Parcela',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Tipo de Uva',
      dataIndex: ['siembraActual', 'tipoUva'],
      key: 'tipoUva',
    },
    {
      title: 'Cantidad de Plantas',
      dataIndex: ['siembraActual', 'cantidadPlantas'],
      key: 'cantidadPlantas',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (record) => (
        <Button type="primary" onClick={() => navigate(`/create-sowing/${record.id}`)}>
          Crear Siembra
        </Button>
      ),
    },
  ];

  // Función para mostrar los detalles de la siembra actual y el historial de siembras
  const expandedRowRender = (parcela) => {
    return (
      <Collapse accordion>
        {/* Siembra Actual */}
        <Panel
          header="Siembra Actual"
          key="1"
          extra={
            <Button
              type="default"
              icon={<EditOutlined />}
              style={{ color: '#52c41a' }} // Verde para la siembra
              onClick={() => navigate(`/edit-sowing/${parcela.id}`)}
            >
              Editar
            </Button>
          }
        >
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Tipo de Uva">{parcela.siembraActual.tipoUva}</Descriptions.Item>
            <Descriptions.Item label="Cantidad de Plantas">{parcela.siembraActual.cantidadPlantas}</Descriptions.Item>
            <Descriptions.Item label="Técnica de Siembra">{parcela.siembraActual.tecnica}</Descriptions.Item>
            <Descriptions.Item label="Observaciones">{parcela.siembraActual.observaciones}</Descriptions.Item>
          </Descriptions>
        </Panel>

        {/* Historial de Siembras */}
        <Panel header="Historial de Siembras" key="2">
          <Timeline>
            {parcela.historialSiembras.map((siembra, index) => (
              <Timeline.Item key={index}>
                <Collapse>
                  <Panel header={`Siembra del ${siembra.fechaCreacion}`} key={index + 1}>
                    <Descriptions column={2} bordered>
                      <Descriptions.Item label="Tipo de Uva">{siembra.tipoUva}</Descriptions.Item>
                      <Descriptions.Item label="Cantidad de Plantas">{siembra.cantidadPlantas}</Descriptions.Item>
                      <Descriptions.Item label="Técnica de Siembra">{siembra.tecnica}</Descriptions.Item>
                      <Descriptions.Item label="Observaciones">{siembra.observaciones}</Descriptions.Item>
                    </Descriptions>
                  </Panel>
                </Collapse>
              </Timeline.Item>
            ))}
          </Timeline>
        </Panel>
      </Collapse>
    );
  };

  return (
    <Card title="Visualización de Parcelas y Siembras" bordered={false} style={{ marginTop: 20 }}>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={() => navigate('/create-sowing')}>
        Registrar Nueva Siembra
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

export default ParcelSowingOverview;
