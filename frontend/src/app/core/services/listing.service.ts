import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CreateListingPayload,
  Listing,
  PageResponse,
  UpdateListingPayload,
} from '../models/listing.model';

@Injectable({ providedIn: 'root' })
export class ListingService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/api/v1/listings`;

  search(
    page: number,
    size: number,
    categoryId?: number | null,
    q?: string | null,
  ): Observable<PageResponse<Listing>> {
    let params = new HttpParams().set('page', String(page)).set('size', String(size));
    if (categoryId != null) {
      params = params.set('categoryId', String(categoryId));
    }
    if (q?.trim()) {
      params = params.set('q', q.trim());
    }
    return this.http.get<PageResponse<Listing>>(this.base, { params });
  }

  getById(id: number): Observable<Listing> {
    return this.http.get<Listing>(`${this.base}/${id}`);
  }

  create(body: CreateListingPayload): Observable<Listing> {
    return this.http.post<Listing>(this.base, body);
  }

  update(id: number, body: UpdateListingPayload): Observable<Listing> {
    return this.http.put<Listing>(`${this.base}/${id}`, body);
  }

  archive(id: number, sellerId: number): Observable<void> {
    const params = new HttpParams().set('sellerId', String(sellerId));
    return this.http.delete<void>(`${this.base}/${id}`, { params });
  }
}
