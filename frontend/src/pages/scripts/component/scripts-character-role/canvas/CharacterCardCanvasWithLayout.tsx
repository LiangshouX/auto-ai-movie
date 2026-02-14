import 'tldraw/tldraw.css'
import BaseLayout from "@/pages/scripts/layout/BaseLayout.tsx";
import AppHeader from "@/pages/scripts/layout/AppHeader.tsx";
import CharacterCardCanvas from "./CharacterCardCanvas.tsx";

interface CharacterCardDemoWithLayoutProps {
    projectId?: string | null;
}

const CharacterCardCanvasWithLayout = (
    {projectId}: CharacterCardDemoWithLayoutProps
) => {
    return (
        <BaseLayout
            header={<AppHeader title="人物角色卡片画布"/>}
            contentStyle={{padding: 0}}
        >
            <div style={{
                position: 'relative',
                inset: 0,
                flex: 1,
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#fff',
            }}>
                <CharacterCardCanvas projectId={projectId}/>
            </div>
        </BaseLayout>
    )
}

export default CharacterCardCanvasWithLayout
