import React, { useState, useEffect } from 'react';
import { Table, Card, Collapse, Descriptions, Timeline, Button, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Panel } = Collapse;

const ParcelSoilControlOverview = () => {
  const navigate = useNavigate();
  const [parcelas, setParcelas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para obtener las parcelas y sus controles de tierra desde el backend
  const fetchParcelas = async () => {
    try {
      const response = await fetch('http://localhost:3000/controlesTierra'); // Ajustar la URL según tu backend
      if (!response.ok) {
        throw new Error('Error al obtener los controles de tierra');
      }
      const data = await response.json();
      setParcelas(data);
      setLoading(false);
    } catch (error) {
      message.error('Hubo un error al cargar los controles de tierra.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParcelas();
  }, []);

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
            <Descriptions.Item label="PH">{parcela.ultimoControlTierra?.ph || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Humedad">{parcela.ultimoControlTierra?.humedad || 'N/A'}%</Descriptions.Item>
            <Descriptions.Item label="Temperatura">{parcela.ultimoControlTierra?.temperatura || 'N/A'}°C</Descriptions.Item>
            <Descriptions.Item label="Observaciones">{parcela.ultimoControlTierra?.observaciones || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Fecha">{parcela.ultimoControlTierra?.fecha || 'N/A'}</Descriptions.Item>
          </Descriptions>
        </Panel>

        {/* Historial de Controles de Tierra */}
        <Panel header="Historial de Controles de Tierra" key="2">
          <Timeline>
            {parcela.controlesTierra.length > 0 ? (
              parcela.controlesTierra.map((control, index) => (
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
              ))
            ) : (
              <p>No hay historial disponible para esta parcela.</p>
            )}
          </Timeline>
        </Panel>
      </Collapse>
    );
  };

  if (loading) {
    return <Spin tip="Cargando parcelas y controles de tierra..." />;
  }

  return (
    <Card title="Visualización de Parcelas y Controles de Tierra" bordered={false} style={{ marginTop: 20 }}>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={() => navigate('/create-soil-control')}>
        Crear Control de Tierra
      </Button>
      <Table
        columns={columns}
        dataSource={parcelas}
        rowKey="id"
        expandable={{
          expandedRowRender: (record) => expandedRowRender(record),
        }}
      />
    </Card>
  );
};

export default ParcelSoilControlOverview;
