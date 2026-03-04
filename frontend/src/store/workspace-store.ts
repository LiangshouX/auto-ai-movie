import {useSyncExternalStore} from 'react';
import {ScriptProject} from '@/api/types/project-types.ts';

interface WorkspaceState {
    currentProject: ScriptProject | null;
}

type WorkspaceListener = () => void;

const listeners = new Set<WorkspaceListener>();

let state: WorkspaceState = {
    currentProject: null
};

const emitChange = () => {
    listeners.forEach((listener) => {
        listener();
    });
};

const subscribe = (listener: WorkspaceListener) => {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
};

const getSnapshot = () => state;

export const workspaceStore = {
    getState: () => state,
    setCurrentProject: (project: ScriptProject | null) => {
        state = {
            ...state,
            currentProject: project
        };
        emitChange();
    },
    clearCurrentProject: () => {
        state = {
            ...state,
            currentProject: null
        };
        emitChange();
    }
};

export const useWorkspaceStore = () => {
    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
};
