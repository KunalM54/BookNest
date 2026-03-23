import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notice, NoticeMutationResponse, NoticePayload } from '../models/notice.model';

@Injectable({
  providedIn: 'root',
})
export class NoticeService {
  private apiUrl = 'http://localhost:8080/api/notices';

  constructor(private http: HttpClient) {}

  // Get all notices
  getAllNotices(): Observable<Notice[]> {
    return this.http.get<Notice[]>(this.apiUrl);
  }

  // Get notice by ID
  getNoticeById(id: number): Observable<Notice> {
    return this.http.get<Notice>(`${this.apiUrl}/${id}`);
  }

  // Create new notice
  createNotice(notice: NoticePayload): Observable<NoticeMutationResponse> {
    return this.http.post<NoticeMutationResponse>(this.apiUrl, notice);
  }

  // Update notice
  updateNotice(id: number, notice: NoticePayload): Observable<NoticeMutationResponse> {
    return this.http.put<NoticeMutationResponse>(`${this.apiUrl}/${id}`, notice);
  }

  // Delete notice
  deleteNotice(id: number): Observable<{ success?: boolean; message?: string }> {
    return this.http.delete<{ success?: boolean; message?: string }>(`${this.apiUrl}/${id}`);
  }

  // Get important notices only
  getImportantNotices(): Observable<Notice[]> {
    return this.http.get<Notice[]>(`${this.apiUrl}/important`);
  }
}

