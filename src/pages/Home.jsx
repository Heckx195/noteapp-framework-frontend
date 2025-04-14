import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography, Layout } from 'antd';
import '../css/Home.css';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

function Home() {
  return (
    <div className="surface">
      <Layout className="main">
        <Content className="content">
          <Title level={1} className="title">
            TwoNote
          </Title>
          <Paragraph className="desc">Join the app</Paragraph>
          <Link to="/signup">
            <Button type="primary" className="home_register_btn">
              Register
            </Button>
          </Link>
          <div className="footer-desc">
            <Paragraph className="footer-text">
              Already have an account
            </Paragraph>
            <Link to="/login">
              <Button type="default" className="footer_login_btn">
                Login
              </Button>
            </Link>
          </div>
        </Content>
      </Layout>
    </div>
  );
}

export default Home;
