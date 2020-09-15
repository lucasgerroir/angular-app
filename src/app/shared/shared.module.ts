import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from './alert/alert.component';
import { DropdownDirective } from './dropdown.directive';
import { LoaderComponent } from './loading/loading.component';
import { PlaceholderDirective } from './placeholder/placeholder.directive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AlertComponent,
    LoaderComponent,
    PlaceholderDirective,
    DropdownDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule
  ],
  exports: [
    AlertComponent,
    LoaderComponent,
    PlaceholderDirective,
    DropdownDirective,
    CommonModule,
    FormsModule,
    NgbModule
  ]
})
export class SharedModule {}
