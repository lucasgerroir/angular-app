import { Component, OnInit, OnDestroy, ViewChild  } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: false}) slForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItem: number;
  item: Ingredient;

  constructor(private slService: ShoppingListService) { }

  onAdd(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount );
    if (this.editMode) {
      this.slService.updateIngredient(this.editedItem, newIngredient);
    } else {
      this.slService.addIngredient(newIngredient)
    }
    this.editMode = false;
    form.reset();
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
  }

  onDelete() {

    this.slService.deleteIngredient(this.editedItem);
    this.onClear();
  }

  ngOnInit(): void {
    this.subscription = this.slService.startedEditing.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editedItem = index;
        this.item = this.slService.getIngredient(index);
        this.slForm.setValue({
          name: this.item.name,
          amount: this.item.amount
        });
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
