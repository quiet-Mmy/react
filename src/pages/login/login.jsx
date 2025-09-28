import React, { useState } from 'react';
import { Form, Input, Button, Card, Layout } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css';

const { Content } = Layout;

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            // 这里添加登录逻辑
            console.log('登录信息:', values);
            // 登录成功后跳转到首页
            navigate('/');
        } catch (error) {
            console.error('登录失败:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout className={styles.loginLayout}>
            <Content className={styles.loginContent}>
                <Card className={styles.loginCard} title="用户登录">
                    <Form
                        name="login"
                        initialValues={{ remember: true }}
                        onFinish={handleSubmit}
                        layout="vertical"
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: '请输入用户名' }]}
                            label="用户名"
                        >
                            <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: '请输入密码' }]}
                            label="密码"
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading} block>
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Content>
        </Layout>
    );
};

export default Login;