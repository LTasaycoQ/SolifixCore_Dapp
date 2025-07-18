import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TraductorService {
 private traduccionesSubject = new BehaviorSubject<any>({});
  traducciones$ = this.traduccionesSubject.asObservable();
  private idioma: string;

  constructor(private http: HttpClient) {
    this.idioma = 'es';
  }

  async cambiarIdioma(idioma: string) {
    this.idioma = idioma;
    await this.cargarTraducciones(idioma);
  }

  private async cargarTraducciones(idioma: string) {
    try {
      const traducciones = await this.http.get(`/assets/i18n/${idioma}.json`).toPromise();
      this.traduccionesSubject.next(traducciones);
    } catch (error) {
      console.error('Error al cargar las traducciones:', error);
    }
  }

  get traducciones() {
    return this.traduccionesSubject.value;
  }
}
