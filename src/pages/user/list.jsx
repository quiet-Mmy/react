import React, { useState } from 'react';
import { Table, Button, Space } from 'antd';
import SearchHeader from '../../components/SearchHeader';
import ContentWrapper from '../../components/ContentWrapper';

const UserList = () => {
    const [loading, setLoading] = useState(false);
    
    const searchFields = [
        { key: 'name', label: '姓名', type: 'input', placeholder: '请输入姓名' },
        { key: 'status', label: '状态', type: 'select', options: [
            { value: 'active', label: '激活' },
            { value: 'inactive', label: '禁用' }
        ]},
        { key: 'dateRange', label: '创建时间', type: 'dateRange' }
    ];

    const handleSearch = (params) => {
        console.log('搜索参数:', params);
        setLoading(true);
        // 模拟搜索
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    const handleReset = () => {
        console.log('重置搜索');
    };

    const handleAdd = () => {
        console.log('新增用户');
    };

    const columns = [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: '地址',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: '操作',
            key: 'action',
            render: () => (
                <Space size="middle">
                    <Button type="link">编辑</Button>
                    <Button type="link" danger>删除</Button>
                </Space>
            ),
        },
    ];

    const data = [
        {
            key: '1',
            name: '张三',
            age: 32,
            address: '北京市朝阳区',
        },
        {
            key: '2',
            name: '李四',
            age: 28,
            address: '上海市浦东新区',
        },
        {
            key: '3',
            name: '王五',
            age: 35,
            address: '广州市天河区',
        },
    ];

    return (
        <div>
            <SearchHeader 
                searchFields={searchFields}
                onSearch={handleSearch}
                onReset={handleReset}
                onAdd={handleAdd}
            />
            <ContentWrapper 
                title="用户列表"
                loading={loading}
            >
                <Table columns={columns} dataSource={data} />
            </ContentWrapper>
        </div>
    );
};

export default UserList;
