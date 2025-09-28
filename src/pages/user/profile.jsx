import React from 'react';
import { Card, Form, Input, Button, Space } from 'antd';

const UserProfile = () => {
    const onFinish = (values) => {
        console.log('表单数据:', values);
    };

    return (
        <div>
            <h3>个人资料</h3>
            <Card title="基本信息" style={{ maxWidth: 600 }}>
                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        name: '张三',
                        email: 'zhangsan@example.com',
                        phone: '13800138000',
                    }}
                >
                    <Form.Item
                        label="姓名"
                        name="name"
                        rules={[{ required: true, message: '请输入姓名' }]}
                    >
                        <Input />
                    </Form.Item>
                    
                    <Form.Item
                        label="邮箱"
                        name="email"
                        rules={[
                            { required: true, message: '请输入邮箱' },
                            { type: 'email', message: '请输入正确的邮箱格式' }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    
                    <Form.Item
                        label="手机号"
                        name="phone"
                        rules={[{ required: true, message: '请输入手机号' }]}
                    >
                        <Input />
                    </Form.Item>
                    
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                保存
                            </Button>
                            <Button>
                                重置
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default UserProfile;
