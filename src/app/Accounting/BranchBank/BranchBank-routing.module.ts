import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BranchBankComponent } from './BranchBank.component';


const routes: Routes = [
    {
        path: '',
        component: BranchBankComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BranchBankRoutingModule {}
