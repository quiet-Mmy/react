import { MoonFilled, SunOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { changeTrigger, selectTrigger } from '@/store/modules/triggerStore';
import './trigger.css';


function TriggerColor() {
    const dispatch = useDispatch();
    const isMoon = useSelector(selectTrigger);
    function handleTrigger(e) {
        const next = isMoon === 'moon' ? 'sun' : 'moon';

        const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduce || !('startViewTransition' in document)) {
            document.documentElement.classList.toggle('dark');
            dispatch(changeTrigger(next));
            return;
        }
        const goingDark = document.documentElement.classList.contains('dark');
        // 根据方向设置辅助类，控制层级
        document.documentElement.classList.add('vt-running');
        document.documentElement.classList.add(goingDark ? 'vt-new-top' : 'vt-old-top');
        const transition = document.startViewTransition(() => {
            // 过渡中切换主题类
            document.documentElement.classList.toggle('dark');
            dispatch(changeTrigger(next));
        });

        transition.ready.then(() => {
            // 支持键盘触发等无坐标场景：回退到视窗中心
            const x = (e && 'clientX' in e) ? e.clientX : window.innerWidth / 2;
            const y = (e && 'clientY' in e) ? e.clientY : window.innerHeight / 2;

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
    }

    return (
        <>
            {isMoon === 'moon' ? (
                <SunOutlined onClick={handleTrigger} />
            ) : (
                <MoonFilled onClick={handleTrigger} />
            )}
        </>
    )
}
export default TriggerColor;