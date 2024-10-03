import React, { useState, useEffect } from 'react';
import { Layout, Menu, Table, Card, Collapse, Descriptions, Timeline, Button, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { EditOutlined, DatabaseOutlined, BarChartOutlined, AppstoreAddOutlined, UserOutlined, FileDoneOutlined } from '@ant-design/icons'; // Íconos

const { Header, Content, Footer } = Layout;
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
      const response = await fetch('http://localhost:3000/siembras', {
        headers: {
          'Authorization': `Bearer ${token}`,  // Incluir el token en la cabecera
          'Content-Type': 'application/json',
        },
      }); // Ajustar la URL según el backend
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
    },
    {
      title: 'Cantidad de Plantas',
      dataIndex: ['siembraActual', 'cantidadPlantas'],
      key: 'cantidadPlantas',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (parcela) => (
        canCreateOrEdit && (
          <Button
            type="default"
            icon={<EditOutlined />}
            style={{ color: '#52c41a' }} // Verde para la siembra
            onClick={() => navigate(`/edit-sowing/${parcela.id}`)}
          >
            Editar
          </Button>
        )
      ),
    },
  ];

  // Función para mostrar los detalles de la siembra actual y el historial de siembras
  const expandedRowRender = (parcela) => {
    return (
      <Collapse accordion>
        {/* Siembra Actual */}
        <Panel
          header="Siembra Actual"
          key="1"
        >
          {parcela.siembraActual ? (
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Tipo de Uva">{parcela.siembraActual.tipoUva}</Descriptions.Item>
              <Descriptions.Item label="Cantidad de Plantas">{parcela.siembraActual.cantidadPlantas}</Descriptions.Item>
              <Descriptions.Item label="Técnica de Siembra">{parcela.siembraActual.tecnica}</Descriptions.Item>
              <Descriptions.Item label="Observaciones">{parcela.siembraActual.observaciones}</Descriptions.Item>
            </Descriptions>
          ) : (
            <p>No hay siembra activa en esta parcela.</p>
          )}
        </Panel>

        {/* Historial de Siembras */}
        <Panel header="Historial de Siembras" key="2">
          {parcela.historialSiembras.length > 0 ? (
            <Timeline>
              {parcela.historialSiembras.map((siembra, index) => (
                <Timeline.Item key={index}>
                  <Collapse>
                    <Panel header={`Siembra del ${siembra.fechaCreacion}`} key={index + 1}>
                      <Descriptions column={2} bordered>
                        <Descriptions.Item label="Tipo de Uva">{siembra.tipoUva}</Descriptions.Item>
                        <Descriptions.Item label="Cantidad de Plantas">{siembra.cantidadPlantas}</Descriptions.Item>
                        <Descriptions.Item label="Técnica de Siembra">{siembra.tecnica}</Descriptions.Item>
                        <Descriptions.Item label="Observaciones">{siembra.observaciones}</Descriptions.Item>
                      </Descriptions>
                    </Panel>
                  </Collapse>
                </Timeline.Item>
              ))}
            </Timeline>
          ) : (
            <p>No hay historial de siembras.</p>
          )}
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
      <Header style={{ backgroundColor: '#004d40', padding: 0 }}>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} style={{ backgroundColor: '#004d40' }}>
          <Menu.Item key="1" icon={<DatabaseOutlined />}>Producción de vinos</Menu.Item>
          <Menu.Item key="2" icon={<AppstoreAddOutlined />}>Control de parcelas</Menu.Item>
          <Menu.Item key="3" icon={<FileDoneOutlined />}>Control de calidad</Menu.Item>
          <Menu.Item key="4" icon={<BarChartOutlined />}>Logística</Menu.Item>
          <Menu.Item key="5" icon={<UserOutlined />}>Análisis de negocios</Menu.Item>
        </Menu>
      </Header>

      {/* Contenido Principal */}
      <Content style={{ padding: '24px' }}>
        <Card title="Visualización de Parcelas y Siembras" bordered={false} style={{ marginTop: 20 }}>
          {canCreateOrEdit && (
            <Button type="primary" style={{ marginBottom: 16, backgroundColor: '#8B0000', borderColor: '#8B0000' }} onClick={() => navigate('/create-sowing')}>
              Registrar Nueva Siembra
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
      </Content>

      {/* Footer */}
      <Footer style={{ textAlign: 'center', backgroundColor: '#004d40', color: '#fff' }}>
        Vino Costero ©2024 - Sistema de Control de Producción y Logística
      </Footer>
    </Layout>
  );
};

export default ParcelSowingOverview;
