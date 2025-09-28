import {
    HomeOutlined,
    AppstoreOutlined,
    UserOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import './layout.css';
import { Breadcrumb, Layout, Menu, Tabs, Avatar, Tooltip, Dropdown } from 'antd';
import React, { useState } from 'react';
const { Header, Content, Footer, Sider } = Layout;
import Headers from '../compontens/header';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useDispatch, useSelector } from 'react-redux';
import { selectTabs, initTabs, addTab, removeTab, setActiveTab } from '@/store/modules/triggerStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { appRoutes } from '../router';
import ReactLogo from '../assets/react.svg';

// 图标映射
const iconMap = {
    HomeOutlined: <HomeOutlined />,
    AppstoreOutlined: <AppstoreOutlined />,
    UserOutlined: <UserOutlined />,
    SettingOutlined: <SettingOutlined />,
};

function Logo() {
    return <img src={ReactLogo} alt="base Logo" />;
}

// 从路由配置动态生成菜单项
function getMenuItems() {
    const items = [];
    for (const route of appRoutes) {
        if (route.children) {
            for (const child of route.children) {
                const handle = child.handle;
                if (handle?.menu) {
                    // 检查是否有子路由
                    if (child.children && child.children.length > 0) {
                        // 有子路由，创建子菜单
                        const subItems = child.children
                            .filter(subChild => subChild.handle?.menu)
                            .map(subChild => ({
                                key: subChild.handle.key,
                                label: subChild.handle.label,
                                icon: subChild.handle.icon ? iconMap[subChild.handle.icon] : null,
                            }));

                        // 只有当有子菜单项时才创建父菜单
                        if (subItems.length > 0) {
                            items.push({
                                key: handle.key,
                                label: handle.label,
                                icon: handle.icon ? iconMap[handle.icon] : null,
                                children: subItems,
                            });
                        }
                    } else {
                        // 没有子路由，直接添加
                        items.push({
                            key: handle.key,
                            label: handle.label,
                            icon: handle.icon ? iconMap[handle.icon] : null,
                        });
                    }
                }
            }
        }
    }
    return items;
}

// 根据当前路径生成面包屑
function getBreadcrumbItems(pathname) {
    const breadcrumbs = [];

    // 根据路径匹配路由配置
    for (const route of appRoutes) {
        if (route.children) {
            for (const child of route.children) {
                const handle = child.handle;
                if (handle && (pathname === handle.key || (child.index && pathname === '/') || (!child.index && pathname === `/${child.path}`))) {
                    breadcrumbs.push({
                        title: handle.label,
                    });
                    break;
                }
            }
        }
    }

    // 如果没有匹配到，显示默认
    if (breadcrumbs.length === 0) {
        breadcrumbs.push({ title: '首页' });
    }

    return breadcrumbs;
}
const MainLayout = () => {
    const { isDark, menuShow, toggleMenu, showFooter, showBreadcrumb } = useTheme();
    const env = import.meta.env;
    const dispatch = useDispatch();
    const { openTabs, activeKey } = useSelector(selectTabs);
    const navigate = useNavigate();
    const location = useLocation();
    const baseTitle = import.meta.env.VITE_TITLE

    // 菜单点击处理
    function handleMenuClick({ key }) {
        navigate(key);
    }

    // 获取当前选中的菜单项
    const selectedKeys = [location.pathname];
    const menuItems = getMenuItems();
    const breadcrumbItems = getBreadcrumbItems(location.pathname);
    // 初始化与路由联动 Tabs
    React.useEffect(() => {
        const current = breadcrumbItems?.[breadcrumbItems.length - 1]?.title || '首页';
        dispatch(initTabs({ pathname: location.pathname, title: current }));
    }, []);
    React.useEffect(() => {
        const current = breadcrumbItems?.[breadcrumbItems.length - 1]?.title || '首页';
        dispatch(addTab({ key: location.pathname, title: current, path: location.pathname }));
    }, [location.pathname]);

    const onTabChange = (key) => {
        dispatch(setActiveTab(key));
        navigate(key);
    };
    const onEdit = (targetKey, action) => {
        if (action === 'remove') {
            dispatch(removeTab(targetKey));
        }
    };
    React.useEffect(() => {
        if (activeKey && activeKey !== location.pathname) navigate(activeKey);
    }, [activeKey]);

    // 同步页面标题到网站标题
    const { syncTitle } = useTheme();
    React.useEffect(() => {
        const base = import.meta.env.VITE_TITLE || document.title || '';
        if (syncTitle) {
            const current = breadcrumbItems?.[breadcrumbItems.length - 1]?.title || '首页';
            document.title = `${current} - ${base}`;
        } else {
            document.title = base;
        }
    }, [location.pathname, syncTitle]);
    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            <Sider trigger={null} collapsible collapsed={!menuShow} collapsedWidth={70} onCollapse={toggleMenu} style={{
                backgroundColor: isDark ? '#0f172a' : '#fff',
                boxShadow: '2px 0 8px rgba(0, 0, 0, 0.08)',
                borderRight: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
                transition: 'all .25s ease'
            }}>
                <div
                    className="logo"
                    style={{
                        height: 50,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: menuShow ? 'flex-start' : 'center',
                        gap: menuShow ? 8 : 0,
                        padding: menuShow ? '0 12px' : 0
                    }}
                >
                    <Logo />
                    <span
                        className="logo-text"
                        style={{
                            color: isDark ? '#fff' : '#000',
                            fontWeight: 600,
                            opacity: menuShow ? 1 : 0,
                            width: menuShow ? 'auto' : 0,
                            marginLeft: menuShow ? 8 : 0,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            transition: 'opacity .2s ease, width .2s ease, margin-left .2s ease'
                        }}
                    >
                        {baseTitle}
                    </span>
                </div>
                <Menu
                    theme={isDark ? 'dark' : 'light'}
                    selectedKeys={selectedKeys}
                    mode="inline"
                    items={menuItems}
                    onClick={handleMenuClick}
                />
            </Sider>
            <Layout className="site-layout">
                <Header
                    style={{
                        padding: 0,
                        height: 50,
                        backgroundColor: isDark ? '#0f172a' : '#fff',
                    }}
                >
                    <Headers></Headers>
                </Header>
                <Content
                    style={{
                        padding: 0,
                        boxSizing: 'border-box',
                        backgroundColor: isDark ? '#0b1220' : '#fff',
                        flex: 1,
                        overflow: 'hidden',
                    }}
                >
                    {showBreadcrumb && (
                        <div className="breadcrumb-container" style={{ padding: '8px 12px 0' }}>
                            <Tabs
                                hideAdd
                                type="editable-card"
                                size="small"
                                activeKey={activeKey}
                                onChange={onTabChange}
                                onEdit={onEdit}
                                items={(openTabs || []).map(t => ({
                                    key: t.key,
                                    label: (
                                        <Dropdown
                                            trigger={['contextMenu']}
                                            menu={{
                                                items: [
                                                    { key: 'close', label: '关闭当前' },
                                                    { key: 'closeOthers', label: '关闭其他' },
                                                    { key: 'closeAll', label: '关闭所有' },
                                                ],
                                                onClick: ({ key: actionKey }) => {
                                                    if (actionKey === 'close') dispatch(removeTab(t.key));
                                                    if (actionKey === 'closeOthers') dispatch({ type: 'trigger/closeOtherTabs', payload: t.key });
                                                    if (actionKey === 'closeAll') dispatch({ type: 'trigger/closeAllTabs' });
                                                },
                                            }}
                                        >
                                            <span>{t.title}</span>
                                        </Dropdown>
                                    ),
                                    closable: t.key !== '/',
                                }))}
                            />
                        </div>
                    )}
                    <div className='content-area' style={{ backgroundColor: isDark ? '#141414' : '#f5f5f5' }}>
                        {/* 动态组件占位 */}
                        <Outlet />
                    </div>
                </Content>
                {showFooter && (
                    <Footer
                        style={{
                            textAlign: 'center',
                            backgroundColor: isDark ? '#001529' : '#fff',
                            color: isDark ? '#fff' : '#000',
                            height: '50px',
                            borderTop: `1px solid ${isDark ? '#434343' : '#d9d9d9'}`,
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <span>{env.VITE_PROJECT_DESCRIPTION}{env.VITE_TITLE}</span>
                        </div>
                    </Footer>
                )}
            </Layout>
        </Layout>
    );
};
export default MainLayout;