import React, { useMemo } from 'react';
import { Row, Col, Card, Statistic, Progress, Table, Space, Button, Tag } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import ContentWrapper from '../../components/ContentWrapper';
import { useTheme } from '../../hooks/useTheme';

const HomeOverview = () => {
    const { isDark } = useTheme();
    const isProd = import.meta.env.MODE === 'production';

    const stats = useMemo(() => ([
        { title: '今日新增用户', value: 128, delta: 12, up: true },
        { title: '活跃用户', value: 3542, delta: 3, up: true },
        { title: '订单数', value: 872, delta: 5, up: false },
        { title: '错误率', value: 0.62, delta: 0.18, up: false, suffix: '%' },
    ]), []);

    const progressList = useMemo(() => ([
        { name: '接口成功率', value: 97 },
        { name: '订单完成率', value: 88 },
        { name: '支付成功率', value: 93 },
    ]), []);

    const columns = [
        { title: '任务', dataIndex: 'task', key: 'task' },
        { title: '负责人', dataIndex: 'owner', key: 'owner' },
        { title: '状态', dataIndex: 'status', key: 'status', render: (s) => {
            const map = { done: 'success', doing: 'processing', pending: 'default' };
            const text = { done: '已完成', doing: '进行中', pending: '待开始' };
            return <Tag color={map[s]}>{text[s]}</Tag>;
        }},
        { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt' },
    ];
    const dataSource = [
        { key: 1, task: '用户画像埋点', owner: 'Alice', status: 'doing', updatedAt: '2025-09-26 10:21' },
        { key: 2, task: '支付链路优化', owner: 'Bob', status: 'pending', updatedAt: '2025-09-25 17:03' },
        { key: 3, task: '订单查询索引', owner: 'Carol', status: 'done', updatedAt: '2025-09-24 14:48' },
    ];

    return (
        <ContentWrapper
            title="数据概览"
            extra={
                !isProd && (
                    <Space>
                        <Button onClick={() => console.log('Mock 刷新')}>刷新模拟数据</Button>
                        <Button onClick={() => console.log('打开调试面板')}>调试入口</Button>
                    </Space>
                )
            }
        >
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <Row gutter={[16, 16]}>
                    {stats.map((s) => (
                        <Col xs={24} sm={12} md={12} lg={6} key={s.title}>
                            <Card hoverable>
                                <Statistic
                                    title={s.title}
                                    value={s.value}
                                    suffix={s.suffix}
                                    valueStyle={{ color: isDark ? '#fff' : '#000' }}
                                />
                                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    {s.up ? (
                                        <ArrowUpOutlined style={{ color: '#52c41a' }} />
                                    ) : (
                                        <ArrowDownOutlined style={{ color: '#ff4d4f' }} />
                                    )}
                                    <span style={{ color: s.up ? '#52c41a' : '#ff4d4f' }}>
                                        {s.up ? '+' : '-'}{s.delta}% 同比
                                    </span>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={12}>
                        <Card title="关键指标">
                            <Space direction="vertical" style={{ width: '100%' }}>
                                {progressList.map(p => (
                                    <div key={p.name} style={{ width: '100%' }}>
                                        <div style={{ marginBottom: 6 }}>{p.name}</div>
                                        <Progress percent={p.value} strokeColor={isDark ? '#1677ff' : undefined} />
                                    </div>
                                ))}
                            </Space>
                        </Card>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Card title="待办任务">
                            <Table
                                size="small"
                                pagination={false}
                                columns={columns}
                                dataSource={dataSource}
                            />
                        </Card>
                    </Col>
                </Row>
            </Space>
        </ContentWrapper>
    );
};

export default HomeOverview;