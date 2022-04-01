import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardstoresPage } from './dashboardstores.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardstoresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardstoresPageRoutingModule {}
