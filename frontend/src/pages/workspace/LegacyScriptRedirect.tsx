import {Navigate, useParams} from 'react-router-dom';

const LegacyScriptRedirect = () => {
    const {projectId} = useParams<{ projectId: string }>();
    return <Navigate to={`/workspace/${projectId || ''}/script`} replace/>;
};

export default LegacyScriptRedirect;
