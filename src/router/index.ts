import { createBrowserRouter } from 'react-router-dom'
import React from 'react'
import MainLayout from '../layouts/MainLayout.jsx'

// React.lazy 表示懒加载页面组件
const Login = React.lazy(() => import('../pages/login/login.jsx'))
const Home = React.lazy(() => import('../pages/home/index.jsx'))
const One = React.lazy(() => import('../pages/one/one.jsx'))

// 用户管理相关页面
const User = React.lazy(() => import('../pages/user/index.jsx'))
const UserList = React.lazy(() => import('../pages/user/list.jsx'))
const UserProfile = React.lazy(() => import('../pages/user/profile.jsx'))

// 系统管理相关页面
const System = React.lazy(() => import('../pages/system/index.jsx'))
const SystemSettings = React.lazy(() => import('../pages/system/settings.jsx'))

// 导出路由配置供侧边栏读取（handle 内放菜单元数据）
export const appRoutes = [
    {
        path: '/login',
        Component: Login,
        handle: { menu: false }
    },
    {
        path: '/',
        Component: MainLayout,
        children: [
            { index: true, Component: Home, handle: { key: '/', label: '首页', icon: 'HomeOutlined', menu: true } },
            { path: 'one', Component: One, handle: { key: '/one', label: '页面一', icon: 'AppstoreOutlined', menu: true } },
            {
                path: 'user',
                Component: User,
                handle: { key: '/user', label: '用户管理', icon: 'UserOutlined', menu: true },
                children: [
                    { index: true, Component: UserList, handle: { key: '/user/index', label: '用户列表', menu: false } },
                    { path: 'list', Component: UserList, handle: { key: '/user/list', label: '用户列表', menu: true } },
                    { path: 'profile', Component: UserProfile, handle: { key: '/user/profile', label: '个人资料', menu: true } }
                ]
            },
            {
                path: 'system',
                Component: System,
                handle: { key: '/system', label: '系统管理', icon: 'SettingOutlined', menu: true },
                children: [
                    { index: true, Component: SystemSettings, handle: { key: '/system/index', label: '系统设置', menu: false } },
                    { path: 'settings', Component: SystemSettings, handle: { key: '/system/settings', label: '系统设置', menu: true } }
                ]
            }
        ]
    }
] as const

const router = createBrowserRouter(appRoutes as any)
export default router