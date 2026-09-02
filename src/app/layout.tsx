import { TokenRefresher } from '@/auth';
import { IndexedDBProvider } from '@/indexed-db';
import { LanguageProvider } from '@/language';
import { ReactQueryClientProvider } from '@/react-query';
import { AppRoutesProvider, MetadataTitle } from '@/routes';
import { EmotionCacheProvider, ThemeProvider } from '@/styles';
import { ReactNode } from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <AppRoutesProvider>
          <LanguageProvider>
            <MetadataTitle />
            <EmotionCacheProvider>
              <ThemeProvider>
                <ReactQueryClientProvider>
                  <IndexedDBProvider>
                    <TokenRefresher>{children}</TokenRefresher>
                  </IndexedDBProvider>
                </ReactQueryClientProvider>
              </ThemeProvider>
            </EmotionCacheProvider>
          </LanguageProvider>
        </AppRoutesProvider>
      </body>
    </html>
  );
}
