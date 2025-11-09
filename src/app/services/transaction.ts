import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {

  private apiUrl = 'https://localhost:7218';

  constructor(private http : HttpClient) { } 

  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/api/transactions/all`);
  }
  
  getTransactionsDetails(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/api/transactions/details/${id}`);
  }

  createTransactions(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/api/transactions/create`, transaction);
  }

  updateTransactions(id: number, transaction: Transaction): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.apiUrl}/api/transactions/update/${id}`, transaction);
  }

  deleteTransactions(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/transactions/delete/${id}`);
  }
}
