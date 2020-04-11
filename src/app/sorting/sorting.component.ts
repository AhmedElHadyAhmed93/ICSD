import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-sorting',
    templateUrl: './sorting.component.html',
    styleUrls: ['./sorting.component.scss']
})
export class SortingComponent implements OnInit {

    collapedSideBar: boolean;

    constructor() {}

    ngOnInit() {}

    receiveCollapsed($event) {
        this.collapedSideBar = $event;
    }
}
