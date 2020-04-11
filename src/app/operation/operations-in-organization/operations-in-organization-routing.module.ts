import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OperationsInOrganizationComponent } from './operations-in-organization.component';


const routes: Routes = [
    {
        path: '',
        component: OperationsInOrganizationComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OperationsInOrganizationRoutingModule {}
