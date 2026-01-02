import { AppRoutesPathname } from '@/routes';
import { appRoutes } from '@/routes/routes.config';
import { MinimalUser } from '@/routes/routes.types';
import { getSafely } from '@hyeonqyu/typed-router-next';
import { jwtDecode } from 'jwt-decode';
import { NextRequest, NextResponse } from 'next/server';

type FirebaseTokenPayload = {
  user_id: string;
  email?: string;
};

type RouteWithMetadata = {
  _metadata: {
    accessible?: (context: { user: MinimalUser | null }) => boolean;
    [key: string]: unknown;
  };
};

const hasMetadata = (route: unknown): route is RouteWithMetadata => {
  return Boolean(route && typeof route === 'object' && '_metadata' in route);
};

const hasAccessibleFunction = (
  metadata: RouteWithMetadata['_metadata'],
): metadata is RouteWithMetadata['_metadata'] & {
  accessible: (context: { user: MinimalUser | null }) => boolean;
} => {
  return Boolean(metadata && 'accessible' in metadata && typeof metadata.accessible === 'function');
};

const getUserFromToken = (idToken: string | undefined): MinimalUser | null => {
  if (!idToken) return null;

  try {
    const decoded = jwtDecode<FirebaseTokenPayload>(idToken);
    return {
      uid: decoded.user_id,
      email: decoded.email,
    };
  } catch (error) {
    console.error('JWT decode failed:', error);
    return null;
  }
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/') {
    const idToken = request.cookies.get('idToken')?.value;
    const redirectUrl = idToken ? '/explore' : '/login';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  const currentRoute = getSafely('/', appRoutes, pathname as AppRoutesPathname);

  if (!hasMetadata(currentRoute)) {
    return NextResponse.next();
  }

  const metadata = currentRoute._metadata;

  if (!hasAccessibleFunction(metadata)) {
    return NextResponse.next();
  }

  const idToken = request.cookies.get('idToken')?.value;
  const user = getUserFromToken(idToken);

  const context = { user };
  const isAccessible = metadata.accessible(context);

  if (!isAccessible) {
    if (user) {
      return NextResponse.redirect(new URL('/', request.url));
    } else {
      const authUrl = new URL('/authentication', request.url);
      authUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(authUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|playground).*)'],
};
