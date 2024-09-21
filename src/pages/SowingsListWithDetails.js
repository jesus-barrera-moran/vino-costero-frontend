import React from 'react';
import { Table, Card, Collapse, Descriptions, Timeline, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

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
    },
    siembraActual: {
      tipoUva: 'Chardonnay',
      fechaPlantacion: '2023-05-01',
      cantidadPlantas: 1000,
      tecnica: 'Siembra directa',
    },
    historialSiembras: [
      {
        tipoUva: 'Pinot Noir',
        fechaPlantacion: '2022-06-10',
        cantidadPlantas: 800,
        tecnica: 'Trasplante',
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
    },
    siembraActual: {
      tipoUva: 'Sauvignon Blanc',
      fechaPlantacion: '2023-04-15',
      cantidadPlantas: 900,
      tecnica: 'Siembra directa',
    },
    historialSiembras: [
      {
        tipoUva: 'Cabernet Sauvignon',
        fechaPlantacion: '2021-08-20',
        cantidadPlantas: 850,
        tecnica: 'Siembra directa',
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
      title: 'Superficie (ha)',
      dataIndex: ['dimensiones', 'superficie'],
      key: 'superficie',
    },
    {
      title: 'Tipo de Uva Actual',
      dataIndex: ['siembraActual', 'tipoUva'],
      key: 'tipoUva',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (record) => (
        <Button type="primary" onClick={() => navigate(`/crear-siembra/${record.id}`)}>
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
        <Panel header="Siembra Actual" key="1">
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Tipo de Uva">{parcela.siembraActual.tipoUva}</Descriptions.Item>
            <Descriptions.Item label="Fecha de Plantación">{parcela.siembraActual.fechaPlantacion}</Descriptions.Item>
            <Descriptions.Item label="Cantidad de Plantas">{parcela.siembraActual.cantidadPlantas}</Descriptions.Item>
            <Descriptions.Item label="Técnica de Siembra">{parcela.siembraActual.tecnica}</Descriptions.Item>
          </Descriptions>
        </Panel>

        {/* Historial de Siembras */}
        <Panel header="Historial de Siembras" key="2">
          <Timeline>
            {parcela.historialSiembras.map((siembra, index) => (
              <Timeline.Item key={index}>
                <Collapse>
                  <Panel header={`Siembra del ${siembra.fechaPlantacion}`} key={index + 1}>
                    <Descriptions column={2} bordered>
                      <Descriptions.Item label="Tipo de Uva">{siembra.tipoUva}</Descriptions.Item>
                      <Descriptions.Item label="Fecha de Plantación">{siembra.fechaPlantacion}</Descriptions.Item>
                      <Descriptions.Item label="Cantidad de Plantas">{siembra.cantidadPlantas}</Descriptions.Item>
                      <Descriptions.Item label="Técnica de Siembra">{siembra.tecnica}</Descriptions.Item>
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
