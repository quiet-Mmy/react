import React from 'react';
import { ConfigProvider, theme } from 'antd';
import { useTheme } from '../hooks/useTheme';

/**
 * 主题提供者组件
 * 使用 Ant Design 的 ConfigProvider 来配置主题
 */
const ThemeProvider = ({ children }) => {
    const { isDark } = useTheme();
    
    // 根据深色模式配置主题
    const antdTheme = {
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
            colorPrimary: '#1677ff',
            colorBgContainer: isDark ? '#1f1f1f' : '#ffffff',
            colorBgElevated: isDark ? '#262626' : '#ffffff',
            colorText: isDark ? '#ffffff' : '#000000',
            colorTextSecondary: isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)',
            colorBorder: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.06)',
            colorBorderSecondary: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
        },
        components: {
            Layout: {
                bodyBg: isDark ? '#141414' : '#f5f5f5',
                headerBg: isDark ? '#001529' : '#ffffff',
                siderBg: isDark ? '#001529' : '#ffffff',
            },
            Menu: {
                darkItemBg: '#001529',
                darkItemSelectedBg: '#1677ff',
                darkItemHoverBg: '#1677ff',
            },
            Drawer: {
                colorBgElevated: isDark ? '#1f1f1f' : '#ffffff',
            },
            Select: {
                colorBgElevated: isDark ? '#434343' : '#ffffff',
                colorText: isDark ? '#ffffff' : '#000000',
            },
            DatePicker: {
                colorBgElevated: isDark ? '#434343' : '#ffffff',
                colorText: isDark ? '#ffffff' : '#000000',
            },
            Button: {
                colorBgContainer: isDark ? '#434343' : '#ffffff',
                colorText: isDark ? '#ffffff' : '#000000',
            },
        },
    };

    return (
        <ConfigProvider theme={antdTheme}>
            {children}
        </ConfigProvider>
    );
};

export default ThemeProvider;
