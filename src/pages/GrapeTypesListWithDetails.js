import React, { useState, useEffect } from 'react';
import { Layout, Table, Card, Collapse, Descriptions, Button, Spin, message, Alert } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import NavBarMenu from './NavBarMenu';

const { Content, Footer } = Layout;
const { Panel } = Collapse;

// Función para verificar permisos
const checkPermission = (allowedRoles) => {
  const userRoles = JSON.parse(localStorage.getItem("roles")) || [];
  return Array.isArray(userRoles) ? userRoles.some(role => allowedRoles.includes(role)) : allowedRoles.includes(userRoles);
};

const GrapeTypeOverview = () => {
  const navigate = useNavigate();
  const [tiposUva, setTiposUva] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga

  // Verificar si el usuario tiene el token, sino redirigir a login
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('Debe estar autenticado para acceder a esta página');
      navigate('/login'); // Redirige al login si no hay token
    }
  }, [navigate]);

  // Permisos basados en CU_04
  const canCreate = checkPermission([1, 2]);
  const canEdit = checkPermission([1, 2]);
  const canView = checkPermission([1, 2, 5]);

  // Redirigir si no tienen permiso para ver
  useEffect(() => {
    if (!canView) {
      message.error('No tiene permisos para ver esta página');
      navigate('/');
    }
  }, [canView, navigate]);

  // Función para obtener los tipos de uva desde el backend
  const fetchTiposUva = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); // Obtener el token del localStorage
      const response = await fetch(`${process.env.BACKEND_HOST}/tiposUvas`, {
        headers: {
          'Authorization': `Bearer ${token}`,  // Incluir el token en la cabecera
          'Content-Type': 'application/json',
        },
      }); // Ajustar la URL según tu configuración
      if (response.status === 401) {
        // Si la respuesta es 401, redirigir al login
        message.error('Sesión expirada. Por favor, inicie sesión de nuevo.');
        localStorage.removeItem('token'); // Remover el token inválido
        navigate('/login'); // Redirigir al login
        return;
      }
      if (!response.ok) {
        throw new Error('Error al obtener los tipos de uva');
      }
      const data = await response.json();
      setTiposUva(data);
      setLoading(false); // Detener el estado de carga cuando se obtienen los datos
    } catch (error) {
      message.error('Error al cargar los tipos de uva.');
      setLoading(false); // Detener el estado de carga si hay un error
    }
  };

  useEffect(() => {
    fetchTiposUva();
  }, []);

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
      align: 'center',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      align: 'center',
      render: (record) => (
        canEdit && (
          <EditOutlined
            style={{ color: '#8B0000', fontSize: '18px' }}
            onClick={() => navigate(`/edit-grape-type/${record.id}`)}
          />
        )
      ),
    },
  ];

  const handleCreateSiembra = () => {
    navigate(`/create-sowing/`);
  };

  // Función para mostrar los detalles del tipo de uva y las parcelas relacionadas
  const expandedRowRender = (uva) => {
    return (
      <Collapse accordion bordered={false} style={{ backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
        <Panel
          header={<span>Detalles del Tipo de Uva</span>}
          key="1"
          style={{ backgroundColor: '#ffffff', borderRadius: '5px', marginBottom: '5px' }}
        >
          <Descriptions size='small' column={1} bordered>
            <Descriptions.Item label="Nombre">{uva.nombre}</Descriptions.Item>
            <Descriptions.Item label="Descripción">{uva.descripcion}</Descriptions.Item>
            <Descriptions.Item label="PH Requerido del Suelo">{uva.ph_requerido}</Descriptions.Item>
            <Descriptions.Item label="Humedad Requerida">{uva.humedad_requerida}%</Descriptions.Item>
            <Descriptions.Item label="Temperatura Requerida">{uva.temperatura_requerida}°C</Descriptions.Item>
            <Descriptions.Item label="Tiempo de Cosecha">{uva.tiempoCosecha} días</Descriptions.Item>
          </Descriptions>
        </Panel>

        <Panel
          header={<span>Parcelas donde está plantada</span>}
          key="2"
          style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
        >
          <Collapse accordion bordered={false}>
            {uva.parcelas && uva.parcelas.length > 0 ? (
              uva.parcelas.map((parcela, index) => (
                <Panel
                  header={<span>Parcela: {parcela.nombre}</span>}
                  key={`parcela-${index}`}
                  style={{ backgroundColor: '#f5f5f5', borderRadius: '5px', marginBottom: '5px' }}
                >
                  <Collapse accordion bordered={false}>
                    <Panel
                      header={<span>Siembra Activa</span>}
                      key={`siembra-${index}`}
                      style={{ backgroundColor: '#ffffff', borderRadius: '5px', marginBottom: '5px' }}
                    >
                      <Descriptions size='small' column={1} bordered>
                        <Descriptions.Item label="Cantidad de Plantas">{parcela.siembraActual.cantidad_plantas}</Descriptions.Item>
                        <Descriptions.Item label="Técnica de Siembra">{parcela.siembraActual.tecnica_siembra}</Descriptions.Item>
                        <Descriptions.Item label="Observaciones">{parcela.siembraActual.observaciones}</Descriptions.Item>
                      </Descriptions>
                    </Panel>

                    <Panel
                      header={<span>Dimensiones</span>}
                      key={`dimensiones-${index}`}
                      style={{ backgroundColor: '#ffffff', borderRadius: '5px', marginBottom: '5px' }}
                    >
                      <Descriptions size='small' column={1} bordered>
                        <Descriptions.Item label="Superficie">{parcela.dimensiones.superficie} hectáreas</Descriptions.Item>
                        <Descriptions.Item label="Longitud">{parcela.dimensiones.longitud} metros</Descriptions.Item>
                        <Descriptions.Item label="Anchura">{parcela.dimensiones.anchura} metros</Descriptions.Item>
                        <Descriptions.Item label="Pendiente">{parcela.dimensiones.pendiente}%</Descriptions.Item>
                      </Descriptions>
                    </Panel>

                    <Panel
                      header={<span>Último Control de Tierra</span>}
                      key={`controlTierra-${index}`}
                      style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                    >
                      <Descriptions size='small' column={1} bordered>
                        <Descriptions.Item label="PH del Suelo">{parcela.controlTierra.ph}</Descriptions.Item>
                        <Descriptions.Item label="Humedad">{parcela.controlTierra.humedad}%</Descriptions.Item>
                        <Descriptions.Item label="Temperatura">{parcela.controlTierra.temperatura}°C</Descriptions.Item>
                        <Descriptions.Item label="Observaciones">{parcela.controlTierra.observaciones}</Descriptions.Item>
                      </Descriptions>
                    </Panel>
                  </Collapse>
                </Panel>
              ))
            ) : (
              <div>
                <Alert
                  message="No hay siembra activa para este tipo de uva."
                  description="Puedes agregar una nueva siembra para este tipo de uva."
                  type="warning"
                  showIcon
                />
                {canCreate && (
                  <PlusOutlined
                    style={{ color: '#8B0000', fontSize: '18px', marginTop: '10px' }}
                    onClick={() => handleCreateSiembra()}
                  />
                )}
              </div>
            )}
          </Collapse>
        </Panel>
      </Collapse>
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" tip="Cargando tipos de uva..." />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      <NavBarMenu defaultSelectedKeys={['2']} />

      <Content style={{ padding: '24px' }}>
        <Card title="Tipos de Uva" bordered={false} style={{ marginTop: 20 }}>
          {canCreate && (
            <Button
              type="primary"
              style={{ marginBottom: 16, backgroundColor: '#8B0000', borderColor: '#8B0000' }}
              onClick={() => navigate('/create-grape-type')}
            >
              Registrar Nuevo Tipo de Uva
            </Button>
          )}
          <Table
            columns={columns}
            dataSource={tiposUva}
            rowKey="id"
            expandable={{ expandedRowRender }}
            bordered
          />
        </Card>
      </Content>

      <Footer style={{ textAlign: 'center', backgroundColor: '#004d40', color: '#fff' }}>
        Vino Costero ©2024 - Sistema de Control de Producción y Logística
      </Footer>
    </Layout>
  );
};

export default GrapeTypeOverview;
