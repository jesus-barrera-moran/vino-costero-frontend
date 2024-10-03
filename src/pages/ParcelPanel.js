import React from 'react';
import { Layout, Menu, Row, Col, Card, Typography, Button } from 'antd';
import {
  DatabaseOutlined,
  BarChartOutlined,
  AppstoreAddOutlined,
  UserOutlined,
  FileDoneOutlined,
  EnvironmentOutlined,
  FormOutlined,
  FieldTimeOutlined,
  BarsOutlined,
  CheckSquareOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './ParcelPanel.css'; // Estilos específicos para esta página

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const ParcelPanel = () => {
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      {/* Barra de navegación superior */}
      <Header style={{ backgroundColor: '#004d40', padding: 0 }}>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} style={{ backgroundColor: '#004d40' }}>
          <Menu.Item key="1" icon={<DatabaseOutlined />}>Producción de vinos</Menu.Item>
          <Menu.Item onClick={() => navigate('/parcels-panel')} key="2" icon={<AppstoreAddOutlined />}>Control de parcelas</Menu.Item>
          <Menu.Item key="3" icon={<FileDoneOutlined />}>Control de calidad</Menu.Item>
          <Menu.Item key="4" icon={<BarChartOutlined />}>Logística</Menu.Item>
          <Menu.Item key="5" icon={<UserOutlined />}>Análisis de negocios</Menu.Item>
        </Menu>
      </Header>

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
              >
                Ir a Control de Tierra
              </Button>
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
              >
                Ir a Registro de Parcelas
              </Button>
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
              >
                Ir a Dimensiones
              </Button>
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
              >
                Ir a Datos de Siembra
              </Button>
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
              >
                Ir a Tipos de Uvas
              </Button>
            </Card>
          </Col>

          {/* Control de Siembras */}
          <Col xs={24} sm={12} lg={8}>
            <Card hoverable style={{ borderRadius: '10px', textAlign: 'center' }}>
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
