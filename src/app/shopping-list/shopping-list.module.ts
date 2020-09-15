// Modules
import { NgModule } from '@angular/core';
import { ShoppingListRoutingModule } from './shopping-list-routing.module';

// Material Design
import {MatListModule} from '@angular/material/list';

// Compontents
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { ShoppingListComponent } from './shopping-list.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingEditComponent,
  ],
  imports: [
    SharedModule,
    ShoppingListRoutingModule,
    MatListModule
  ]
})

export class ShoppingListModule {

}
