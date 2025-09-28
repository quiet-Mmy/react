import React from 'react';
import { Outlet } from 'react-router-dom';

const User = () => {
    return (
        <div>
            <h2>用户管理</h2>
            <p>这是用户管理页面</p>
            <Outlet />
        </div>
    );
};

export default User;
