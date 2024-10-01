import React, { useEffect, useState } from 'react';
import { Table, Card, Collapse, Descriptions, Timeline, Button, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Panel } = Collapse;

// Función para calcular el área ocupada (longitud * anchura en metros cuadrados)
const calcularAreaOcupada = (longitud, anchura) => {
  const areaOcupada = longitud * anchura; // Área en metros cuadrados
  return areaOcupada / 10000; // Convertir a hectáreas (1 ha = 10,000 m²)
};

// Función para calcular el porcentaje del área ocupada
const calcularPorcentajeOcupado = (areaOcupada, superficieTotal) => {
  return ((areaOcupada / superficieTotal) * 100).toFixed(2); // Redondear a 2 decimales
};

// Función para verificar permisos
const checkPermission = (allowedRoles) => {
  const userRoles = JSON.parse(localStorage.getItem("roles")) || [];
  return Array.isArray(userRoles) ? userRoles.some(role => allowedRoles.includes(role)) : allowedRoles.includes(userRoles);
};

const ParcelDimensionsOverview = () => {
  const [parcelas, setParcelas] = useState([]);
  const [loading, setLoading] = useState(false); // Estado de carga
  const navigate = useNavigate();

  // Verificar si el usuario tiene el token, sino redirigir a login
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('Debe estar autenticado para acceder a esta página');
      navigate('/login'); // Redirige al login si no hay token
    }
  }, [navigate]);

  // Permisos basados en CU_02
  const canEdit = checkPermission([1, 3]);
  const canView = checkPermission([1, 3, 5]);

  // Redirigir si no tienen permiso para ver
  useEffect(() => {
    if (!canView) {
      message.error('No tiene permisos para ver esta página');
      navigate('/');
    }
  }, [canView, navigate]);

  // Función para cargar las dimensiones de las parcelas desde el backend
  const fetchParcelas = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); // Obtener el token del localStorage
      const response = await fetch('http://localhost:3000/dimensiones', {
        headers: {
          'Authorization': `Bearer ${token}`,  // Incluir el token en la cabecera
          'Content-Type': 'application/json',
        },
      }); // Ajusta la URL si es necesario
      if (!response.ok) {
        throw new Error('Error al obtener las dimensiones');
      }
      const data = await response.json();
      setParcelas(data);
    } catch (error) {
      message.error('Hubo un error al cargar las dimensiones de las parcelas.');
    } finally {
      setLoading(false);
    }
  };

  // Llamar a fetchParcelas al montar el componente
  useEffect(() => {
    fetchParcelas();
  }, []);

  // Columnas para el listado de parcelas con dimensiones actuales
  const columns = [
    {
      title: 'Nombre de la Parcela',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Superficie (ha)',
      dataIndex: ['dimensionesActuales', 'superficie'],
      key: 'superficie',
    },
    {
      title: 'Longitud (m)',
      dataIndex: ['dimensionesActuales', 'longitud'],
      key: 'longitud',
    },
    {
      title: 'Anchura (m)',
      dataIndex: ['dimensionesActuales', 'anchura'],
      key: 'anchura',
    },
    {
      title: 'Pendiente (%)',
      dataIndex: ['dimensionesActuales', 'pendiente'],
      key: 'pendiente',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (record) => (
        canEdit && (
          <Button
            type="primary"
            onClick={() => navigate(`/edit-dimensions/${record.id}`)}
          >
            Editar
          </Button>
        )
      ),
    },
  ];

  // Función para mostrar el contenido expandido de cada fila (dimensiones actuales con cálculos)
  const expandedRowRender = (parcela) => {
    const { longitud, anchura, superficie } = parcela.dimensionesActuales;
    const areaOcupada = calcularAreaOcupada(longitud, anchura);
    const porcentajeOcupado = calcularPorcentajeOcupado(areaOcupada, superficie);

    return (
      <Collapse accordion>
        {/* Detalles de Dimensiones Actuales */}
        <Panel header="Detalles de Dimensiones Actuales" key="1">
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Superficie Total">{superficie} hectáreas</Descriptions.Item>
            <Descriptions.Item label="Área Ocupada">{areaOcupada.toFixed(2)} hectáreas</Descriptions.Item>
            <Descriptions.Item label="Porcentaje Ocupado">{porcentajeOcupado}%</Descriptions.Item>
            <Descriptions.Item label="Longitud">{longitud} metros</Descriptions.Item>
            <Descriptions.Item label="Anchura">{anchura} metros</Descriptions.Item>
            <Descriptions.Item label="Pendiente">{parcela.dimensionesActuales.pendiente}%</Descriptions.Item>
            <Descriptions.Item label="Fecha">{parcela.dimensionesActuales.fecha}</Descriptions.Item>
          </Descriptions>
        </Panel>

        {/* Historial de Dimensiones */}
        <Panel header="Historial de Dimensiones" key="2">
          <Timeline>
            {parcela.historialDimensiones.map((dimension, index) => (
              <Timeline.Item key={index}>
                <Collapse>
                  <Panel header={`Dimensiones al ${dimension.fecha}`} key={index + 1}>
                    <Descriptions column={2} bordered>
                      <Descriptions.Item label="Superficie">{dimension.superficie} ha</Descriptions.Item>
                      <Descriptions.Item label="Longitud">{dimension.longitud} m</Descriptions.Item>
                      <Descriptions.Item label="Anchura">{dimension.anchura} m</Descriptions.Item>
                      <Descriptions.Item label="Pendiente">{dimension.pendiente}%</Descriptions.Item>
                    </Descriptions>
                  </Panel>
                </Collapse>
              </Timeline.Item>
            ))}
            {parcela.historialDimensiones.length === 0 && (
              <p>No hay historial disponible para esta parcela.</p>
            )}
          </Timeline>
        </Panel>
      </Collapse>
    );
  };

  return (
    <Card title="Visualización de Dimensiones de Parcelas" bordered={false} style={{ marginTop: 20 }}>
      {loading ? (
        <Spin tip="Cargando dimensiones..." />
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

export default ParcelDimensionsOverview;
