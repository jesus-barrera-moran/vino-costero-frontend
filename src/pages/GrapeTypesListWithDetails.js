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
    ph_requerido: 6.0,
    humedad_requerida: '30',
    temperatura_requerida: '50',
    tiempoCosecha: 120,
    parcelas: [
      {
        id: 1,
        nombre: 'Parcela 1',
        dimensiones: {
          superficie: 10,
          longitud: 500,
          anchura: 200,
          pendiente: 15,
        },
        siembraActual: {
          cantidad_plantas: 150,
          tecnica_siembra: 'Trasplante',
          observaciones: 'Crecimiento óptimo',
        },
        controlTierra: {
          ph: 6.2,
          humedad: 32,
          temperatura: 18,
          observaciones: 'Condiciones normales',
        },
      },
      {
        id: 2,
        nombre: 'Parcela 3',
        dimensiones: {
          superficie: 12,
          longitud: 600,
          anchura: 250,
          pendiente: 18,
        },
        siembraActual: {
          cantidad_plantas: 200,
          tecnica_siembra: 'Siembra directa',
          observaciones: 'Buen desarrollo',
        },
        controlTierra: {
          ph: 6.1,
          humedad: 30,
          temperatura: 17,
          observaciones: 'Condiciones normales',
        },
      },
    ],
  },
  {
    id: 2,
    nombre: 'Pinot Noir',
    descripcion: 'Variedad de uva tinta utilizada para vinos elegantes y de carácter.',
    ph_requerido: 6.2,
    humedad_requerida: '35',
    temperatura_requerida: '40',
    tiempoCosecha: 150,
    parcelas: [
      {
        id: 2,
        nombre: 'Parcela 2',
        dimensiones: {
          superficie: 8,
          longitud: 400,
          anchura: 150,
          pendiente: 12,
        },
        siembraActual: {
          cantidad_plantas: 180,
          tecnica_siembra: 'Trasplante',
          observaciones: 'Crecimiento lento',
        },
        controlTierra: {
          ph: 6.5,
          humedad: 36,
          temperatura: 19,
          observaciones: 'Condiciones normales',
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
        <Button type="primary" onClick={() => navigate(`/edit-grape-type/${record.id}`)}>
          Modificar
        </Button>
      ),
    },
  ];

  // Función para mostrar los detalles del tipo de uva y las parcelas relacionadas
  const expandedRowRender = (uva) => {
    return (
      <Collapse accordion>
        {/* Acordeón para los detalles del tipo de uva */}
        <Panel header="Detalles del Tipo de Uva" key="1">
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Nombre">{uva.nombre}</Descriptions.Item>
            <Descriptions.Item label="Descripción">{uva.descripcion}</Descriptions.Item>
            <Descriptions.Item label="PH Requerido del Suelo">{uva.ph_requerido}</Descriptions.Item>
            <Descriptions.Item label="Humedad Requerida">{uva.humedad_requerida}%</Descriptions.Item>
            <Descriptions.Item label="Temperatura Requerida">{uva.temperatura_requerida}°C</Descriptions.Item>
            <Descriptions.Item label="Tiempo de Cosecha">{uva.tiempoCosecha} días</Descriptions.Item>
          </Descriptions>
        </Panel>

        {/* Acordeón para las parcelas donde está plantada la uva */}
        <Panel header="Parcelas donde está plantada" key="2">
          <Collapse accordion>
            {uva.parcelas.map((parcela, index) => (
              <Panel header={`Parcela: ${parcela.nombre}`} key={index + 1}>
                {/* Acordeón para la Siembra Activa */}
                <Collapse accordion>
                  <Panel header="Siembra Activa" key={`siembra-${index}`}>
                    <Descriptions column={1} bordered>
                      <Descriptions.Item label="Cantidad de Plantas">{parcela.siembraActual.cantidad_plantas}</Descriptions.Item>
                      <Descriptions.Item label="Técnica de Siembra">{parcela.siembraActual.tecnica_siembra}</Descriptions.Item>
                      <Descriptions.Item label="Observaciones">{parcela.siembraActual.observaciones}</Descriptions.Item>
                    </Descriptions>
                  </Panel>

                  {/* Acordeón para las Dimensiones */}
                  <Panel header="Dimensiones" key={`dimensiones-${index}`}>
                    <Descriptions column={2} bordered>
                      <Descriptions.Item label="Superficie">{parcela.dimensiones.superficie} hectáreas</Descriptions.Item>
                      <Descriptions.Item label="Longitud">{parcela.dimensiones.longitud} metros</Descriptions.Item>
                      <Descriptions.Item label="Anchura">{parcela.dimensiones.anchura} metros</Descriptions.Item>
                      <Descriptions.Item label="Pendiente">{parcela.dimensiones.pendiente}%</Descriptions.Item>
                    </Descriptions>
                  </Panel>

                  {/* Acordeón para el Último Control de Tierra */}
                  <Panel header="Último Control de Tierra" key={`controlTierra-${index}`}>
                    <Descriptions column={2} bordered>
                      <Descriptions.Item label="PH del Suelo">{parcela.controlTierra.ph}</Descriptions.Item>
                      <Descriptions.Item label="Humedad">{parcela.controlTierra.humedad}%</Descriptions.Item>
                      <Descriptions.Item label="Temperatura">{parcela.controlTierra.temperatura}°C</Descriptions.Item>
                      <Descriptions.Item label="Observaciones">{parcela.controlTierra.observaciones}</Descriptions.Item>
                    </Descriptions>
                  </Panel>
                </Collapse>
              </Panel>
            ))}
          </Collapse>
        </Panel>
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
