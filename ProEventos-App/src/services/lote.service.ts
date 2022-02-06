import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Lote } from 'src/models/Lote';

@Injectable()
export class LoteService {
  baseUrl = 'https://localhost:5001/api/Lotes';

constructor(private http: HttpClient) { }

  public getLotesByEventoId(idEvento: number): Observable<Lote[]>{
    return this.http.get<Lote[]>(`${this.baseUrl}/${idEvento}`);
  }

  public saveLote(idEvento: number, lotes: Lote[]): Observable<Lote[]>{
    return this.http.put<Lote[]>(`${this.baseUrl}/${idEvento}`, lotes).pipe(take(1));
  }

  public deleteLote(eventoId: number, id: number): Observable<any>{
    return this.http.delete<any>(`${this.baseUrl}/${eventoId}/${id}`).pipe(take(1));
  }

}
