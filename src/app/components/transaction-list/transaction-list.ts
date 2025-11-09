import { Component, OnInit } from '@angular/core';
import { Transaction } from '../../models/transaction';
import { TransactionService } from '../../services/transaction';
import { CommonModule } from '@angular/common';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-transaction-list',
  imports: [CommonModule],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.css',
})
export class TransactionList implements OnInit {
  transactions: Transaction[] = [];

  constructor(private transactionService: TransactionService, private router: Router) {}

  ngOnInit(): void {
    this.transactionService.getAllTransactions().subscribe((data) => {
      this.transactions = data;
    });
  }

  getTotalIncome(): number {
    return this.transactions
      .filter((t) => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getTotalExpense(): number {
    return this.transactions
      .filter((t) => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getTotalNetBalance(): number {
    return this.getTotalIncome() - this.getTotalExpense();
  }

  editTransaction(transactions: Transaction) {
    if(transactions.id) {
      this.router.navigate(['/edit', transactions.id]);
    }
  }

  deleteTransaction(transactions: Transaction) {
    if(transactions.id) {
    this.transactionService.deleteTransactions(transactions.id).subscribe(() => {
      this.transactions = this.transactions.filter(t => t.id !== transactions.id);
    });
  }
  }
}
