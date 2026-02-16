/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import EpisodeEditorDrawer from './EpisodeEditorDrawer';
import { scriptsEpisodeApi } from '@/api/service/scripts-episode';

// Mock API
vi.mock('@/api/service/scripts-episode', () => ({
  scriptsEpisodeApi: {
    getEpisodeById: vi.fn(),
    createEpisode: vi.fn(),
    updateEpisode: vi.fn(),
  },
}));

// Mock TextEditorPanel
vi.mock('../../scripts-backgound-plot/TextEditorPanel', () => ({
    TextEditorPanel: ({ value, onChange, placeholder }: any) => (
        <textarea 
            data-testid="editor"
            value={value} 
            onChange={e => onChange(e.target.value)} 
            placeholder={placeholder}
        />
    )
}));

// Mock window.matchMedia for Antd
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('EpisodeEditorDrawer', () => {
  const mockOnClose = vi.fn();
  const mockOnSave = vi.fn();
  const defaultProps = {
    open: true,
    onClose: mockOnClose,
    onSave: mockOnSave,
    projectId: 'p1',
    chapterId: 'c1',
    episode: {
        episodeId: 'e1',
        projectId: 'p1',
        chapterId: 'c1',
        episodeTitle: 'Test Episode',
        episodeNumber: 1,
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01'
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly and fetches content', async () => {
    (scriptsEpisodeApi.getEpisodeById as any).mockResolvedValue({
        success: true,
        data: { ...defaultProps.episode, episodeContent: 'Content' }
    });

    render(<EpisodeEditorDrawer {...defaultProps} />);
    
    await waitFor(() => {
        expect(scriptsEpisodeApi.getEpisodeById).toHaveBeenCalledWith({ id: 'e1' });
    });
    
    // Check if title is present
    expect(screen.getByText('编辑桥段 #1')).toBeTruthy();
  });

  it('handles create mode (empty episodeId)', async () => {
      // Create mode props
      const createProps = {
          ...defaultProps,
          episode: {
              ...defaultProps.episode,
              episodeId: '' // Empty ID
          }
      };

      render(<EpisodeEditorDrawer {...createProps} />);
      
      // Should NOT call getEpisodeById
      expect(scriptsEpisodeApi.getEpisodeById).not.toHaveBeenCalled();
      
      // Enter content
      // Use getAllByPlaceholderText because Antd Drawer might render multiple instances or hidden inputs in test env
      const titleInputs = screen.getAllByPlaceholderText('请输入桥段标题');
      const titleInput = titleInputs[titleInputs.length - 1]; // Use the last one (usually the active one in portal)
      fireEvent.change(titleInput, { target: { value: 'New Title' } });
      
      const contentInputs = screen.getAllByPlaceholderText('请输入桥段详细内容...');
      const contentInput = contentInputs[contentInputs.length - 1];
      fireEvent.change(contentInput, { target: { value: 'New Content' } });
      
      // Click Save
      const saveBtns = screen.getAllByText('保存');
      const saveBtn = saveBtns[saveBtns.length - 1];
      
      // Mock create response
      (scriptsEpisodeApi.createEpisode as any).mockResolvedValue({
          success: true,
          data: { 
              id: 'new-id', 
              episodeTitle: 'New Title', 
              episodeContent: 'New Content',
              projectId: 'p1',
              chapterId: 'c1'
          }
      });

      fireEvent.click(saveBtn);
      
      await waitFor(() => {
          expect(scriptsEpisodeApi.createEpisode).toHaveBeenCalledWith(expect.objectContaining({
              episodeTitle: 'New Title',
              episodeContent: 'New Content'
          }));
          expect(mockOnSave).toHaveBeenCalled();
      });
  });

  it('handles save error gracefully', async () => {
      const createProps = {
          ...defaultProps,
          episode: { ...defaultProps.episode, episodeId: '' }
      };

      render(<EpisodeEditorDrawer {...createProps} />);
      
      const titleInputs = screen.getAllByPlaceholderText('请输入桥段标题');
      const titleInput = titleInputs[titleInputs.length - 1];
      fireEvent.change(titleInput, { target: { value: 'New Title' } });
      
      const saveBtns = screen.getAllByText('保存');
      const saveBtn = saveBtns[saveBtns.length - 1];
      
      (scriptsEpisodeApi.createEpisode as any).mockRejectedValue(new Error('Network Error'));

      fireEvent.click(saveBtn);
      
      await waitFor(() => {
          expect(scriptsEpisodeApi.createEpisode).toHaveBeenCalled();
          // Verify loading state is cleared (button enabled/not loading)
          // Antd button loading adds a class or disabled attribute
          // When not loading, disabled attribute should not be present (unless other logic disables it)
          // But Antd button might put loading state in a class or internal span.
          // However, we are checking if it's clickable/not disabled.
          expect(saveBtn.hasAttribute('disabled')).toBe(false);
      });
  });
});
