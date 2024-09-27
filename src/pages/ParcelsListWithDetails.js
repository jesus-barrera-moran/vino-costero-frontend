import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Collapse, Descriptions, Card, message, Spin, Alert } from 'antd';
import { EditOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Panel } = Collapse;

const ParcelsListWithDetails = () => {
  const navigate = useNavigate();
  const [parcelas, setParcelas] = useState([]);
  const [loading, setLoading] = useState(false);

  // Función para obtener todas las parcelas desde el backend
  const fetchParcelas = async () => {
    if (!loading) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3000/parcelas');
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
    },
    {
      title: 'Latitud',
      dataIndex: 'latitud',
      key: 'latitud',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record.id)}>
            Editar
          </Button>
        </Space>
      ),
    },
  ];

  // Función para manejar la redirección al formulario de edición
  const handleEdit = (id) => {
    navigate(`/edit-parcel/${id}`);
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

  // Función para mostrar los detalles de cada parcela
  const expandedRowRender = (parcela) => {
    return (
      <Collapse accordion>
        {/* Acordeón para Dimensiones */}
        <Panel
          header="Dimensiones"
          key="1"
          extra={
            <Button
              type="default"
              icon={<EditOutlined />}
              style={{ color: '#1890ff' }}
              onClick={() => handleEditDimensions(parcela.id)}
            >
              Editar
            </Button>
          }
        >
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Superficie">{parcela.dimensiones.superficie} hectáreas</Descriptions.Item>
            <Descriptions.Item label="Longitud">{parcela.dimensiones.longitud} metros</Descriptions.Item>
            <Descriptions.Item label="Anchura">{parcela.dimensiones.anchura} metros</Descriptions.Item>
            <Descriptions.Item label="Pendiente">{parcela.dimensiones.pendiente}%</Descriptions.Item>
          </Descriptions>
        </Panel>

        {/* Siembra Activa */}
        {parcela.siembra_activa ? (
          <Panel
            header="Siembra Activa"
            key="2"
            extra={
              <Button
                type="default"
                icon={<EditOutlined />}
                style={{ color: '#52c41a' }} 
                onClick={() => handleEditSiembra(parcela.id)}
              >
                Editar
              </Button>
            }
          >
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Tipo de Uva">{parcela.siembra_activa.tipo_uva}</Descriptions.Item>
              <Descriptions.Item label="Cantidad de Plantas">{parcela.siembra_activa.cantidad_plantas}</Descriptions.Item>
              <Descriptions.Item label="Técnica Utilizada">{parcela.siembra_activa.tecnica}</Descriptions.Item>
              <Descriptions.Item label="Estado de la Siembra">{parcela.siembra_activa.estado}</Descriptions.Item>
              <Descriptions.Item label="Observaciones">{parcela.siembra_activa.observaciones}</Descriptions.Item>
            </Descriptions>
          </Panel>
        ) : (
          <Panel
            header={<span><ExclamationCircleOutlined /> Sin Siembra Activa</span>}
            key="2"
            style={{ backgroundColor: '#fffbe6' }}
          >
            <Alert
              message="No hay siembra activa en esta parcela."
              description="Puedes agregar una nueva siembra para esta parcela."
              type="warning"
              showIcon
            />
            <Button
              type="primary"
              style={{ marginTop: 10 }}
              icon={<PlusOutlined />}
              onClick={() => handleCreateSiembra(parcela.id)}
            >
              Crear nueva siembra
            </Button>
          </Panel>
        )}

        {/* Acordeón para Control de Tierra */}
        <Panel
          header="Control de Tierra"
          key="3"
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ backgroundColor: '#faad14', borderColor: '#faad14' }}
              onClick={() => handleCreateControlTierra(parcela.id)}
            >
              Crear
            </Button>
          }
        >
          <Descriptions column={1} bordered>
            <Descriptions.Item label="PH de la Tierra">{parcela.control_tierra?.ph}</Descriptions.Item>
            <Descriptions.Item label="Humedad">{parcela.control_tierra?.humedad}%</Descriptions.Item>
            <Descriptions.Item label="Temperatura">{parcela.control_tierra?.temperatura}°C</Descriptions.Item>
            <Descriptions.Item label="Observaciones">{parcela.control_tierra?.observaciones}</Descriptions.Item>
          </Descriptions>
        </Panel>
      </Collapse>
    );
  };

  return (
    <Card title="Listado de Parcelas" bordered={false} style={{ marginTop: 20 }}>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={() => navigate('/create-parcel')}>
        Registrar Nueva Parcela
      </Button>
      {loading ? (
        <Spin tip="Cargando parcelas..." />
      ) : (
        <Table
          columns={columns}
          dataSource={parcelas}
          rowKey="id"
          expandable={{
            expandedRowRender: (record) => expandedRowRender(record),
          }}
        />
      )}
    </Card>
  );
};

export default ParcelsListWithDetails;
