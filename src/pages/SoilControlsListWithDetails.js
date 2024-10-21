import React, { useState, useEffect } from 'react';
import { Layout, Table, Card, Collapse, Descriptions, Timeline, Button, message, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import NavBarMenu from './NavBarMenu';

const { Content, Footer } = Layout;
const { Panel } = Collapse;

const { BACKEND_HOST } = require('../config/config');

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
      const response = await fetch(`${BACKEND_HOST}/controlesTierra`, {
        headers: {
          'Authorization': `Bearer ${token}`,  // Incluir el token en la cabecera
          'Content-Type': 'application/json',
        },
      }); // Ajustar la URL según tu backend
      if (response.status === 401) {
        // Si la respuesta es 401, redirigir al login
        message.error('Sesión expirada. Por favor, inicie sesión de nuevo.');
        localStorage.removeItem('token'); // Remover el token inválido
        navigate('/login'); // Redirigir al login
        return;
      }
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
      title: 'Humedad',
      dataIndex: ['ultimoControlTierra', 'humedad'],
      key: 'humedad',
      align: 'center',
    },
    {
      title: 'Temperatura',
      dataIndex: ['ultimoControlTierra', 'temperatura'],
      key: 'temperatura',
      align: 'center',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      align: 'center',
      render: (record) => (
        canCreate && (
          <PlusOutlined
            style={{ color: '#8B0000', fontSize: '18px' }}
            onClick={() => navigate(`/create-soil-control/${record.id}`)}
          />
        )
      ),
    },
  ];

  // Función para mostrar los detalles del último control de tierra y el historial
  const expandedRowRender = (parcela) => {
    return (
      <Collapse accordion bordered={false} style={{ backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
        <Panel header={<span>Último Control de Tierra</span>} key="1" style={{ backgroundColor: '#ffffff', borderRadius: '5px', marginBottom: '5px' }}>
          <Descriptions size='small' column={1} bordered>
            <Descriptions.Item label="PH">{parcela.ultimoControlTierra?.ph || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Humedad">{parcela.ultimoControlTierra?.humedad || 'N/A'}%</Descriptions.Item>
            <Descriptions.Item label="Temperatura">{parcela.ultimoControlTierra?.temperatura || 'N/A'}°C</Descriptions.Item>
            <Descriptions.Item label="Observaciones">{parcela.ultimoControlTierra?.observaciones || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Fecha">{parcela.ultimoControlTierra?.fecha || 'N/A'}</Descriptions.Item>
          </Descriptions>
        </Panel>
        <Panel header={<span>Historial de Controles de Tierra</span>} key="2" style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}>
          <Timeline>
            {parcela.controlesTierra.length > 0 ? (
              parcela.controlesTierra.map((control, index) => (
                <Timeline.Item key={index}>
                  <Collapse bordered={false}>
                    <Panel header={`Control de Tierra del ${control.fecha}`} key={index + 1} style={{ backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
                      <Descriptions size='small' column={1} bordered>
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
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" tip="Cargando controles de tierra..." />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      {/* Barra de navegación superior */}
      <NavBarMenu defaultSelectedKeys={['2']} />

      {/* Contenido Principal */}
      <Content style={{ padding: '24px' }}>
        <Card title="Controles de Tierra de Parcelas" bordered={false} style={{ marginTop: 20 }}>
          {canCreate && (
            <Button
              type="primary"
              style={{ marginBottom: 16, backgroundColor: '#8B0000', borderColor: '#8B0000' }}
              onClick={() => navigate('/create-soil-control')}
            >
              Crear Control de Tierra
            </Button>
          )}
          <Table
            columns={columns}
            dataSource={parcelas}
            rowKey="id"
            expandable={{ expandedRowRender }}
            bordered
          />
        </Card>
      </Content>

      {/* Footer */}
      <Footer style={{ textAlign: 'center', backgroundColor: '#004d40', color: '#fff' }}>
        Vino Costero ©2024 - Sistema de Control de Producción y Logística
      </Footer>
    </Layout>
  );
};

export default ParcelSoilControlOverview;
