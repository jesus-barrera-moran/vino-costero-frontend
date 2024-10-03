import React from 'react';
import { Layout, Button, Row, Col, Typography, Card } from 'antd';
import {
  DatabaseOutlined,
  BarChartOutlined,
  AppstoreAddOutlined,
  UserOutlined,
  FileDoneOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import NavBarMenu from './NavBarMenu';
import './MainPage.css'; // Puedes usar este archivo para manejar los estilos de la imagen del banner

const { Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      {/* Barra de navegación superior */}
      <NavBarMenu defaultSelectedKeys={['2']} />

      {/* Banner/Encabezado con imagen */}
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

      {/* Contenido principal con tarjetas destacadas */}
      <Content style={{ margin: '24px 16px', padding: 24 }}>
        <Title level={3} style={{ color: '#333', textAlign: 'center' }}>Panel de Control</Title>

        <Row gutter={[24, 24]} justify="center" style={{ marginTop: '24px' }}>
          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              style={{ borderRadius: '10px', backgroundColor: '#fff', textAlign: 'center' }}
            >
              <DatabaseOutlined style={{ fontSize: '36px', color: '#8B0000' }} />
              <Title level={4} style={{ color: '#8B0000' }}>Producción de Vinos</Title>
              <Paragraph>Controla la producción desde la siembra hasta la cosecha.</Paragraph>
              <Button type="primary" style={{ backgroundColor: '#8B0000', borderColor: '#8B0000' }}>Ver Detalles</Button>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              style={{ borderRadius: '10px', backgroundColor: '#fff', textAlign: 'center' }}
            >
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

          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              style={{ borderRadius: '10px', backgroundColor: '#fff', textAlign: 'center' }}
            >
              <FileDoneOutlined style={{ fontSize: '36px', color: '#8B0000' }} />
              <Title level={4} style={{ color: '#8B0000' }}>Control de Calidad</Title>
              <Paragraph>Verifica el estado sanitario y la calidad de las uvas.</Paragraph>
              <Button type="primary" style={{ backgroundColor: '#8B0000', borderColor: '#8B0000' }}>Ver Detalles</Button>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              style={{ borderRadius: '10px', backgroundColor: '#fff', textAlign: 'center' }}
            >
              <BarChartOutlined style={{ fontSize: '36px', color: '#8B0000' }} />
              <Title level={4} style={{ color: '#8B0000' }}>Logística</Title>
              <Paragraph>Gestión de bodegas, órdenes de compra y embarques.</Paragraph>
              <Button type="primary" style={{ backgroundColor: '#8B0000', borderColor: '#8B0000' }}>Ver Detalles</Button>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              style={{ borderRadius: '10px', backgroundColor: '#fff', textAlign: 'center' }}
            >
              <UserOutlined style={{ fontSize: '36px', color: '#8B0000' }} />
              <Title level={4} style={{ color: '#8B0000' }}>Análisis de Negocios</Title>
              <Paragraph>Revisa reportes financieros y análisis de marketing.</Paragraph>
              <Button type="primary" style={{ backgroundColor: '#8B0000', borderColor: '#8B0000' }}>Ver Detalles</Button>
            </Card>
          </Col>
        </Row>

        {/* Sección de estadísticas o gráficos */}
        <Row justify="center" style={{ marginTop: '48px' }}>
          <Col xs={24} md={12}>
            <Card
              hoverable
              style={{ borderRadius: '10px', backgroundColor: '#D4AF37', textAlign: 'center' }}
            >
              <Title level={3} style={{ color: '#fff' }}>Estadísticas Generales</Title>
              <Paragraph style={{ color: '#fff' }}>Muestra los gráficos y estadísticas clave de la empresa.</Paragraph>
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

export default MainPage;
