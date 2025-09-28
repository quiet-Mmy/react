import React from 'react';
import { Switch, Input, Button, Space, Form } from 'antd';
import ContentWrapper from '../../components/ContentWrapper';

const SystemSettings = () => {
    const onFinish = (values) => {
        console.log('系统设置:', values);
    };

    return (
        <ContentWrapper 
            title="系统设置"
            extra={
                <Space>
                    <Button type="primary" htmlType="submit" form="settings-form">
                        保存设置
                    </Button>
                    <Button form="settings-form">
                        重置
                    </Button>
                </Space>
            }
        >
            <Form
                id="settings-form"
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    siteName: '我的管理系统',
                    maintenance: false,
                    registration: true,
                }}
                style={{ maxWidth: 600 }}
            >
                <Form.Item
                    label="网站名称"
                    name="siteName"
                    rules={[{ required: true, message: '请输入网站名称' }]}
                >
                    <Input />
                </Form.Item>
                
                <Form.Item
                    label="维护模式"
                    name="maintenance"
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>
                
                <Form.Item
                    label="开放注册"
                    name="registration"
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>
            </Form>
        </ContentWrapper>
    );
};

export default SystemSettings;
