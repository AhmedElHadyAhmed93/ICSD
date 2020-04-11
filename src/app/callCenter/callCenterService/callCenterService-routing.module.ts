import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CallCenterComponent } from './callCenterService.component';


const routes: Routes = [
    {
        path: '',
        component: CallCenterComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CallCenterRoutingModule {}
