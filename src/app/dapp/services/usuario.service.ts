import { Injectable } from '@angular/core';
import { Contactos, User } from '../interfaces/wallet.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }


  
  create(user: User): Observable<User> {
    return this.http.post<User>('https://soft-jobie-luistasaycoquispe-80f33bd8.koyeb.app/api/users/registrar', user);
  }

  createContac(contacto: Contactos): Observable<Contactos> {
    return this.http.post<Contactos>('https://soft-jobie-luistasaycoquispe-80f33bd8.koyeb.app/api/contactos', contacto);
  }

  public getAllContactos(codigo: string): Observable<Contactos[]> {

    return this.http.get<Contactos[]>(`https://soft-jobie-luistasaycoquispe-80f33bd8.koyeb.app/api/contactos/codigo/${codigo}`);
  }

  getUsuario(codigo: string): Observable<User> {
    return this.http.get<User>(`https://soft-jobie-luistasaycoquispe-80f33bd8.koyeb.app/api/users/codigo/${codigo}`);
  }


  login(correo: any, contrasena: any): Observable<User> {
    return this.http.get<User>(`https://soft-jobie-luistasaycoquispe-80f33bd8.koyeb.app/api/users/login?correo=${correo}&&contrasena=${contrasena}`);
  }

}
