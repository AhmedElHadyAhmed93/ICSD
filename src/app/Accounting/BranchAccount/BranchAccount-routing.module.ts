import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BranchAccountComponent } from './BranchAccount.component';


const routes: Routes = [
    {
        path: '',
        component: BranchAccountComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BranchAccountRoutingModule {}
