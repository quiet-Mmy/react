import React, { useEffect } from 'react';
import router from './router';
import { RouterProvider } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react'; //redux-persist 提供的一个"守门员"组件。
import { Provider } from 'react-redux';
import { store, persistor } from './store';//persistor 创建的持久化引擎
import ThemeProvider from './components/ThemeProvider';
import { App as AntdApp } from 'antd';  // 注意这里需要注册下App

// 乾坤微应用注册
import { registerMicroApps, start } from 'qiankun';

const microApps = [
  {
    name: 'reactServer',
    entry: import.meta.env.MODE === 'prod' ? '/reactServer' : './',
    container: '#subapp-container',
    activeRule: '/reactServer',
  },
  {
    name: 'vueServer',
    // 入口 服务域名 或者 本地服务 这里要注意 必须是打包后的服务才可以 npm run build --> npm run preview -- --host
    entry: import.meta.env.MODE === 'prod' ? '/vueServer/' : '//192.168.20.118:4173/',
    // 容器
    container: '#subapp-container-login',
    activeRule: '/login', // 避免与 React 路由冲突
  }
];

// 注册微应用
registerMicroApps(microApps);


const App = () => {
  useEffect(() => {
    // 在组件挂载后启动qiankun
    try {
      start({
        sandbox: {
          experimentalStyleIsolation: true // 使用推荐的样式隔离
        },
        singular: false, // 允许同时运行多个微应用
        prefetch: false, // 关闭预加载，避免立即加载微应用
      });
    } catch (error) {
      console.error('qiankun启动失败:', error);
    }
  }, []);

  return (
    <Provider store={store}>
      {/* PersistGate 就是为了 避免这种闪烁，等数据恢复完再渲染 */}
      {/* loading 可以是任何 React 元素：<Spinner />、<div>正在加载...</div>  不写默认null 空白 */}
      <PersistGate loading={<div>加载中...</div>} persistor={persistor}>
        <ThemeProvider>
          <AntdApp>
            <RouterProvider router={router} />
          </AntdApp>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;