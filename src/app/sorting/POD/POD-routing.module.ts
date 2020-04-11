import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PODComponent } from './POD.component';


const routes: Routes = [
    {
        path: '',
        component: PODComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PODRoutingModule {}
