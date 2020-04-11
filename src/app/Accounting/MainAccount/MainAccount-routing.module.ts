import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainAccountComponent } from './MainAccount.component';


const routes: Routes = [
    {
        path: '',
        component: MainAccountComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MainAccountRoutingModule {}
