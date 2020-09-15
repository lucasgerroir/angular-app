import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  constructor(private route: ActivatedRoute, private recipeService: RecipeService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    })
  }

  get controls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onSubmit() {

    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    } else {
      this.recipeService.addRecipe(this.recipeForm.value);
    }

    this.onCancel();
  }

  onAddIngredient() {

    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    )


  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route});
  }

  private initForm() {

    const intialData = {
      name: '',
      imagePath: '',
      description: '',
      ingredients: new FormArray([])
    };

    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id);
      intialData.name = recipe.name;
      intialData.imagePath = recipe.imagePath;
      intialData.description = recipe.description;

      if (recipe.ingredients) {
        for (const ingredient of recipe.ingredients) {
          intialData.ingredients.push(
            new FormGroup({
              name: new FormControl(ingredient.name, Validators.required),
              amount: new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/)
              ])
            })
          );
        }
      }
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(intialData.name, Validators.required),
      imagePath: new FormControl(intialData.imagePath, Validators.required),
      description: new FormControl(intialData.description, Validators.required),
      ingredients: intialData.ingredients
    });

  }

  onDelete(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index)
  }

}
