import { useState, useRef, useCallback } from 'react'
import Form from './form'

function One() {
    const timerRef = useRef(null); // 用来保存 setTimeout 的 ID
    // 你要更新界面 → 用 useState
    // 你要保存一个值但不想触发渲染 → 用 useRef
    const [inputVal, setInputVal] = useState('')
    function confirmSubmit() {
        console.log('提交接口');
    }
    const handleSubmit = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            console.log('提交接口-开始');
            confirmSubmit();
        }, 500);
    }, []);

    return (
        <>
            <Form />
            <h1>One</h1>
        </>
    )
}

export default One
