import React, { useState, useEffect } from 'react';
import { Table, Card, Collapse, Descriptions, Timeline, Button, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Panel } = Collapse;

// Función para verificar permisos
const checkPermission = (allowedRoles) => {
  const userRoles = JSON.parse(localStorage.getItem("roles")) || [];
  return Array.isArray(userRoles) ? userRoles.some(role => allowedRoles.includes(role)) : allowedRoles.includes(userRoles);
};

const ParcelSoilControlOverview = () => {
  const navigate = useNavigate();
  const [parcelas, setParcelas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Verificar si el usuario tiene el token, sino redirigir a login
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('Debe estar autenticado para acceder a esta página');
      navigate('/login'); // Redirige al login si no hay token
    }
  }, [navigate]);

  // Permisos basados en CU_03
  const canCreate = checkPermission([1, 3]);
  const canView = checkPermission([1, 3, 5]);

  // Redirigir si no tienen permiso para ver
  useEffect(() => {
    if (!canView) {
      message.error('No tiene permisos para ver esta página');
      navigate('/');
    }
  }, [canView, navigate]);

  // Función para obtener las parcelas y sus controles de tierra desde el backend
  const fetchParcelas = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); // Obtener el token del localStorage
      const response = await fetch('http://localhost:3000/controlesTierra', {
        headers: {
          'Authorization': `Bearer ${token}`,  // Incluir el token en la cabecera
          'Content-Type': 'application/json',
        },
      }); // Ajustar la URL según tu backend
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
        canCreate && (
          <Button
            type="primary"
            onClick={() => navigate(`/create-soil-control/${record.id}`)}
          >
            Crear Control
          </Button>
        )
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
      {canCreate && (
        <Button type="primary" style={{ marginBottom: 16 }} onClick={() => navigate('/create-soil-control')}>
          Crear Control de Tierra
        </Button>
      )}
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
