import React from 'react';
import { Table, Card, Collapse, Descriptions, Timeline, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Panel } = Collapse;

// Simulación de datos de parcelas y controles de tierra
const parcelasExistentes = [
  {
    id: 1,
    nombre: 'Parcela 1',
    ultimoControlTierra: {
      ph: 6.5,
      humedad: 35,
      temperatura: 15,
      observaciones: 'Condiciones normales',
      fecha: '2023-07-14',
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
    ultimoControlTierra: {
      ph: 6.8,
      humedad: 38,
      temperatura: 18,
      observaciones: 'Condiciones óptimas',
      fecha: '2023-06-28',
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
      title: 'Húmedad',
      dataIndex: ['ultimoControlTierra', 'humedad'],
      key: 'humedad',
    },
    {
      title: 'Temperatura',
      dataIndex: ['ultimoControlTierra', 'temperatura'],
      key: 'temperatura',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (record) => (
        <Button
          type="primary"
          onClick={() => navigate(`/create-soil-control/${record.id}`)}
        >
          Crear Control
        </Button>
      ),
    },
  ];

  // Función para mostrar los detalles del último control de tierra y el historial
  const expandedRowRender = (parcela) => {
    return (
      <Collapse accordion>
        {/* Último Control de Tierra */}
        <Panel header="Último Control de Tierra" key="1">
          <Descriptions column={1} bordered>
            <Descriptions.Item label="PH">{parcela.ultimoControlTierra.ph}</Descriptions.Item>
            <Descriptions.Item label="Humedad">{parcela.ultimoControlTierra.humedad}%</Descriptions.Item>
            <Descriptions.Item label="Temperatura">{parcela.ultimoControlTierra.temperatura}°C</Descriptions.Item>
            <Descriptions.Item label="Observaciones">{parcela.ultimoControlTierra.observaciones}</Descriptions.Item>
            <Descriptions.Item label="Fecha">{parcela.ultimoControlTierra.fecha}</Descriptions.Item>
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
      <Button type="primary" style={{ marginBottom: 16 }} onClick={() => navigate('/create-soil-control')}>
        Crear Control de Tierra
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

export default ParcelSoilControlOverview;
