import { RESOURCES } from '@public';
import Image from 'next/image';

interface LogoProps {
  width?: number;
}

function Logo({ width = 100 }: LogoProps) {
  const aspectRatio = 274 / 460;
  const height = Math.round(width * aspectRatio);
  return <Image src={RESOURCES.images.logo} alt="Logo" width={width} height={height} />;
}

export default Logo;
