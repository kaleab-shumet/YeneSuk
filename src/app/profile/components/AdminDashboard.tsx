import React, { useState } from 'react';
import axios from 'axios';
import { Layout, Statistic, Row, Col, Card, Spin } from 'antd';
import {
  ShoppingCartOutlined,
  UserOutlined,
  DollarCircleOutlined,
  TagOutlined,
  ProfileOutlined,
  LineChartOutlined,
} from '@ant-design/icons';

const { Content } = Layout;

// Define the type for the statistics data
interface StatisticsData {
  numOrders: number;
  numUsers: number;
  numProducts: number;
  numCategories: number;
  purchasesAmount: number;
  salesAmount: number;
  profit: number;
}

const AdminDashboard: React.FC = () => {
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch data immediately
  if (loading && typeof window !== 'undefined') {
    axios
      .get('/api/statistics')
      .then((response) => {
        setStatistics(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching statistics:', error);
        setStatistics({
          numOrders: 0,
          numUsers: 0,
          numProducts: 0,
          numCategories: 0,
          purchasesAmount: 0,
          salesAmount: 0,
          profit: 0,
        });
        setLoading(false);
      });
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout>
      <Content style={{ padding: '0 50px', marginTop: 64 }}>
        <div style={{ background: '#fff', padding: 24 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Orders"
                  value={statistics?.numOrders}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<ShoppingCartOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Customers"
                  value={statistics?.numUsers}
                  valueStyle={{ color: '#cf1322' }}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Sales"
                  value={statistics?.salesAmount}
                  valueStyle={{ color: '#008000' }}
                  prefix={<DollarCircleOutlined />}
                />
              </Card>
            </Col>

            <Col span={6}>
              <Card>
                <Statistic
                  title="Profit From Sales Exc. VAT"
                  value={statistics?.profit}
                  valueStyle={{ color: '#722ed1' }}
                  prefix={<LineChartOutlined />}
                />
              </Card>
            </Col>

            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Purchases"
                  value={statistics?.purchasesAmount}
                  valueStyle={{ color: '#faad14' }}
                  prefix={<ProfileOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Products"
                  value={statistics?.numProducts}
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<TagOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Categories"
                  value={statistics?.numCategories}
                  valueStyle={{ color: '#f5222d' }}
                  prefix={<TagOutlined />}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default AdminDashboard;
