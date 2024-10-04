import React, { useState, useEffect } from 'react';
import { Layout, Button, Row, Col, Typography, Card, message, Spin, Tooltip } from 'antd';
import {
  DatabaseOutlined,
  BarChartOutlined,
  AppstoreAddOutlined,
  UserOutlined,
  FileDoneOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import NavBarMenu from './NavBarMenu';
import './MainPage.css';

const { Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const MainPage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar si el usuario tiene el token, sino redirigir a login
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('Debe estar autenticado para acceder a esta página');
      navigate('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" tip="Cargando..." />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      <NavBarMenu defaultSelectedKeys={['2']} />

      <div className="banner-container">
        <div className="banner-content">
          <Title level={1} style={{ color: '#fff', fontSize: '48px', textAlign: 'center' }}>Vino Costero</Title>
          <Paragraph style={{ color: '#fff', fontSize: '18px', textAlign: 'center' }}>
            Elegancia, tradición y calidad en cada botella de vino blanco.
          </Paragraph>
          <Row justify="center" style={{ marginTop: '20px' }}>
            <Button type="primary" size="large" style={{ backgroundColor: '#D4AF37', borderColor: '#D4AF37', marginRight: '10px' }}>
              Ver Producción
            </Button>
            <Button type="default" size="large" style={{ color: '#000', borderColor: '#fff' }}>
              Contactar
            </Button>
          </Row>
        </div>
      </div>

      <Content style={{ margin: '24px 16px', padding: 24 }}>
        <Title level={3} style={{ color: '#333', textAlign: 'center' }}>Panel de Control</Title>
        <Row gutter={[24, 24]} justify="center" style={{ marginTop: '24px' }}>

          {/* Producción de Vinos */}
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable style={{ borderRadius: '10px', backgroundColor: '#fff', textAlign: 'center', position: 'relative' }}>
              <DatabaseOutlined style={{ fontSize: '36px', color: '#8B0000' }} />
              <Title level={4} style={{ color: '#8B0000' }}>Producción de Vinos</Title>
              <Paragraph>Controla la producción desde la siembra hasta la cosecha.</Paragraph>
              <Button type="primary" style={{ backgroundColor: '#8B0000', borderColor: '#8B0000' }} disabled>
                Ver Detalles
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
                    color: 'yellow'
                  }}
                />
              </Tooltip>
            </Card>
          </Col>

          {/* Control de Parcelas (Funcionalidad Disponible) */}
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable style={{ borderRadius: '10px', backgroundColor: '#fff', textAlign: 'center' }}>
              <AppstoreAddOutlined style={{ fontSize: '36px', color: '#8B0000' }} />
              <Title level={4} style={{ color: '#8B0000' }}>Control de Parcelas</Title>
              <Paragraph>Registra y monitorea las parcelas y tipos de uvas.</Paragraph>
              <Button
                type="primary"
                style={{ backgroundColor: '#8B0000', borderColor: '#8B0000' }}
                onClick={() => navigate('/parcels-panel')}
              >
                Ver Detalles
              </Button>
            </Card>
          </Col>

          {/* Control de Calidad */}
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable style={{ borderRadius: '10px', backgroundColor: '#fff', textAlign: 'center', position: 'relative' }}>
              <FileDoneOutlined style={{ fontSize: '36px', color: '#8B0000' }} />
              <Title level={4} style={{ color: '#8B0000' }}>Control de Calidad</Title>
              <Paragraph>Verifica el estado sanitario y la calidad de las uvas.</Paragraph>
              <Button type="primary" style={{ backgroundColor: '#8B0000', borderColor: '#8B0000' }} disabled>
                Ver Detalles
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
                    color: 'yellow'
                  }}
                />
              </Tooltip>
            </Card>
          </Col>

          {/* Logística */}
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable style={{ borderRadius: '10px', backgroundColor: '#fff', textAlign: 'center', position: 'relative' }}>
              <BarChartOutlined style={{ fontSize: '36px', color: '#8B0000' }} />
              <Title level={4} style={{ color: '#8B0000' }}>Logística</Title>
              <Paragraph>Gestión de bodegas, órdenes de compra y embarques.</Paragraph>
              <Button type="primary" style={{ backgroundColor: '#8B0000', borderColor: '#8B0000' }} disabled>
                Ver Detalles
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
                    color: 'yellow'
                  }}
                />
              </Tooltip>
            </Card>
          </Col>

          {/* Análisis de Negocios */}
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable style={{ borderRadius: '10px', backgroundColor: '#fff', textAlign: 'center', position: 'relative' }}>
              <UserOutlined style={{ fontSize: '36px', color: '#8B0000' }} />
              <Title level={4} style={{ color: '#8B0000' }}>Análisis de Negocios</Title>
              <Paragraph>Revisa reportes financieros y análisis de marketing.</Paragraph>
              <Button type="primary" style={{ backgroundColor: '#8B0000', borderColor: '#8B0000' }} disabled>
                Ver Detalles
              </Button>
              <Tooltip title="Funcionalidad no disponible. Pronto estará habilitada." placement="topRight">
                <Button
                  shape="circle"
                  icon={<ExclamationCircleOutlined back />}
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'yellow'
                  }}
                />
              </Tooltip>
            </Card>
          </Col>
        </Row>
      </Content>

      <Footer style={{ textAlign: 'center', backgroundColor: '#004d40', color: '#fff' }}>
        Vino Costero ©2024 - Sistema de Control de Producción y Logística
      </Footer>
    </Layout>
  );
};

export default MainPage;
