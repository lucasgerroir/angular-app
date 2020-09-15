import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscribable, Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isAuthenticated = false;
  private subscripton: Subscription;

  constructor(private dataStorageService: DataStorageService, private authService: AuthService) { }

  ngOnInit(): void {
    this.subscripton = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  ngOnDestroy() {
    this.subscripton.unsubscribe();
  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  fetchRecipes() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogout() {
    this.authService.logout();
  }

}
