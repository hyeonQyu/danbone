import { RESOURCES } from '@public';
import Image from 'next/image';

export default function ImageTestPage() {
  // public/index.ts에서 가져온 경로
  const logoPath = RESOURCES.images.logo;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Public 폴더 Import 테스트</h1>

      {/* 테스트 1: img 태그의 src로 사용 */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>1. img src로 사용</h2>
        <Image src={logoPath} alt="Logo" width={200} height={200} />
        <p>경로: {logoPath}</p>
      </section>

      {/* 테스트 2: background-image로 사용 */}
      <section>
        <h2>2. background-image로 사용</h2>
        <div
          style={{
            backgroundImage: `url(${logoPath})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            width: '300px',
            height: '200px',
            border: '2px solid #ccc',
          }}
        />
        <p>경로: {logoPath}</p>
      </section>

      {/* 원본 경로 정보 */}
      <section style={{ marginTop: '3rem', padding: '1rem', backgroundColor: '#f5f5f5' }}>
        <h3>디버그 정보</h3>
        <p>public/index.ts에서 가져온 원본 경로: {logoPath}</p>
        <p>변환된 경로: {logoPath}</p>
      </section>
    </div>
  );
}
