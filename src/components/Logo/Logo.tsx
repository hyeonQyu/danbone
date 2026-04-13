import { RESOURCES } from '@public';
import Image from 'next/image';

interface LogoProps {
  width?: number;
}

const ASPECT_RATIO = 373 / 461;

function Logo({ width = 100 }: LogoProps) {
  const height = Math.round(width * ASPECT_RATIO);
  return <Image src={RESOURCES.images.logo} alt="Logo" width={width} height={height} />;
}

export default Logo;
