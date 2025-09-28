import './header.css';
import TriggerColor from './triggerColor';
import ConfigPanel from '../components/ConfigPanel';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, App } from 'antd';
import { useTheme } from '../hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import React from 'react';

function Header() {
    const env = import.meta.env;
    const { isDark, menuShow, toggleMenu } = useTheme();
    const navigate = useNavigate();
    function handleMenuShow() {
        toggleMenu();
    }
    const { modal, message } = App.useApp(); // 获取上下文 modal--这里注意 需要在AntdApp 中注册下App 才能全局使用
    const setModal = () => {
        modal.confirm({
            title: '确认退出？',
            content: '你确定要退出登录吗？',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                message.success('已退出登录');
                navigate('/login');
            },
            onCancel() {
                message.info('已取消退出登录');
            },
        });
    };

    return (
        <div className='container-header' style={{
            backgroundColor: isDark ? '#001529' : '#fff',
        }}>
            <div className='menu'>
                {menuShow ? (
                    <MenuFoldOutlined onClick={handleMenuShow} />
                ) : (
                    <MenuUnfoldOutlined onClick={handleMenuShow} />
                )}
            </div>
            <div className='title'>{env.VITE_TITLE}</div>
            <div className='header-util'>
                <TriggerColor />
                <ConfigPanel />
                <Dropdown
                    trigger={['click', 'hover']}
                    placement='bottomRight'
                    menu={{
                        items: [
                            { key: 'profile', label: '个人中心' },
                            { type: 'divider' },
                            { key: 'logout', label: '退出登录' },
                        ],
                        onClick: ({ key }) => {
                            if (key === 'logout') {
                                setModal()
                            }
                        }
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                        |
                        <Avatar size={22} icon={<UserOutlined />} />
                        <span style={{ fontSize: 14 }}>Admin</span>
                    </div>
                </Dropdown>
            </div>
        </div>
    );
}
export default Header;