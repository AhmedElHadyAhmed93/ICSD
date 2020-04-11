import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddInfoToShipmentComponent } from './add-info-to-shipment.component';


const routes: Routes = [
    {
        path: '',
        component: AddInfoToShipmentComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AddInfoToShipmentRoutingModule {}
