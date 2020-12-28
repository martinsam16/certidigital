import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CertidigitalComponent} from "./certidigital/certidigital.component";

const routes: Routes = [
  {path: 'certidigital', component: CertidigitalComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
