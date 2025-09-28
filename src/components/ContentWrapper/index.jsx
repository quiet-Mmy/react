import React from 'react';
import { Card, Spin } from 'antd';
import { useTheme } from '../../hooks/useTheme';
import './index.css';

/**
 * 公共内容包装组件
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子内容
 * @param {string} props.title - 标题
 * @param {boolean} props.loading - 加载状态
 * @param {Object} props.extra - 额外操作
 * @param {boolean} props.bordered - 是否有边框 (已弃用，建议使用variant代替)
 * @param {string} props.className - 自定义类名
 */
const ContentWrapper = ({
    children,
    title,
    loading = false,
    extra,
    bordered = true,
    variant = bordered ? "outlined" : "shadow",
    className = '',
    ...props
}) => {
    const { isDark } = useTheme();

    return (
        <div className={`content-wrapper ${isDark ? 'dark' : 'light'} ${className}`}>
            <Card
                title={title}
                extra={extra}
                variant={variant}
                className={`content-card ${isDark ? 'dark' : 'light'}`}
                {...props}
            >
                <Spin spinning={loading}>
                    {children}
                </Spin>
            </Card>
        </div>
    );
};

export default ContentWrapper;