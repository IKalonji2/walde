import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('walde_token');
  if(token){
    const interceptedRequestWithHeader = req.clone(
      {
        headers: req.headers.append('Authorization', `Bearer ${token}`)
      }
    );
    console.log(interceptedRequestWithHeader);
    
    return next(interceptedRequestWithHeader);
  }
  return next(req);
};
