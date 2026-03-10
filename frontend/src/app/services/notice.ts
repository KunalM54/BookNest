import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NoticeService {
  private apiUrl = 'http://localhost:8080/api/notices';

  constructor(private http: HttpClient) {}

  // Get all notices
  getAllNotices(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Get notice by ID
  getNoticeById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Create new notice
  createNotice(notice: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, notice);
  }

  // Update notice
  updateNotice(id: number, notice: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, notice);
  }

  // Delete notice
  deleteNotice(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Get important notices only
  getImportantNotices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/important`);
  }
}

