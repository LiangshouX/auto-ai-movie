import { Tldraw } from 'tldraw'
import BaseLayout from "@/pages/scripts/layout/BaseLayout.tsx";
import AppHeader from "@/pages/scripts/layout/AppHeader.tsx";

const BasicExample= () => {


    return (
        <BaseLayout
            header={<AppHeader title="基础画布调试" />}
            contentStyle={{ padding: 0 }}
        >
            <div style={{
                position: 'relative',
                inset: 0,
                flex: 1,
            }}>
                <Tldraw/>
            </div>
        </BaseLayout>
    )
}

export default BasicExample

