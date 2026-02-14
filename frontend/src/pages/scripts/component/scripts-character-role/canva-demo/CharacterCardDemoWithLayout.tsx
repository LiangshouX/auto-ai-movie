import 'tldraw/tldraw.css'
import BaseLayout from "@/pages/scripts/layout/BaseLayout.tsx";
import AppHeader from "@/pages/scripts/layout/AppHeader.tsx";
import CharacterCardDemo from "./CharacterCardDemo.tsx";

interface CharacterCardDemoWithLayoutProps {
  projectId?: string | null;
}

const CharacterCardDemoWithLayout = ({ projectId }: CharacterCardDemoWithLayoutProps) => {
    return (
        <BaseLayout
            header={<AppHeader title="人物角色卡片画布Demo" />}
            contentStyle={{ padding: 0 }}
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
                <CharacterCardDemo projectId={projectId}/>
            </div>
        </BaseLayout>
    )
}

export default CharacterCardDemoWithLayout
