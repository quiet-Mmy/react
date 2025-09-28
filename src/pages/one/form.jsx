import { useRef, useState, useCallback } from 'react'
import { Button } from 'antd';
function Form() {
    const timerRef = useRef(null); // 用来保存 setTimeout 的 ID
    const [form, setForm] = useState({ name: '', email: '', phone: '' })// 用来保存 form 元素的引用
    // useCallback 在多次渲染中缓存一个函数，直至这个函数的依赖发生改变。
    const confirmSubmit = useCallback(() => {
        console.log('提交接口', form);
    }, [form]); // 依赖 form元素 只要这些依赖没有改变

    const handleSubmit = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            console.log('提交接口-开始');
            confirmSubmit();
        }, 0);
    }, [confirmSubmit]);// 只要这些依赖没有改变

    const handleChange = useCallback((field) => (e) => {
        setForm(prev => ({ ...prev, [field]: e.target.value }));
    }, []); //  只创建一次

    return (
        <>
            <input type="text" value={form.name} placeholder="请输入姓名" onChange={handleChange('name')} />
            <input type="text" value={form.email} placeholder="请输入邮箱" onChange={handleChange('email')} />
            <input type="text" value={form.phone} placeholder="请输入手机号" onChange={handleChange('phone')} />
            <Button onClick={() => handleSubmit()} type="primary">提交</Button>
        </>
    )
}
export default Form