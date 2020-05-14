import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';


export class AuthInterceptorService implements HttpInterceptor{
    intercept(req:HttpRequest<any>,next){
        console.log("req on its way");
        const modifyHeader =ne()
        return next.handle(req);
    }
}