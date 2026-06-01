import { lessons } from '../lessons';

describe('Curriculum Data Integrity', () => {
  it('should have exactly 60 lessons (20 per level)', () => {
    const basic = lessons.filter(l => l.level === 'basic');
    const intermediate = lessons.filter(l => l.level === 'intermediate');
    const advanced = lessons.filter(l => l.level === 'advanced');
    
    expect(basic.length).toBe(20);
    expect(intermediate.length).toBe(20);
    expect(advanced.length).toBe(20);
  });

  it('should have unique lesson IDs', () => {
    const ids = lessons.map(l => l.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(lessons.length);
  });
});
