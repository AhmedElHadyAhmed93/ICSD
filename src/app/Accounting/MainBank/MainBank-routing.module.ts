import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainBankComponent } from './MainBank.component';


const routes: Routes = [
    {
        path: '',
        component: MainBankComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MainBankRoutingModule {}
