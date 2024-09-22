import React from 'react';
import { Table, Card, Collapse, Descriptions, Timeline, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Panel } = Collapse;

// Simulación de datos de parcelas con dimensiones y su historial
const parcelasExistentes = [
  {
    id: 1,
    nombre: 'Parcela 1',
    dimensionesActuales: {
      superficie: 10,  // En hectáreas
      longitud: 500,   // En metros
      anchura: 200,    // En metros
      pendiente: 15,
      fecha: '2023-05-01',
    },
    historialDimensiones: [
      {
        superficie: 8,
        longitud: 400,
        anchura: 180,
        pendiente: 12,
        fecha: '2023-05-15',
      },
      {
        superficie: 9,
        longitud: 450,
        anchura: 190,
        pendiente: 14,
        fecha: '2023-07-01',
      },
    ],
  },
  {
    id: 2,
    nombre: 'Parcela 2',
    dimensionesActuales: {
      superficie: 8,  // En hectáreas
      longitud: 400,  // En metros
      anchura: 150,   // En metros
      pendiente: 12,
      fecha: '2023-04-15',
    },
    historialDimensiones: [],
  },
];

// Función para calcular el área ocupada (longitud * anchura en metros cuadrados)
const calcularAreaOcupada = (longitud, anchura) => {
  const areaOcupada = longitud * anchura; // Área en metros cuadrados
  return areaOcupada / 10000; // Convertir a hectáreas (1 ha = 10,000 m²)
};

// Función para calcular el porcentaje del área ocupada
const calcularPorcentajeOcupado = (areaOcupada, superficieTotal) => {
  return ((areaOcupada / superficieTotal) * 100).toFixed(2); // Redondear a 2 decimales
};

const ParcelDimensionsOverview = () => {
  const navigate = useNavigate();

  // Columnas para el listado de parcelas con dimensiones actuales
  const columns = [
    {
      title: 'Nombre de la Parcela',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Superficie (ha)',
      dataIndex: ['dimensionesActuales', 'superficie'],
      key: 'superficie',
    },
    {
      title: 'Longitud (m)',
      dataIndex: ['dimensionesActuales', 'longitud'],
      key: 'longitud',
    },
    {
      title: 'Anchura (m)',
      dataIndex: ['dimensionesActuales', 'anchura'],
      key: 'anchura',
    },
    {
      title: 'Pendiente (%)',
      dataIndex: ['dimensionesActuales', 'pendiente'],
      key: 'pendiente',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (record) => (
        <Button
          type="primary"
          onClick={() => navigate(`/edit-dimensions/${record.id}`)}
        >
          Editar
        </Button>
      ),
    },
  ];

  // Función para mostrar el contenido expandido de cada fila (dimensiones actuales con cálculos)
  const expandedRowRender = (parcela) => {
    const { longitud, anchura, superficie } = parcela.dimensionesActuales;
    const areaOcupada = calcularAreaOcupada(longitud, anchura);
    const porcentajeOcupado = calcularPorcentajeOcupado(areaOcupada, superficie);

    return (
      <Collapse accordion>
        {/* Detalles de Dimensiones Actuales */}
        <Panel header="Detalles de Dimensiones Actuales" key="1">
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Superficie Total">{superficie} hectáreas</Descriptions.Item>
            <Descriptions.Item label="Área Ocupada">{areaOcupada.toFixed(2)} hectáreas</Descriptions.Item>
            <Descriptions.Item label="Porcentaje Ocupado">{porcentajeOcupado}%</Descriptions.Item>
            <Descriptions.Item label="Longitud">{longitud} metros</Descriptions.Item>
            <Descriptions.Item label="Anchura">{anchura} metros</Descriptions.Item>
            <Descriptions.Item label="Pendiente">{parcela.dimensionesActuales.pendiente}%</Descriptions.Item>
            <Descriptions.Item label="Fecha">{parcela.dimensionesActuales.fecha}</Descriptions.Item>
          </Descriptions>
        </Panel>

        {/* Historial de Dimensiones */}
        <Panel header="Historial de Dimensiones" key="2">
          <Timeline>
            {parcela.historialDimensiones.map((dimension, index) => (
              <Timeline.Item key={index}>
                <Collapse>
                  <Panel header={`Dimensiones al ${dimension.fecha}`} key={index + 1}>
                    <Descriptions column={2} bordered>
                      <Descriptions.Item label="Superficie">{dimension.superficie} ha</Descriptions.Item>
                      <Descriptions.Item label="Longitud">{dimension.longitud} m</Descriptions.Item>
                      <Descriptions.Item label="Anchura">{dimension.anchura} m</Descriptions.Item>
                      <Descriptions.Item label="Pendiente">{dimension.pendiente}%</Descriptions.Item>
                    </Descriptions>
                  </Panel>
                </Collapse>
              </Timeline.Item>
            ))}
            {parcela.historialDimensiones.length === 0 && (
              <p>No hay historial disponible para esta parcela.</p>
            )}
          </Timeline>
        </Panel>
      </Collapse>
    );
  };

  return (
    <Card title="Visualización de Dimensiones de Parcelas" bordered={false} style={{ marginTop: 20 }}>
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

export default ParcelDimensionsOverview;
