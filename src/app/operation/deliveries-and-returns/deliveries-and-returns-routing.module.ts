import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeliveriesAndReturnsComponent } from './deliveries-and-returns.component';


const routes: Routes = [
    {
        path: '',
        component: DeliveriesAndReturnsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DeliveriesAndReturnsRoutingModule {}
