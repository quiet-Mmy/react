import React from 'react';
import { Outlet } from 'react-router-dom';

const System = () => {
    return (
        <div>
            <h2>系统管理</h2>
            <p>这是系统管理页面</p>
            <Outlet />
        </div>
    );
};

export default System;
