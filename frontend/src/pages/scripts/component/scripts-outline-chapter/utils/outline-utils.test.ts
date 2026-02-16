import { describe, it, expect } from 'vitest';
import { createClientNodeId, generateChapterId, recalculateNumbers } from './outline-utils';
import type { StoryOutlineDTO } from '@/api/types/scripts-outline-types';

describe('recalculateNumbers', () => {
  it('should NOT throw TypeError when episodes is undefined in a new chapter', () => {
    const outline: StoryOutlineDTO = {
      id: 'outline-1',
      projectId: 'project-1',
      structureType: 'BEGINNING_RISING_ACTION_CLIMAX_END',
      sections: [
        {
          sectionId: 'section-1',
          sectionTitle: 'Section 1',
          description: 'Desc',
          sequence: 1,
          chapterCount: 1,
          chapters: [
            {
              chapterId: 'chapter-1',
              chapterTitle: 'Chapter 1',
              chapterSummary: 'Summary',
              chapterNumber: 1,
              episodeCount: 0,
              wordCount: 0,
              // @ts-ignore - simulating missing episodes field
              episodes: undefined, 
              createdAt: '2023-01-01',
              updatedAt: '2023-01-01'
            }
          ],
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01'
        }
      ],
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01'
    };

    expect(() => recalculateNumbers(outline)).not.toThrow();
    
    const result = recalculateNumbers(outline);
    expect(result.sections[0].chapters[0].episodeCount).toBe(0);
    expect(result.sections[0].chapters[0].episodes).toEqual([]);
  });

  it('should handle undefined sections', () => {
    const outline: StoryOutlineDTO = {
      id: 'outline-1',
      projectId: 'project-1',
      structureType: 'BEGINNING_RISING_ACTION_CLIMAX_END',
      // @ts-ignore
      sections: undefined,
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01'
    };

    expect(() => recalculateNumbers(outline)).not.toThrow();
    const result = recalculateNumbers(outline);
    expect(result.sections).toEqual([]);
  });

  it('should handle undefined chapters', () => {
    const outline: StoryOutlineDTO = {
      id: 'outline-1',
      projectId: 'project-1',
      structureType: 'BEGINNING_RISING_ACTION_CLIMAX_END',
      sections: [
        {
          sectionId: 'section-1',
          sectionTitle: 'Section 1',
          description: 'Desc',
          sequence: 1,
          chapterCount: 0,
          // @ts-ignore
          chapters: undefined,
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01'
        }
      ],
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01'
    };

    expect(() => recalculateNumbers(outline)).not.toThrow();
    const result = recalculateNumbers(outline);
    expect(result.sections[0].chapterCount).toBe(0);
    expect(result.sections[0].chapters).toEqual([]);
  });

  it('should correctly reorder numbers', () => {
     const outline: StoryOutlineDTO = {
      id: 'outline-1',
      projectId: 'project-1',
      structureType: 'BEGINNING_RISING_ACTION_CLIMAX_END',
      sections: [
        {
          sectionId: 'section-1',
          sectionTitle: 'Section 1',
          description: 'Desc',
          sequence: 2, // Wrong order
          chapterCount: 1,
          chapters: [
            {
              chapterId: 'chapter-1',
              chapterTitle: 'Chapter 1',
              chapterSummary: 'Summary',
              chapterNumber: 2, // Wrong order
              episodeCount: 1,
              wordCount: 0,
              episodes: [
                  {
                      episodeId: 'ep-1',
                      episodeNumber: 2, // Wrong order
                      episodeTitle: 'Ep 1',
                      projectId: 'p1',
                      chapterId: 'chapter-1',
                      createdAt: '2023-01-01',
                      updatedAt: '2023-01-01'
                  }
              ], 
              createdAt: '2023-01-01',
              updatedAt: '2023-01-01'
            }
          ],
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01'
        }
      ],
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01'
    };

    const result = recalculateNumbers(outline);
    expect(result.sections[0].sequence).toBe(1);
    expect(result.sections[0].chapters[0].chapterNumber).toBe(1);
    expect(result.sections[0].chapters[0].episodes[0].episodeNumber).toBe(1);
  });
});

describe('ID generation length constraints', () => {
  it('should generate 1000 ChapterID samples with length <= 32', () => {
    const sizes: number[] = [];
    const ids = new Set<string>();
    for (let i = 0; i < 1000; i += 1) {
      const id = generateChapterId('any-section-id');
      sizes.push(id.length);
      ids.add(id);
      expect(id.length).toBeLessThanOrEqual(32);
    }
    const maxLen = Math.max(...sizes);
    const avgLen = sizes.reduce((a, b) => a + b, 0) / sizes.length;
    expect(maxLen).toBeLessThanOrEqual(32);
    expect(avgLen).toBeLessThanOrEqual(32);
    expect(ids.size).toBe(1000);
  });

  it('should generate 1000 EpisodeId samples with length <= 32 (client-side helper)', () => {
    const sizes: number[] = [];
    const ids = new Set<string>();
    for (let i = 0; i < 1000; i += 1) {
      const id = createClientNodeId('episode');
      sizes.push(id.length);
      ids.add(id);
      expect(id.length).toBeLessThanOrEqual(32);
    }
    const maxLen = Math.max(...sizes);
    const avgLen = sizes.reduce((a, b) => a + b, 0) / sizes.length;
    expect(maxLen).toBeLessThanOrEqual(32);
    expect(avgLen).toBeLessThanOrEqual(32);
    expect(ids.size).toBe(1000);
  });
});
