import { CommonModule, } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../../services/transaction';

@Component({
  selector: 'app-transaction-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.css',
})
export class TransactionForm implements  OnInit {

  transactionForm: FormGroup;

  incomeCategories: string[] = [
    'Salary',
    'Business', 
    'Investments',
    'Gifts',
    'Other'                
  ];

  expenseCategories: string[] = [
    'Rent',
    'Utilities',  
    'Groceries',
    'Transportation',
    'Entertainment',
    'Healthcare',
    'Other'  
  ];

  availableCategories: string[] = [];

  editMode: boolean = false;
  transactionId: number | null = null;

  constructor(
    private fb: FormBuilder, 
    private activatedRoute: ActivatedRoute,   
    private router: Router, 
    private transactionService: TransactionService) {
    this.transactionForm = this.fb.group({
      type: ['Expense', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const type = this.transactionForm.get('type')?.value;
    this.updateAvailableCategories(type);
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    if(idParam) {
      this.editMode = true;
      this.transactionId = +idParam; 
      this.loadTransactionData(this.transactionId);
    }
  } 

  loadTransactionData(id: number) {
    this.transactionService.getTransactionsDetails(id).subscribe({ next: (data) => {
      this.updateAvailableCategories(data.type);
      this.transactionForm.patchValue({
        type: data.type,
        amount: data.amount,
        category: data.category
      });
    },
    error: (err) => {
      console.error('Error loading transaction data', err);
    }});
  }

  onTypeChange() {
    const type = this.transactionForm.get('type')?.value;
    this.updateAvailableCategories(type);
  }

  updateAvailableCategories(type: string) {
   this.availableCategories = type === 'Expense' ? this.expenseCategories : this.incomeCategories;
   this.transactionForm.patchValue({ category: '' });
  }

  onCancel() {
    this.router.navigate(['/transactions']);
  }

  onSubmit() {
   if(this.transactionForm.valid) {
     const transactionData = this.transactionForm.value;
     if(this.editMode && this.transactionId !== null) {
        this.transactionService.updateTransactions(this.transactionId, transactionData).subscribe({ next: (data) => {
        this.router.navigate(['/transactions']);
    },
    error: (err) => {
      console.error('Error loading transaction data', err);
    }})
     } else { 
 this.transactionService.createTransactions(transactionData).subscribe(() => {
       this.router.navigate(['/transactions']);
     });
     }
   }
  }
}
