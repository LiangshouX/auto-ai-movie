import {Outlet} from 'react-router-dom';
import ScriptEditor from '@/pages/scripts/component/scripts-manage/ScriptEditor.tsx';

const ScriptCreationLayout = () => {
    return (
        <>
            <ScriptEditor/>
            <Outlet/>
        </>
    );
};

export default ScriptCreationLayout;
