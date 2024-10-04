import React from 'react';
import { Layout, Row, Col, Card, Typography, Button, Tooltip } from 'antd';
import {
  DatabaseOutlined,
  EnvironmentOutlined,
  FormOutlined,
  FieldTimeOutlined,
  BarsOutlined,
  CheckSquareOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import NavBarMenu from './NavBarMenu';
import { useNavigate } from 'react-router-dom';
import './ParcelPanel.css'; // Estilos específicos para esta página

const { Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

// Función para verificar permisos
const checkPermission = (allowedRoles) => {
  const userRoles = JSON.parse(localStorage.getItem("roles")) || [];
  return Array.isArray(userRoles) ? userRoles.some(role => allowedRoles.includes(role)) : allowedRoles.includes(userRoles);
};

const ParcelPanel = () => {
  const navigate = useNavigate();

  const canViewSoilControl = checkPermission([1, 3, 5]);
  const canViewSowings = checkPermission([1, 2, 3, 4, 5]);
  const canViewDimensions = checkPermission([1, 3, 5]);
  const canViewGrapes = checkPermission([1, 2, 5]);
  const canViewParcel = checkPermission([1, 3, 5]);

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      {/* Barra de navegación superior */}
      <NavBarMenu defaultSelectedKeys={['2']} />

      {/* Contenido Principal */}
      <Content style={{ padding: '24px' }}>
        <Title level={3} style={{ textAlign: 'center', color: '#333' }}>Funcionalidades Disponibles</Title>

        <Row gutter={[24, 24]} justify="center" style={{ marginTop: '24px' }}>
          {/* Control de Tierra */}
          <Col xs={24} sm={12} lg={8}>
            <Card hoverable style={{ borderRadius: '10px', textAlign: 'center' }}>
              <DatabaseOutlined style={{ fontSize: '36px', color: '#8B0000' }} />
              <Title level={4} style={{ color: '#8B0000' }}>Control de Tierra</Title>
              <Paragraph>Registra y monitorea los controles de tierra en las parcelas.</Paragraph>
              <Button
                type="primary"
                style={{ backgroundColor: '#8B0000', borderColor: '#8B0000' }}
                onClick={() => navigate('/soil-controls')}
                disabled={!canViewSoilControl}
              >
                Ir a Control de Tierra
              </Button>
              {!canViewSoilControl && (
                <Tooltip title="No tienes permisos para utilizar esta funcionalidad." placement="topRight">
                  <Button
                    shape="circle"
                    icon={<ExclamationCircleOutlined />}
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'orange',
                    }}
                  />
                </Tooltip>
              )}
            </Card>
          </Col>

          {/* Registro de Parcelas */}
          <Col xs={24} sm={12} lg={8}>
            <Card hoverable style={{ borderRadius: '10px', textAlign: 'center' }}>
              <EnvironmentOutlined style={{ fontSize: '36px', color: '#8B0000' }} />
              <Title level={4} style={{ color: '#8B0000' }}>Registro de Parcelas</Title>
              <Paragraph>Registra y gestiona las parcelas en el viñedo.</Paragraph>
              <Button
                type="primary"
                style={{ backgroundColor: '#8B0000', borderColor: '#8B0000' }}
                onClick={() => navigate('/parcels')}
                disabled={!canViewParcel}
              >
                Ir a Registro de Parcelas
              </Button>
              {!canViewParcel && (
                <Tooltip title="No tienes permisos para utilizar esta funcionalidad." placement="topRight">
                  <Button
                    shape="circle"
                    icon={<ExclamationCircleOutlined />}
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'orange',
                    }}
                  />
                </Tooltip>
              )}
            </Card>
          </Col>

          {/* Registro de Dimensiones */}
          <Col xs={24} sm={12} lg={8}>
            <Card hoverable style={{ borderRadius: '10px', textAlign: 'center' }}>
              <FormOutlined style={{ fontSize: '36px', color: '#8B0000' }} />
              <Title level={4} style={{ color: '#8B0000' }}>Registro de Dimensiones</Title>
              <Paragraph>Registra las dimensiones de las parcelas en el sistema.</Paragraph>
              <Button
                type="primary"
                style={{ backgroundColor: '#8B0000', borderColor: '#8B0000' }}
                onClick={() => navigate('/dimensions')}
                disabled={!canViewDimensions}
              >
                Ir a Dimensiones
              </Button>
              {!canViewDimensions && (
                <Tooltip title="No tienes permisos para utilizar esta funcionalidad." placement="topRight">
                  <Button
                    shape="circle"
                    icon={<ExclamationCircleOutlined />}
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'orange',
                    }}
                  />
                </Tooltip>
              )}
            </Card>
          </Col>

          {/* Datos de Siembra */}
          <Col xs={24} sm={12} lg={8}>
            <Card hoverable style={{ borderRadius: '10px', textAlign: 'center' }}>
              <FieldTimeOutlined style={{ fontSize: '36px', color: '#8B0000' }} />
              <Title level={4} style={{ color: '#8B0000' }}>Datos de Siembra</Title>
              <Paragraph>Registra los datos de siembra en cada parcela.</Paragraph>
              <Button
                type="primary"
                style={{ backgroundColor: '#8B0000', borderColor: '#8B0000' }}
                onClick={() => navigate('/sowings')}
                disabled={!canViewSowings}
              >
                Ir a Datos de Siembra
              </Button>
              {!canViewSowings && (
                <Tooltip title="No tienes permisos para utilizar esta funcionalidad." placement="topRight">
                  <Button
                    shape="circle"
                    icon={<ExclamationCircleOutlined />}
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'orange',
                    }}
                  />
                </Tooltip>
              )}
            </Card>
          </Col>

          {/* Tipos de Uvas */}
          <Col xs={24} sm={12} lg={8}>
            <Card hoverable style={{ borderRadius: '10px', textAlign: 'center' }}>
              <BarsOutlined style={{ fontSize: '36px', color: '#8B0000' }} />
              <Title level={4} style={{ color: '#8B0000' }}>Tipos de Uvas</Title>
              <Paragraph>Registra los diferentes tipos de uvas plantadas.</Paragraph>
              <Button
                type="primary"
                style={{ backgroundColor: '#8B0000', borderColor: '#8B0000' }}
                onClick={() => navigate('/grape-types')}
                disabled={!canViewGrapes}
              >
                Ir a Tipos de Uvas
              </Button>
              {!canViewGrapes && (
                <Tooltip title="No tienes permisos para utilizar esta funcionalidad." placement="topRight">
                  <Button
                    shape="circle"
                    icon={<ExclamationCircleOutlined />}
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'orange',
                    }}
                  />
                </Tooltip>
              )}
            </Card>
          </Col>

          {/* Control de Siembras */}
          <Col xs={24} sm={12} lg={8}>
            <Card hoverable style={{ borderRadius: '10px', textAlign: 'center', position: 'relative' }}>
              <CheckSquareOutlined style={{ fontSize: '36px', color: '#8B0000' }} />
              <Title level={4} style={{ color: '#8B0000' }}>Control de Siembras</Title>
              <Paragraph>Monitorea y registra el control de siembras en cada parcela.</Paragraph>
              <Button
                type="primary"
                style={{ backgroundColor: '#8B0000', borderColor: '#8B0000' }}
                disabled
              >
                Ir a Control de Siembras
              </Button>
              <Tooltip title="Funcionalidad no disponible. Pronto estará habilitada." placement="topRight">
                <Button
                  shape="circle"
                  icon={<ExclamationCircleOutlined />}
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'yellow',
                  }}
                />
              </Tooltip>
            </Card>
          </Col>
        </Row>
      </Content>

      {/* Footer */}
      <Footer style={{ textAlign: 'center', backgroundColor: '#004d40', color: '#fff' }}>
        Vino Costero ©2024 - Sistema de Control de Producción y Logística
      </Footer>
    </Layout>
  );
};

export default ParcelPanel;
