import { HttpInterceptorFn } from '@angular/common/http';
import { tmdb } from '@environments/environment';

export const tmdbAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const isRelative = req.url.startsWith('/');
  const url = isRelative ? `${tmdb.baseUrl}${req.url}` : req.url;

  const authReq = req.clone({
    url,
    setHeaders: {
      Authorization: `Bearer ${tmdb.readToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=utf-8'
    }
  });

  return next(authReq);
};
