import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JournalEntryComponent } from './JournalEntry.component';


const routes: Routes = [
    {
        path: '',
        component: JournalEntryComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class JournalEntryRoutingModule {}
