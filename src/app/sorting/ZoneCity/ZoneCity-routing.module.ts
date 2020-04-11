import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ZoneCityComponent } from './ZoneCity.component';


const routes: Routes = [
    {
        path: '',
        component: ZoneCityComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ZoneCityRoutingModule {}
