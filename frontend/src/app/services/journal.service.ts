import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Habit, JournalDataResponse, TrackHabitRequest } from '../models/habit';

@Injectable({
  providedIn: 'root'
})
export class JournalService {
  private apiUrl = '/api/journal';

  constructor(private http: HttpClient) {}

  getJournalData(year: number, month: number): Observable<JournalDataResponse> {
    return this.http.get<JournalDataResponse>(`${this.apiUrl}/data?year=${year}&month=${month}`);
  }

  trackHabit(data: TrackHabitRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/track`, data);
  }

  addHabit(habitData: { name: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/habit`, habitData);
  }

  getHabits(): Observable<Habit[]> {
    return this.http.get<Habit[]>(`${this.apiUrl}/habits`);
  }

  saveDailyEvents(events: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/events`, events);
  }

  saveMantra(mantra: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/mantra`, { mantra });
  }
}