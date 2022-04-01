import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardstoresPageRoutingModule } from './dashboardstores-routing.module';

import { DashboardstoresPage } from './dashboardstores.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardstoresPageRoutingModule
  ],
  declarations: [DashboardstoresPage]
})
export class DashboardstoresPageModule {}
