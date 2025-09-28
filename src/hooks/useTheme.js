import { useSelector, useDispatch } from 'react-redux';
import { selectTrigger, selectMenuShow, changeTrigger, changeMenuShow, selectShowFooter, selectShowBreadcrumb, setShowFooter, setShowBreadcrumb, selectSyncTitle, setSyncTitle } from '@/store/modules/triggerStore';

/**
 * 主题管理钩子
 * @returns {Object} 主题相关状态和方法
 */
export const useTheme = () => {
    const dispatch = useDispatch();
    const trigger = useSelector(selectTrigger);
    const menuShow = useSelector(selectMenuShow);
    const showFooter = useSelector(selectShowFooter);
    const showBreadcrumb = useSelector(selectShowBreadcrumb);
    const syncTitle = useSelector(selectSyncTitle);

    const isDark = trigger === 'moon';

    const toggleTheme = () => {
        dispatch(changeTrigger(trigger === 'moon' ? 'sun' : 'moon'));
    };

    const toggleMenu = () => {
        dispatch(changeMenuShow(!menuShow));
    };
    const toggleFooter = () => {
        dispatch(setShowFooter(!showFooter));
    };
    const toggleBreadcrumb = () => {
        dispatch(setShowBreadcrumb(!showBreadcrumb));
    };
    const toggleSyncTitle = () => {
        dispatch(setSyncTitle(!syncTitle));
    };

    return {
        trigger,
        isDark,
        menuShow,
        showFooter,
        showBreadcrumb,
        syncTitle,
        toggleTheme,
        toggleMenu,
        toggleFooter,
        toggleBreadcrumb,
        toggleSyncTitle,
    };
};
