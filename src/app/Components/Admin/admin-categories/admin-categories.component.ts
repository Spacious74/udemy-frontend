import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../Services/admin.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ToastMessageService } from '../../../baseSettings/services/toastMessage.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, DialogModule, InputTextModule, DropdownModule, FormsModule, ConfirmDialogModule, ToastModule],
  providers: [ConfirmationService, ToastMessageService],
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.css'
})
export class AdminCategoriesComponent implements OnInit {
  categories: any[] = [];
  loading: boolean = true;
  displayDialog: boolean = false;
  isEditMode: boolean = false;
  
  categoryForm: any = {
    name: '',
    description: '',
    parentId: null
  };
  parentOptions: any[] = [];

  constructor(
    private adminService: AdminService,
    private confirmationService: ConfirmationService,
    private toastMsgService: ToastMessageService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.adminService.getCategories().subscribe(
      (res: any) => {
        if (res.success) {
          this.categories = res.data;
          this.parentOptions = [
            { label: 'None (Root Category)', value: null },
            ...this.categories
                .filter(c => !c.parentId)
                .map(c => ({ label: c.name, value: c._id }))
          ];
        }
        this.loading = false;
      },
      (error) => {
        console.error("Error fetching categories", error);
        this.loading = false;
      }
    );
  }

  openNew() {
    this.isEditMode = false;
    this.categoryForm = { name: '', description: '', parentId: null };
    this.displayDialog = true;
  }

  editCategory(cat: any) {
    this.isEditMode = true;
    this.categoryForm = {
      _id: cat._id,
      name: cat.name,
      description: cat.description,
      parentId: cat.parentId?._id || null
    };
    this.displayDialog = true;
  }

  saveCategory() {
    if (!this.categoryForm.name) {
      this.toastMsgService.showError("Error", "Category name is required");
      return;
    }

    const apiCall = this.isEditMode 
      ? this.adminService.editCategory(this.categoryForm._id, this.categoryForm)
      : this.adminService.addCategory(this.categoryForm);

    apiCall.subscribe(
      (res: any) => {
        if (res.success) {
          this.toastMsgService.showSuccess("Success", res.message);
          this.displayDialog = false;
          this.loadCategories();
        }
      },
      (error) => {
        this.toastMsgService.showError("Error", error.error?.message || "Failed to save category");
      }
    );
  }

  deleteCategory(cat: any) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the category "${cat.name}"?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.adminService.deleteCategory(cat._id).subscribe(
          (res: any) => {
            if (res.success) {
              this.toastMsgService.showSuccess("Success", "Category deleted successfully");
              this.loadCategories();
            }
          },
          (error) => {
            this.toastMsgService.showError("Error", error.error?.message || "Failed to delete category");
          }
        );
      }
    });
  }
}
