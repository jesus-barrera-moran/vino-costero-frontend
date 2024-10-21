import React, { useState, useEffect } from 'react';
import { Layout, Table, Card, Collapse, Descriptions, Timeline, Button, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { EditOutlined } from '@ant-design/icons'; // Íconos
import NavBarMenu from './NavBarMenu';

const { Content, Footer } = Layout;
const { Panel } = Collapse;

// Función para verificar permisos
const checkPermission = (allowedRoles) => {
  const userRoles = JSON.parse(localStorage.getItem("roles")) || [];
  return Array.isArray(userRoles) ? userRoles.some(role => allowedRoles.includes(role)) : allowedRoles.includes(userRoles);
};

const ParcelSowingOverview = () => {
  const navigate = useNavigate();
  const [parcelas, setParcelas] = useState([]);
  const [loading, setLoading] = useState(true); // Para mostrar el estado de carga

  // Verificar si el usuario tiene el token, sino redirigir a login
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('Debe estar autenticado para acceder a esta página');
      navigate('/login'); // Redirige al login si no hay token
    }
  }, [navigate]);

  // Permisos basados en CU_05
  const canCreateOrEdit = checkPermission([1, 2, 3, 4]);
  const canView = checkPermission([1, 2, 3, 4, 5]);

  // Redirigir si no tienen permiso para ver
  useEffect(() => {
    if (!canView) {
      message.error('No tiene permisos para ver esta página');
      navigate('/');
    }
  }, [canView, navigate]);

  // Función para obtener las parcelas con siembras activas e historiales de siembra
  const fetchParcelas = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); // Obtener el token del localStorage
      const response = await fetch(`${process.env.BACKEND_HOST}/siembras`, {
        headers: {
          'Authorization': `Bearer ${token}`,  // Incluir el token en la cabecera
          'Content-Type': 'application/json',
        },
      }); // Ajustar la URL según el backend
      if (response.status === 401) {
        // Si la respuesta es 401, redirigir al login
        message.error('Sesión expirada. Por favor, inicie sesión de nuevo.');
        localStorage.removeItem('token'); // Remover el token inválido
        navigate('/login'); // Redirigir al login
        return;
      }
      if (!response.ok) {
        throw new Error('Error al obtener las parcelas con siembras');
      }
      const data = await response.json();
      setParcelas(data);
      setLoading(false);
    } catch (error) {
      message.error('Hubo un error al cargar las siembras.');
      setLoading(false);
    }
  };

  // Llamar al endpoint al cargar el componente
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
      title: 'Tipo de Uva',
      dataIndex: ['siembraActual', 'tipoUva'],
      key: 'tipoUva',
      align: 'center',
    },
    {
      title: 'Cantidad de Plantas',
      dataIndex: ['siembraActual', 'cantidadPlantas'],
      key: 'cantidadPlantas',
      align: 'center',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      align: 'center',
      render: (parcela) => (
        canCreateOrEdit && (
          <EditOutlined
            style={{ color: '#8B0000', fontSize: '18px' }}
            onClick={() => navigate(`/edit-sowing/${parcela.id}`)}
          />
        )
      ),
    },
  ];

  // Función para mostrar los detalles de la siembra actual y el historial de siembras
  const expandedRowRender = (parcela) => {
    return (
      <Collapse accordion bordered={false} style={{ backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
        <Panel header="Siembra Actual" key="1" style={{ backgroundColor: '#ffffff', borderRadius: '5px', marginBottom: '5px' }}>
          {parcela.siembraActual ? (
            <Descriptions size='small' column={2} bordered>
              <Descriptions.Item label="Tipo de Uva">{parcela.siembraActual.tipoUva}</Descriptions.Item>
              <Descriptions.Item label="Cantidad de Plantas">{parcela.siembraActual.cantidadPlantas}</Descriptions.Item>
              <Descriptions.Item label="Técnica de Siembra">{parcela.siembraActual.tecnica}</Descriptions.Item>
              <Descriptions.Item label="Observaciones">{parcela.siembraActual.observaciones}</Descriptions.Item>
            </Descriptions>
          ) : (
            <p>No hay siembra activa en esta parcela.</p>
          )}
        </Panel>
        <Panel header="Historial de Siembras" key="2" style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}>
          <Timeline>
            {parcela.historialSiembras.length > 0 ? (
              parcela.historialSiembras.map((siembra, index) => (
                <Timeline.Item key={index}>
                  <Collapse bordered={false}>
                    <Panel header={`Siembra del ${siembra.fechaCreacion}`} key={index + 1} style={{ backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
                      <Descriptions size='small' column={1} bordered>
                        <Descriptions.Item label="Tipo de Uva">{siembra.tipoUva}</Descriptions.Item>
                        <Descriptions.Item label="Cantidad de Plantas">{siembra.cantidadPlantas}</Descriptions.Item>
                        <Descriptions.Item label="Técnica de Siembra">{siembra.tecnica}</Descriptions.Item>
                        <Descriptions.Item label="Observaciones">{siembra.observaciones}</Descriptions.Item>
                      </Descriptions>
                    </Panel>
                  </Collapse>
                </Timeline.Item>
              ))
            ) : (
              <p>No hay historial de siembras.</p>
            )}
          </Timeline>
        </Panel>
      </Collapse>
    );
  };

  // Muestra el estado de carga mientras los datos se están obteniendo
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" tip="Cargando siembras..." />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      {/* Barra de navegación superior */}
      <NavBarMenu defaultSelectedKeys={['2']} />

      {/* Contenido Principal */}
      <Content style={{ padding: '24px' }}>
        <Card title="Siembras de Parcelas" bordered={false} style={{ marginTop: 20 }}>
          {canCreateOrEdit && (
            <Button type="primary" style={{ marginBottom: 16, backgroundColor: '#8B0000', borderColor: '#8B0000' }} onClick={() => navigate('/create-sowing')}>
              Registrar Nueva Siembra
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

export default ParcelSowingOverview;
