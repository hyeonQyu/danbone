'use client';

import createCache from '@emotion/cache';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { useServerInsertedHTML } from 'next/navigation';
import { ReactNode, useState } from 'react';

interface EmotionCacheProviderProps {
  children: ReactNode;
}

const createEmotionCache = () => {
  return createCache({ key: 'css', prepend: true });
};

const createCacheRegistry = (cache: EmotionCache) => {
  const state = { insertedNames: [] as string[] };
  const originalInsert = cache.insert;

  cache.insert = (...args) => {
    const serialized = args[1];
    if (cache.inserted[serialized.name] === undefined) {
      state.insertedNames = [...state.insertedNames, serialized.name];
    }
    return originalInsert(...args);
  };

  const flush = () => {
    const names = state.insertedNames;
    state.insertedNames = [];
    return names;
  };

  return { flush };
};

const buildStyleContent = (cache: EmotionCache, styleNames: string[]) => {
  return styleNames.map((name) => cache.inserted[name]).join('');
};

function EmotionCacheProvider({ children }: EmotionCacheProviderProps) {
  const [registry] = useState(() => {
    const cache = createEmotionCache();
    cache.compat = true;
    const cacheRegistry = createCacheRegistry(cache);

    return { cache, flush: cacheRegistry.flush };
  });

  useServerInsertedHTML(() => {
    const styleNames = registry.flush();

    if (styleNames.length === 0) {
      return null;
    }

    const styleContent = buildStyleContent(registry.cache, styleNames);

    return (
      <style
        key={registry.cache.key}
        data-emotion={`${registry.cache.key} ${styleNames.join(' ')}`}
        dangerouslySetInnerHTML={{ __html: styleContent }}
      />
    );
  });

  return <CacheProvider value={registry.cache}>{children}</CacheProvider>;
}

export default EmotionCacheProvider;
