import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Extraemos el token y la URL actual
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // 2. Definimos rutas públicas (donde NO debe redirigir si no hay token)
  //const isPublicRoute = pathname === '/login' || pathname === '/register' || pathname === '/';/ pobar cuando /resgistrar este listo
   const isPublicPath = pathname === '/' || pathname === '/login';

  // 3. LÓGICA DE PROTECCIÓN
  // Si el usuario intenta entrar a una ruta de dashboard sin token...
/*   if (!isPublicRoute && pathname.includes('/dashboard')) {
    if (!token) {
      // Redirigimos al login, pero guardamos la URL original en un query param
      // para que tras el login el usuario vuelva a donde estaba.
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);//GUARDA LA RUTA DONDE INTENTABA ENTARR SIN LOGUEARSE PARA QUE CUANDO SE LOGUEE ENTRE AHI 
      
      return NextResponse.redirect(loginUrl);
    }
  } */

    // 2. Si es una ruta de negocio (tiene un slug) y no hay token, mandamos al login
  // Excluimos archivos estáticos y la raíz
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 4. LÓGICA DE USUARIO LOGUEADO
  // Si ya tiene token e intenta ir al login, lo mandamos directo a su dashboard
  if (isPublicPath && token && pathname === '/login') {
     // Aquí podrías usar el slug guardado en otra cookie si quisieras 
     // redirigir a un dashboard específico, o simplemente a una ruta base.
     return NextResponse.next(); 
  }

  return NextResponse.next();
}

// 5. MATCHER: Es fundamental para el rendimiento en 2026
export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   */
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

