import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  template: '<div class="lds-ripple-wrapper"><div class="lds-ripple"><div></div><div></div></div></div>',
  styleUrls: ['./loading.component.css']
})
export class LoaderComponent {}
