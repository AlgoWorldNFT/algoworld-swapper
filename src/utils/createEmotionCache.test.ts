import createEmotionCache from '@/utils/createEmotionCache';

describe(`createEmotionCache()`, () => {
  it(`runs createEmotionCache correctly`, () => {
    const response = createEmotionCache();
    expect(response).toBeDefined();
  });
});
