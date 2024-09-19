import React from 'react';
import { Table, Card, Collapse, Descriptions, Timeline } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Panel } = Collapse;

// Simulación de datos de parcelas y controles de tierra
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
    },
    controlesTierra: [
      {
        ph: 6.2,
        humedad: 32,
        temperatura: 18,
        observaciones: 'Condiciones normales',
        fecha: '2023-07-15',
      },
      {
        ph: 6.0,
        humedad: 30,
        temperatura: 17,
        observaciones: 'Humedad ligeramente baja',
        fecha: '2023-05-22',
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
    },
    controlesTierra: [
      {
        ph: 6.5,
        humedad: 35,
        temperatura: 19,
        observaciones: 'Condiciones óptimas',
        fecha: '2023-06-20',
      },
    ],
  },
];

const ParcelSoilControlOverview = () => {
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
        <button onClick={() => navigate(`/crear-control-tierra/${record.id}`)}>Crear Control de Tierra</button>
      ),
    },
  ];

  // Función para mostrar los detalles del último control de tierra y el historial
  const expandedRowRender = (parcela) => {
    return (
      <Collapse accordion>
        {/* Último Control de Tierra */}
        <Panel header="Último Control de Tierra" key="1">
          <Descriptions column={2} bordered>
            <Descriptions.Item label="PH">{parcela.controlesTierra[0].ph}</Descriptions.Item>
            <Descriptions.Item label="Humedad">{parcela.controlesTierra[0].humedad}%</Descriptions.Item>
            <Descriptions.Item label="Temperatura">{parcela.controlesTierra[0].temperatura}°C</Descriptions.Item>
            <Descriptions.Item label="Observaciones">{parcela.controlesTierra[0].observaciones}</Descriptions.Item>
            <Descriptions.Item label="Fecha">{parcela.controlesTierra[0].fecha}</Descriptions.Item>
          </Descriptions>
        </Panel>

        {/* Historial de Controles de Tierra */}
        <Panel header="Historial de Controles de Tierra" key="2">
          <Timeline>
            {parcela.controlesTierra.map((control, index) => (
              <Timeline.Item key={index}>
                <Collapse>
                  <Panel header={`Control de Tierra del ${control.fecha}`} key={index + 1}>
                    <Descriptions column={2} bordered>
                      <Descriptions.Item label="PH">{control.ph}</Descriptions.Item>
                      <Descriptions.Item label="Humedad">{control.humedad}%</Descriptions.Item>
                      <Descriptions.Item label="Temperatura">{control.temperatura}°C</Descriptions.Item>
                      <Descriptions.Item label="Observaciones">{control.observaciones}</Descriptions.Item>
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
    <Card title="Visualización de Parcelas y Controles de Tierra" bordered={false} style={{ marginTop: 20 }}>
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

export default ParcelSoilControlOverview;
