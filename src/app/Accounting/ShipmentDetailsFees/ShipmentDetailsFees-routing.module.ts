import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShipmentDetailsFeesComponent } from './ShipmentDetailsFees.component';


const routes: Routes = [
    {
        path: '',
        component: ShipmentDetailsFeesComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ShipmentDetailsFeesRoutingModule {}
