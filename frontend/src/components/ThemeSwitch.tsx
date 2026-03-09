import React from 'react';
import {Switch, Tooltip} from 'antd';
import {MoonOutlined, SunOutlined} from '@ant-design/icons';
import {useAppThemeMode} from '@/theme-provider.tsx';

const ThemeSwitch: React.FC = () => {
    const {resolvedThemeMode, setThemeMode} = useAppThemeMode();
    const checked = resolvedThemeMode === 'dark';

    return (
        <Tooltip title={checked ? '切换为亮色主题' : '切换为暗色主题'}>
            <Switch
                checked={checked}
                checkedChildren={<MoonOutlined/>}
                unCheckedChildren={<SunOutlined/>}
                onChange={(nextChecked) => setThemeMode(nextChecked ? 'dark' : 'light')}
                className="app-theme-switch"
                aria-label="主题切换"
                title="主题切换"
                style={{minWidth: 56, minHeight: 32}}
            />
        </Tooltip>
    );
};

export default React.memo(ThemeSwitch);
