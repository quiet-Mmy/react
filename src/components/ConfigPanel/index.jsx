import React, { useEffect, useRef, useState } from 'react';
import { Drawer, Switch, ColorPicker, Select, Divider, Space, Typography, Button } from 'antd';
import { SettingOutlined, CloseOutlined } from '@ant-design/icons';
import { useTheme } from '../../hooks/useTheme';
import './index.css';

const { Title, Text } = Typography;
const { Option } = Select;

/**
 * 配置面板组件
 */
const ConfigPanel = () => {
    const { isDark, toggleTheme, showFooter, showBreadcrumb, toggleFooter, toggleBreadcrumb, syncTitle, toggleSyncTitle } = useTheme();
    const [open, setOpen] = useState(false);
    const [triggerPos, setTriggerPos] = useState(() => {
        try {
            const saved = localStorage.getItem('configTriggerPos');
            return saved ? JSON.parse(saved) : null;
        } catch (_) {
            return null;
        }
    });
    const draggingRef = useRef(false);
    const startRef = useRef({ x: 0, y: 0, left: 0, top: 0, moved: false });
    const triggerRef = useRef(null);
    const rafRef = useRef(0);
    const latestPosRef = useRef({ left: 0, top: 0 });

    useEffect(() => {
        if (!triggerPos) {
            const top = Math.max(20, Math.floor(window.innerHeight / 2 - 20));
            const initial = { left: window.innerWidth - 60, top };
            setTriggerPos(initial);
            latestPosRef.current = initial;
        } else {
            latestPosRef.current = triggerPos;
            if (triggerRef.current) {
                triggerRef.current.style.left = triggerPos.left + 'px';
                triggerRef.current.style.top = triggerPos.top + 'px';
            }
        }
    }, [triggerPos]);

    useEffect(() => {
        if (!triggerPos) return;
        try { localStorage.setItem('configTriggerPos', JSON.stringify(triggerPos)); } catch (_) { }
    }, [triggerPos]);

    useEffect(() => {
        const onMove = (e) => {
            if (!draggingRef.current) return;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const dx = clientX - startRef.current.x;
            const dy = clientY - startRef.current.y;
            const nextLeft = startRef.current.left + dx;
            const nextTop = startRef.current.top + dy;
            if (Math.abs(dx) + Math.abs(dy) > 3) startRef.current.moved = true;
            const maxLeft = window.innerWidth - 50;
            const maxTop = window.innerHeight - 50;
            latestPosRef.current = {
                left: Math.min(Math.max(10, nextLeft), maxLeft),
                top: Math.min(Math.max(10, nextTop), maxTop),
            };
            if (!rafRef.current) {
                rafRef.current = requestAnimationFrame(() => {
                    rafRef.current = 0;
                    if (triggerRef.current) {
                        triggerRef.current.style.left = latestPosRef.current.left + 'px';
                        triggerRef.current.style.top = latestPosRef.current.top + 'px';
                    }
                });
            }
        };
        const onUp = () => { draggingRef.current = false; };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('touchend', onUp);
        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
            window.removeEventListener('touchmove', onMove);
            window.removeEventListener('touchend', onUp);
        };
    }, []);

    const handleTriggerDown = (e) => {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        draggingRef.current = true;
        startRef.current = {
            x: clientX,
            y: clientY,
            left: triggerPos?.left ?? (window.innerWidth - 60),
            top: triggerPos?.top ?? Math.max(20, Math.floor(window.innerHeight / 2 - 20)),
            moved: false,
        };
        if (triggerRef.current) {
            triggerRef.current.style.transition = 'none';
            triggerRef.current.style.cursor = 'grabbing';
        }
    };

    const handleTriggerUp = () => {
        // 若未产生明显位移，则视为点击
        if (!startRef.current.moved) setOpen(true);
        draggingRef.current = false;
        // 固化位置到 state/localStorage，并恢复过渡
        if (triggerRef.current) {
            triggerRef.current.style.transition = '';
            triggerRef.current.style.cursor = '';
        }
        if (latestPosRef.current) {
            setTriggerPos(latestPosRef.current);
        }
    };
    const [config, setConfig] = useState({
        primaryColor: '#1677ff',
        showFooter: false,
        showBreadcrumb: false,
        menuMode: 'inline',
        compactMode: false,
    });

    const handleConfigChange = (key, value) => {
        setConfig(prev => ({
            ...prev,
            [key]: value
        }));

        // 应用配置到全局
        applyConfig({ ...config, [key]: value });
    };

    // 带动画的主题切换处理函数
    const handleThemeToggle = (checked) => {
        const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduce || !('startViewTransition' in document)) {
            document.documentElement.classList.toggle('dark');
            toggleTheme();
            return;
        }

        const goingDark = document.documentElement.classList.contains('dark');
        // 根据方向设置辅助类，控制层级
        document.documentElement.classList.add('vt-running');
        document.documentElement.classList.add(goingDark ? 'vt-new-top' : 'vt-old-top');

        const transition = document.startViewTransition(() => {
            // 过渡中切换主题类
            document.documentElement.classList.toggle('dark');
            toggleTheme();
        });

        transition.ready.then(() => {
            // 使用右上角作为动画起点，更符合用户操作习惯
            const x = window.innerWidth - 20; // 距离右边20px
            const y = 20; // 距离顶部20px

            // 使用 150vmax 覆盖整屏，避免最后一像素误差导致闪烁
            const maxSize = '150vmax';
            const expand = [`circle(0 at ${x}px ${y}px)`, `circle(${maxSize} at ${x}px ${y}px)`];
            const shrink = [`circle(${maxSize} at ${x}px ${y}px)`, `circle(0 at ${x}px ${y}px)`];

            if (goingDark) {
                document.documentElement.animate(
                    { clipPath: expand },
                    { duration: 600, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)', fill: 'both' }
                );
            } else {
                document.documentElement.animate(
                    { clipPath: shrink },
                    { duration: 600, easing: 'ease-in-out', pseudoElement: '::view-transition-old(root)', fill: 'both' }
                );
            }

            const cleanup = () => {
                document.documentElement.classList.remove('vt-new-top');
                document.documentElement.classList.remove('vt-old-top');
                document.documentElement.classList.remove('vt-running');
            }
            transition.finished.then(cleanup).catch(cleanup);
        });
    };

    const applyConfig = (newConfig) => {
        // 应用主题色
        document.documentElement.style.setProperty('--primary-color', newConfig.primaryColor);

        // 应用其他配置
        document.documentElement.classList.toggle('hide-footer', !newConfig.showFooter);
        document.documentElement.classList.toggle('hide-breadcrumb', !newConfig.showBreadcrumb);
        document.documentElement.classList.toggle('compact-mode', newConfig.compactMode);
    };

    const resetConfig = () => {
        const defaultConfig = {
            primaryColor: '#1677ff',
            showFooter: true,
            showBreadcrumb: true,
            menuMode: 'inline',
            compactMode: false,
        };
        setConfig(defaultConfig);
        applyConfig(defaultConfig);
    };

    return (
        <>

            <Button
                type="text"
                icon={<SettingOutlined />}
                onMouseDown={handleTriggerDown}
                onMouseUp={handleTriggerUp}
                onTouchStart={handleTriggerDown}
                onTouchEnd={handleTriggerUp}
                style={{
                    width: '40px',
                    height: '40px',
                    position: 'fixed',
                    left: (triggerPos?.left ?? (window.innerWidth - 60)) + 'px',
                    top: (triggerPos?.top ?? Math.max(20, Math.floor(window.innerHeight / 2 - 20))) + 'px',
                    right: 'auto',
                    transform: 'none',
                    cursor: 'grab'
                }}
                ref={triggerRef}
                className="config-trigger"
                title="系统配置"
            />

            <Drawer
                title={
                    <div className="config-drawer-header">
                        <SettingOutlined />
                        <span>系统配置</span>
                    </div>
                }
                placement="right"
                onClose={() => setOpen(false)}
                open={open}
                width={360}
                className={`config-drawer ${isDark ? 'dark' : 'light'}`}
                closable={false}
                mask={true}
                maskClosable={true}
                zIndex={1001}
                style={{
                    backgroundColor: isDark ? '#1f1f1f' : '#fff',
                    color: isDark ? '#fff' : '#000',
                    padding: '0px',
                }}
                extra={
                    <Button
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={() => setOpen(false)}
                        className="close-button"
                    />
                }
            >
                <div
                    className="config-content"
                    style={{
                        backgroundColor: isDark ? '#1f1f1f' : '#fff',
                        color: isDark ? '#fff' : '#000'
                    }}
                >
                    {/* 主题设置 */}
                    <div
                        className="config-section"
                        style={{
                            backgroundColor: isDark ? '#1f1f1f' : '#fff',
                            color: isDark ? '#fff' : '#000'
                        }}
                    >
                        <Title level={5}>主题设置</Title>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <div className="config-item">
                                <Text>深色模式</Text>
                                <Switch
                                    checked={isDark}
                                    onChange={handleThemeToggle}
                                />
                            </div>

                            <div className="config-item">
                                <Text>主题色</Text>
                                <ColorPicker
                                    value={config.primaryColor}
                                    onChange={(color) => handleConfigChange('primaryColor', color.toHexString())}
                                    showText
                                />
                            </div>
                        </Space>
                    </div>

                    <Divider />

                    {/* 布局设置 */}
                    <div className="config-section">
                        <Title level={5}>布局设置</Title>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <div className="config-item">
                                <Text>显示底部</Text>
                                <Switch
                                    checked={showFooter}
                                    onChange={toggleFooter}
                                />
                            </div>

                            <div className="config-item">
                                <Text>显示面包屑</Text>
                                <Switch
                                    checked={showBreadcrumb}
                                    onChange={toggleBreadcrumb}
                                />
                            </div>

                            <div className="config-item">
                                <Text>紧凑模式</Text>
                                <Switch
                                    checked={config.compactMode}
                                    onChange={(checked) => handleConfigChange('compactMode', checked)}
                                />
                            </div>

                            <div className="config-item">
                                <Text>菜单模式</Text>
                                <Select
                                    value={config.menuMode}
                                    onChange={(value) => handleConfigChange('menuMode', value)}
                                    style={{
                                        width: 120,
                                        backgroundColor: isDark ? '#434343' : '#fff',
                                        color: isDark ? '#fff' : '#000',
                                        borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : '#d9d9d9'
                                    }}
                                >
                                    <Option value="inline">内嵌</Option>
                                    <Option value="horizontal">水平</Option>
                                </Select>
                            </div>

                            <div className="config-item">
                                <Text>同步页面标题到网站标题</Text>
                                <Switch
                                    checked={syncTitle}
                                    onChange={toggleSyncTitle}
                                />
                            </div>
                        </Space>
                    </div>

                    {/* 操作按钮 */}
                    <div className="config-actions">
                        <Space>
                            <Button onClick={resetConfig}>
                                重置配置
                            </Button>
                            <Button type="primary" onClick={() => setOpen(false)}>
                                保存配置
                            </Button>
                        </Space>
                    </div>
                </div>
            </Drawer>
        </>
    );
};

export default ConfigPanel;
