import React, { useEffect, useState } from 'react';
import { Layout, Table, Button, Space, Collapse, Descriptions, Card, message, Spin, Alert } from 'antd';
import { EditOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
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

const ParcelsListWithDetails = () => {
  const navigate = useNavigate();
  const [parcelas, setParcelas] = useState([]);
  const [loading, setLoading] = useState(false);

  // Verificar si el usuario tiene el token, sino redirigir a login
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('Debe estar autenticado para acceder a esta página');
      navigate('/login'); // Redirige al login si no hay token
    }
  }, [navigate]);

  // Permisos basados en roles
  const canCreate = checkPermission([1, 3]);
  const canEdit = checkPermission([1, 3]);
  const canView = checkPermission([1, 3, 5]);

  // Redirigir si no tienen permiso para ver
  useEffect(() => {
    if (!canView) {
      message.error('No tiene permisos para ver esta página');
      navigate('/');
    }
  }, [canView, navigate]);

  // Función para obtener todas las parcelas desde el backend
  const fetchParcelas = async () => {
    if (!loading) {
      setLoading(true);
      try {
        const token = localStorage.getItem('token'); // Obtener el token
        const response = await fetch(`${BACKEND_HOST}/parcelas`, {
          headers: {
            'Authorization': `Bearer ${token}`,  // Incluir el token en la cabecera
            'Content-Type': 'application/json',
          },
        });
        if (response.status === 401) {
          // Si la respuesta es 401, redirigir al login
          message.error('Sesión expirada. Por favor, inicie sesión de nuevo.');
          localStorage.removeItem('token'); // Remover el token inválido
          navigate('/login'); // Redirigir al login
          return;
        }
        if (!response.ok) {
          throw new Error('Error al obtener las parcelas');
        }
        const data = await response.json();
        setParcelas(data);
      } catch (error) {
        message.error('Hubo un error al cargar las parcelas.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Llamamos a fetchParcelas al montar el componente
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
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      align: 'center',
    },
    {
      title: 'Ubicación',
      dataIndex: 'ubicacion',
      key: 'ubicacion',
    },
    {
      title: 'Longitud',
      dataIndex: 'longitud',
      key: 'longitud',
      align: 'center',
    },
    {
      title: 'Latitud',
      dataIndex: 'latitud',
      key: 'latitud',
      align: 'center',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      align: 'center',
      render: (text, record) => (
        <Space size="middle">
          {canEdit && (
            <EditOutlined
              style={{ color: '#8B0000', fontSize: '18px' }}
              onClick={() => handleEdit(record.id)}
            />
          )}
        </Space>
      ),
    },
  ];

  // Función para manejar la redirección al formulario de edición
  const handleEdit = (id) => {
    if (canEdit) {
      navigate(`/edit-parcel/${id}`);
    }
  };

  const handleEditDimensions = (id) => {
    navigate(`/edit-dimensions/${id}`);
  };

  const handleEditSiembra = (id) => {
    navigate(`/edit-sowing/${id}`);
  };

  const handleCreateControlTierra = (id) => {
    navigate(`/create-soil-control/${id}`);
  };

  const handleCreateSiembra = (id) => {
    navigate(`/create-sowing/${id}`);
  };

  const expandedRowRender = (parcela) => {
    return (
      <Collapse accordion bordered={false} style={{ backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
        <Panel
          header={<Space>Dimensiones</Space>}
          key="1"
          style={{ backgroundColor: '#ffffff', borderRadius: '5px', marginBottom: '5px' }}
          extra={
            canEdit && (
              <EditOutlined style={{ color: '#1890ff' }} onClick={() => handleEditDimensions(parcela.id)} />
            )
          }
        >
          <Descriptions size='small' column={1} bordered>
            <Descriptions.Item label="Superficie">{parcela.dimensiones.superficie} hectáreas</Descriptions.Item>
            <Descriptions.Item label="Longitud">{parcela.dimensiones.longitud} metros</Descriptions.Item>
            <Descriptions.Item label="Anchura">{parcela.dimensiones.anchura} metros</Descriptions.Item>
            <Descriptions.Item label="Pendiente">{parcela.dimensiones.pendiente}%</Descriptions.Item>
          </Descriptions>
        </Panel>

        {parcela.siembra_activa ? (
          <Panel
            header={<Space>Siembra Activa</Space>}
            key="2"
            style={{ backgroundColor: '#ffffff', borderRadius: '5px', marginBottom: '5px' }}
            extra={
              canEdit && (
                <EditOutlined style={{ color: '#52c41a' }} onClick={() => handleEditSiembra(parcela.id)} />
              )
            }
          >
            <Descriptions size='small' column={1} bordered>
              <Descriptions.Item label="Tipo de Uva">{parcela.siembra_activa.tipo_uva}</Descriptions.Item>
              <Descriptions.Item label="Cantidad de Plantas">{parcela.siembra_activa.cantidad_plantas}</Descriptions.Item>
              <Descriptions.Item label="Técnica Utilizada">{parcela.siembra_activa.tecnica}</Descriptions.Item>
              <Descriptions.Item label="Estado de la Siembra">{parcela.siembra_activa.estado}</Descriptions.Item>
              <Descriptions.Item label="Observaciones">{parcela.siembra_activa.observaciones}</Descriptions.Item>
            </Descriptions>
          </Panel>
        ) : (
          <Panel
            header={<Space><ExclamationCircleOutlined /> Sin Siembra Activa</Space>}
            key="2"
            style={{ backgroundColor: '#fffbe6', borderRadius: '5px', marginBottom: '5px' }}
          >
            <Alert
              message="No hay siembra activa en esta parcela."
              description="Puedes agregar una nueva siembra para esta parcela."
              type="warning"
              showIcon
            />
            {canCreate && (
              <PlusOutlined
                style={{ color: '#8B0000', fontSize: '18px', marginTop: '10px' }}
                onClick={() => handleCreateSiembra(parcela.id)}
              />
            )}
          </Panel>
        )}

        <Panel
          header={<Space>Control de Tierra</Space>}
          key="3"
          style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
          extra={
            canCreate && (
              <PlusOutlined style={{ color: '#faad14' }} onClick={() => handleCreateControlTierra(parcela.id)} />
            )
          }
        >
          <Descriptions size='small' column={1} bordered>
            <Descriptions.Item label="PH de la Tierra">{parcela.control_tierra?.ph}</Descriptions.Item>
            <Descriptions.Item label="Humedad">{parcela.control_tierra?.humedad}%</Descriptions.Item>
            <Descriptions.Item label="Temperatura">{parcela.control_tierra?.temperatura}°C</Descriptions.Item>
            <Descriptions.Item label="Observaciones">{parcela.control_tierra?.observaciones}</Descriptions.Item>
          </Descriptions>
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
      {/* Barra de navegación superior */}
      <NavBarMenu defaultSelectedKeys={['2']} />

      {/* Contenido Principal */}
      <Content style={{ padding: '24px' }}>
        <Card title="Parcelas" bordered={false} style={{ marginTop: 20 }}>
          {canCreate && (
            <Button type="primary" style={{ marginBottom: 16, backgroundColor: '#8B0000', borderColor: '#8B0000' }} onClick={() => navigate('/create-parcel')}>
              Registrar Nueva Parcela
            </Button>
          )}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Spin tip="Cargando parcelas..." />
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={parcelas}
              rowKey="id"
              expandable={{ expandedRowRender }}
              bordered
            />
          )}
        </Card>
      </Content>

      <Footer style={{ textAlign: 'center', backgroundColor: '#004d40', color: '#fff' }}>
        Vino Costero ©2024 - Sistema de Control de Producción y Logística
      </Footer>
    </Layout>
  );
};

export default ParcelsListWithDetails;
