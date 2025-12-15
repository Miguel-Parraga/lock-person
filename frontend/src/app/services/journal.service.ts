import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Habito, DatosDiarioResponse, SeguimientoHabitoRequest, CrearHabitoRequest } from '../models/habito';

@Injectable({
  providedIn: 'root'
})
export class JournalService {
  private apiUrl = '/api/journal';

  constructor(private http: HttpClient) {}

  getJournalData(year: number, month: number): Observable<DatosDiarioResponse> {
    return this.http.get<DatosDiarioResponse>(`${this.apiUrl}/data?year=${year}&month=${month}`);
  }

  trackHabit(data: SeguimientoHabitoRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/track`, data);
  }

  addHabit(habito: CrearHabitoRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/habits`, habito);
  }

  getHabits(): Observable<Habito[]> {
    return this.http.get<Habito[]>(`${this.apiUrl}/habits`);
  }

  saveDailyEvents(events: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/events`, events);
  }

  saveMantra(mantra: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/mantra`, { mantra });
  }
}