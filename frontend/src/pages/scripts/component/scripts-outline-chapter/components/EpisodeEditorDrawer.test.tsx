/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import EpisodeEditorDrawer, { calculateWordCountSafe } from './EpisodeEditorDrawer';
import apiClient from '@/api/request.ts';

vi.mock('@/api/request.ts', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
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

Object.defineProperty(window, 'getComputedStyle', {
  writable: true,
  value: vi.fn().mockReturnValue({}),
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
    localStorage.clear();
  });

  it('renders correctly and fetches content', async () => {
    (apiClient.get as any).mockResolvedValue({
      success: true,
      data: {
        id: 'e1',
        projectId: 'p1',
        chapterId: 'c1',
        episodeTitle: 'Test Episode',
        episodeNumber: 1,
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
        episodeContent: 'Content',
        wordCount: 7
      }
    });

    render(<EpisodeEditorDrawer {...defaultProps} />);
    
    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith('/v1/episodes/e1', expect.any(Object));
    });
    
    // Check if title is present
    expect(screen.getByText('编辑桥段 #1')).toBeTruthy();
  });

  it('does not create episode on title/content input (create mode)', async () => {
      // Create mode props
      const createProps = {
          ...defaultProps,
          episode: {
              ...defaultProps.episode,
              episodeId: '' // Empty ID
          }
      };

      render(<EpisodeEditorDrawer {...createProps} />);
      
      expect(apiClient.get).not.toHaveBeenCalled();
      
      // Enter title/content without clicking save
      const titleInputs = screen.getAllByPlaceholderText('请输入桥段标题');
      const titleInput = titleInputs[titleInputs.length - 1]; // Use the last one (usually the active one in portal)
      fireEvent.change(titleInput, { target: { value: 'New Title' } });
      
      const contentInputs = screen.getAllByPlaceholderText('请输入桥段详细内容...');
      const contentInput = contentInputs[contentInputs.length - 1];
      fireEvent.change(contentInput, { target: { value: 'New Content' } });

      expect(apiClient.post).not.toHaveBeenCalled();
      expect(apiClient.put).not.toHaveBeenCalled();
  });

  it('creates once on save, then updates on next save (create mode)', async () => {
      const createProps = {
          ...defaultProps,
          episode: {
              ...defaultProps.episode,
              episodeId: ''
          }
      };

      (apiClient.post as any).mockResolvedValue({
          success: true,
          data: {
              id: 'newidnewidnewidnewidnewidnewid',
              episodeTitle: 'New Title',
              episodeContent: 'New Content',
              projectId: 'p1',
              chapterId: 'c1',
              episodeNumber: 1,
              wordCount: 11,
              createdAt: '2023-01-01',
              updatedAt: '2023-01-01'
          }
      });

      (apiClient.put as any).mockResolvedValue({
          success: true,
          data: {
              id: 'newidnewidnewidnewidnewidnewid',
              episodeTitle: 'New Title 2',
              episodeContent: 'New Content 2',
              projectId: 'p1',
              chapterId: 'c1',
              episodeNumber: 1,
              wordCount: 13,
              createdAt: '2023-01-01',
              updatedAt: '2023-01-01'
          }
      });

      render(<EpisodeEditorDrawer {...createProps} />);

      const titleInputs = screen.getAllByPlaceholderText('请输入桥段标题');
      const titleInput = titleInputs[titleInputs.length - 1];
      fireEvent.change(titleInput, { target: { value: 'New Title' } });

      const contentInputs = screen.getAllByPlaceholderText('请输入桥段详细内容...');
      const contentInput = contentInputs[contentInputs.length - 1];
      fireEvent.change(contentInput, { target: { value: 'New Content' } });
      
      // Click Save
      const saveBtns = screen.getAllByText('保存');
      const saveBtn = saveBtns[saveBtns.length - 1];
      
      fireEvent.click(saveBtn);
      
      await waitFor(() => {
          expect(apiClient.post).toHaveBeenCalledTimes(1);
          expect(mockOnSave).toHaveBeenCalled();
      });

      fireEvent.change(titleInput, { target: { value: 'New Title 2' } });
      fireEvent.change(contentInput, { target: { value: 'New Content 2' } });
      fireEvent.click(saveBtn);

      await waitFor(() => {
          expect(apiClient.put).toHaveBeenCalledTimes(1);
      });
  });

  it('handles save error gracefully and does not throw after close', async () => {
      const createProps = {
          ...defaultProps,
          episode: { ...defaultProps.episode, episodeId: '' }
      };

      render(<EpisodeEditorDrawer {...createProps} />);
      
      const titleInputs = screen.getAllByPlaceholderText('请输入桥段标题');
      const titleInput = titleInputs[titleInputs.length - 1];
      fireEvent.change(titleInput, { target: { value: 'New Title' } });

      const contentInputs = screen.getAllByPlaceholderText('请输入桥段详细内容...');
      const contentInput = contentInputs[contentInputs.length - 1];
      fireEvent.change(contentInput, { target: { value: 'New Content' } });
      
      const saveBtns = screen.getAllByText('保存');
      const saveBtn = saveBtns[saveBtns.length - 1];
      
      (apiClient.post as any).mockRejectedValue({ status: null, message: 'Network Error' });

      fireEvent.click(saveBtn);
      
      await waitFor(() => {
          expect(apiClient.post).toHaveBeenCalled();
          expect(saveBtn.hasAttribute('disabled')).toBe(false);
      });

      const closeBtns = screen.getAllByText('关闭');
      const closeBtn = closeBtns[closeBtns.length - 1];
      fireEvent.click(closeBtn);
  });

  it('flushes offline queue on open when online', async () => {
    localStorage.setItem(
      'episode_save_queue_v1',
      JSON.stringify([
        {
          id: 'k1',
          method: 'POST',
          url: '/v1/episodes',
          headers: { 'Idempotency-Key': 'k1' },
          body: { projectId: 'p1', chapterId: 'c1', episodeNumber: 1, episodeTitle: 'T', episodeContent: 'C', wordCount: 1 },
          createdAt: Date.now(),
          attempt: 0
        }
      ])
    );

    (apiClient.post as any).mockResolvedValue({ success: true, data: { id: 'x', projectId: 'p1', chapterId: 'c1' } });

    const createProps = {
      ...defaultProps,
      episode: { ...defaultProps.episode, episodeId: '' }
    };

    render(<EpisodeEditorDrawer {...createProps} />);

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalled();
    });
  });

  it('rejects too-long saved id', async () => {
    const createProps = {
      ...defaultProps,
      episode: { ...defaultProps.episode, episodeId: '' }
    };

    (apiClient.post as any).mockResolvedValue({
      success: true,
      data: {
        id: 'x'.repeat(33),
        episodeTitle: 'New Title',
        episodeContent: 'New Content',
        projectId: 'p1',
        chapterId: 'c1',
        episodeNumber: 1,
        wordCount: 11,
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01'
      }
    });

    render(<EpisodeEditorDrawer {...createProps} />);

    const titleInputs = screen.getAllByPlaceholderText('请输入桥段标题');
    const titleInput = titleInputs[titleInputs.length - 1];
    fireEvent.change(titleInput, { target: { value: 'New Title' } });

    const contentInputs = screen.getAllByPlaceholderText('请输入桥段详细内容...');
    const contentInput = contentInputs[contentInputs.length - 1];
    fireEvent.change(contentInput, { target: { value: 'New Content' } });

    const saveBtns = screen.getAllByText('保存');
    const saveBtn = saveBtns[saveBtns.length - 1];
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockOnSave).not.toHaveBeenCalled();
    });
  });

  it('does not enqueue on non-network error', async () => {
    const createProps = {
      ...defaultProps,
      episode: { ...defaultProps.episode, episodeId: '' }
    };

    (apiClient.post as any).mockRejectedValue({ status: 400, message: 'Bad Request' });

    render(<EpisodeEditorDrawer {...createProps} />);

    const titleInputs = screen.getAllByPlaceholderText('请输入桥段标题');
    const titleInput = titleInputs[titleInputs.length - 1];
    fireEvent.change(titleInput, { target: { value: 'New Title' } });

    const contentInputs = screen.getAllByPlaceholderText('请输入桥段详细内容...');
    const contentInput = contentInputs[contentInputs.length - 1];
    fireEvent.change(contentInput, { target: { value: 'New Content' } });

    const saveBtns = screen.getAllByText('保存');
    const saveBtn = saveBtns[saveBtns.length - 1];
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledTimes(1);
    });

    expect(localStorage.getItem('episode_save_queue_v1')).toBeNull();
  });

  it('keeps failed queued item and increments attempt', async () => {
    localStorage.setItem(
      'episode_save_queue_v1',
      JSON.stringify([
        {
          id: 'k1',
          method: 'POST',
          url: '/v1/episodes',
          headers: { 'Idempotency-Key': 'k1' },
          body: { projectId: 'p1', chapterId: 'c1', episodeNumber: 1, episodeTitle: 'T', episodeContent: 'C', wordCount: 1 },
          createdAt: Date.now(),
          attempt: 0
        }
      ])
    );

    (apiClient.post as any).mockRejectedValue({ status: null, message: 'Network Error' });

    const createProps = {
      ...defaultProps,
      episode: { ...defaultProps.episode, episodeId: '' }
    };

    render(<EpisodeEditorDrawer {...createProps} />);

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalled();
    });

    const stored = JSON.parse(localStorage.getItem('episode_save_queue_v1') || '[]');
    expect(stored[0].attempt).toBe(1);
  });

  it('skips queue items when attempt reached max', async () => {
    localStorage.setItem(
      'episode_save_queue_v1',
      JSON.stringify([
        {
          id: 'k1',
          method: 'POST',
          url: '/v1/episodes',
          headers: { 'Idempotency-Key': 'k1' },
          body: { projectId: 'p1', chapterId: 'c1', episodeNumber: 1, episodeTitle: 'T', episodeContent: 'C', wordCount: 1 },
          createdAt: Date.now(),
          attempt: 10
        }
      ])
    );

    (apiClient.post as any).mockResolvedValue({ success: true, data: { id: 'x' } });

    const createProps = {
      ...defaultProps,
      episode: { ...defaultProps.episode, episodeId: '' }
    };

    render(<EpisodeEditorDrawer {...createProps} />);

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('episode_save_queue_v1') || '[]');
      expect(stored[0].attempt).toBe(10);
    });

    expect(apiClient.post).not.toHaveBeenCalled();
  });

  it('aborts in-flight operations on unmount', async () => {
    const createProps = {
      ...defaultProps,
      episode: { ...defaultProps.episode, episodeId: '' }
    };

    const { unmount } = render(<EpisodeEditorDrawer {...createProps} />);
    unmount();
  });
});

describe('calculateWordCountSafe', () => {
  it('handles undefined/null and strips html', () => {
    expect(calculateWordCountSafe(undefined)).toBe(0);
    expect(calculateWordCountSafe(null)).toBe(0);
    expect(calculateWordCountSafe('abc')).toBe(3);
    expect(calculateWordCountSafe('<p>ab</p>')).toBe(2);
  });
});
