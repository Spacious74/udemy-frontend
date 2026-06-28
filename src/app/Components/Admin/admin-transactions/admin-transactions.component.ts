import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../Services/admin.service';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-admin-transactions',
  standalone: true,
  imports: [CommonModule, TableModule, DialogModule, ButtonModule],
  templateUrl: './admin-transactions.component.html',
  styleUrl: './admin-transactions.component.css'
})
export class AdminTransactionsComponent implements OnInit {
  transactions: any[] = [];
  totalRecords: number = 0;
  loading: boolean = true;
  displayDialog: boolean = false;
  selectedTxn: any = null;

  page: number = 1;
  limit: number = 10;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(event?: any) {
    this.loading = true;
    
    if (event) {
      this.page = (event.first / event.rows) + 1;
      this.limit = event.rows;
    }

    this.adminService.getTransactions(this.page, this.limit).subscribe(
      (res: any) => {
        if (res.success) {
          this.transactions = res.data;
          this.totalRecords = res.total;
        }
        this.loading = false;
      },
      (error) => {
        console.error("Error fetching transactions", error);
        this.loading = false;
      }
    );
  }

  viewDetails(txn: any) {
    this.selectedTxn = txn;
    this.displayDialog = true;
  }
}
