import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Evento } from 'src/models/Evento';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '@environments/environment';

@Injectable()
//{providedIn: 'root'} //Permite esta classe ser injetada por qualquer um
export class EventoService {
  baseURL =  environment.apiURL + 'api/Eventos';

  constructor(private http: HttpClient) {}

  public getEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.baseURL);
  }

  public getEventosByTema(tema: string): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseURL}/${tema}/tema`).pipe(take(1));
  }

  public getEventoById(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.baseURL}/${id}`).pipe(take(1));
  }

  public post(evento: Evento): Observable<Evento>{
    return this.http.post<Evento>(this.baseURL, evento).pipe(take(1));
  }

  public put(evento: Evento) : Observable<Evento>{
    return this.http.put<Evento>(`${this.baseURL}/${evento.id}`, evento).pipe(take(1));
  }

  public deleteEvento(id: number): Observable<string>{
    return this.http.delete<string>(`${this.baseURL}/${id}`).pipe(take(1));
  }

  public postUpload(eventoId: number, file: File ): Observable<Evento>{
    const filToUpload = file[0] as File;
    const formData = new FormData();

    formData.append('file',filToUpload);
    return this.http.post<Evento>(`${this.baseURL}/upload-image/${eventoId}`, formData).pipe(take(1));
  }
}

