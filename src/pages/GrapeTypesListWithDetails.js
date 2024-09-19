import React from 'react';
import { Table, Card, Collapse, Descriptions, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Panel } = Collapse;

// Simulación de datos de tipos de uva y sus relaciones con múltiples parcelas
const tiposUvaExistentes = [
  {
    id: 1,
    nombre: 'Chardonnay',
    descripcion: 'Uva blanca famosa por su versatilidad en la elaboración de vinos blancos.',
    requisitosSuelo: {
      ph: 6.0,
      nutrientes: 'Moderados',
      humedad: '30-35%',
    },
    tiempoCosecha: 120,
    parcelas: [
      {
        id: 1,
        nombre: 'Parcela 1',
        dimensiones: {
          superficie: 10,
          longitud: 500,
          anchura: 200,
        },
        siembraActual: {
          fechaSiembra: '2023-05-10',
        },
        controlTierra: {
          ph: 6.2,
          humedad: 32,
          temperatura: 18,
        },
      },
      {
        id: 2,
        nombre: 'Parcela 3',
        dimensiones: {
          superficie: 12,
          longitud: 600,
          anchura: 250,
        },
        siembraActual: {
          fechaSiembra: '2023-04-15',
        },
        controlTierra: {
          ph: 6.1,
          humedad: 30,
          temperatura: 17,
        },
      },
    ],
  },
  {
    id: 2,
    nombre: 'Pinot Noir',
    descripcion: 'Variedad de uva tinta utilizada para vinos elegantes y de carácter.',
    requisitosSuelo: {
      ph: 6.2,
      nutrientes: 'Altos',
      humedad: '35-40%',
    },
    tiempoCosecha: 150,
    parcelas: [
      {
        id: 2,
        nombre: 'Parcela 2',
        dimensiones: {
          superficie: 8,
          longitud: 400,
          anchura: 150,
        },
        siembraActual: {
          fechaSiembra: '2023-06-20',
        },
        controlTierra: {
          ph: 6.5,
          humedad: 36,
          temperatura: 19,
        },
      },
    ],
  },
];

const GrapeTypeOverview = () => {
  const navigate = useNavigate();

  // Columnas para el listado de tipos de uva
  const columns = [
    {
      title: 'Nombre de la Uva',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
    },
    {
      title: 'Tiempo de Cosecha (días)',
      dataIndex: 'tiempoCosecha',
      key: 'tiempoCosecha',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (record) => (
        <Button type="primary" onClick={() => navigate(`/editar-tipo-uva/${record.id}`)}>
          Modificar
        </Button>
      ),
    },
  ];

  // Función para mostrar detalles de parcelas relacionadas en acordeones separados
  const expandedRowRender = (uva) => {
    return (
      <Collapse accordion>
        {uva.parcelas.map((parcela, index) => (
          <Panel header={`Parcela: ${parcela.nombre}`} key={index + 1}>
            <Collapse accordion>
              {/* Acordeón para la Siembra Activa */}
              <Panel header="Siembra Activa" key={`siembra-${index}`}>
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Fecha de Siembra">{parcela.siembraActual.fechaSiembra}</Descriptions.Item>
                </Descriptions>
              </Panel>

              {/* Acordeón para las Dimensiones */}
              <Panel header="Dimensiones" key={`dimensiones-${index}`}>
                <Descriptions column={2} bordered>
                  <Descriptions.Item label="Superficie">{parcela.dimensiones.superficie} hectáreas</Descriptions.Item>
                  <Descriptions.Item label="Longitud">{parcela.dimensiones.longitud} metros</Descriptions.Item>
                  <Descriptions.Item label="Anchura">{parcela.dimensiones.anchura} metros</Descriptions.Item>
                </Descriptions>
              </Panel>

              {/* Acordeón para el Último Control de Tierra */}
              <Panel header="Último Control de Tierra" key={`controlTierra-${index}`}>
                <Descriptions column={2} bordered>
                  <Descriptions.Item label="PH del Suelo">{parcela.controlTierra.ph}</Descriptions.Item>
                  <Descriptions.Item label="Humedad">{parcela.controlTierra.humedad}%</Descriptions.Item>
                  <Descriptions.Item label="Temperatura">{parcela.controlTierra.temperatura}°C</Descriptions.Item>
                </Descriptions>
              </Panel>
            </Collapse>
          </Panel>
        ))}
      </Collapse>
    );
  };

  return (
    <Card title="Gestión de Tipos de Uva" bordered={false} style={{ marginTop: 20 }}>
      <Table
        columns={columns}
        dataSource={tiposUvaExistentes}
        rowKey="id"
        expandable={{
          expandedRowRender: (record) => expandedRowRender(record),
        }}
      />
    </Card>
  );
};

export default GrapeTypeOverview;
