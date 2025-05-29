import React from "react";
import { Layout, Button, Typography, Image } from "antd";
import { RightOutlined, UserOutlined } from "@ant-design/icons";
import "./LandingPage.css";
import DarkmodeImage from "./darkmode.png";

const { Header, Content } = Layout;
const { Title } = Typography;

const MobileLanding = () => {
  return (
    <Layout className="layout">
      <div className="background">
        <div className="gradient"></div>
        <div className="palm-leaves"></div>
        <div className="mesh-sphere"></div>
      </div>

      <Header className="header">
        <div className="logo">Tredumo</div>

        <Image
          src={DarkmodeImage}
          alt="University Logo"
          preview={false}
          width={70}
        />
      </Header>

      <Content className="content">
        <div className="content-wrapper">
          <Title style={{ fontSize: 25 }} className="title">
            Use Tredumo on your phone or tablet for the best experience.
          </Title>

          <div className="button-group">
            <Button type="primary" size="large" className="open-app-button">
              Open in the Tredumo app
              <RightOutlined />
            </Button>

            <Button ghost size="large" className="manage-account-button">
              Contact Support
            </Button>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default MobileLanding;
