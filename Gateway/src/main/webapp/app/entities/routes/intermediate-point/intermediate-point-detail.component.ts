import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IIntermediatePoint } from 'app/shared/model/routes/intermediate-point.model';

@Component({
    selector: 'jhi-intermediate-point-detail',
    templateUrl: './intermediate-point-detail.component.html'
})
export class IntermediatePointDetailComponent implements OnInit {
    intermediatePoint: IIntermediatePoint;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ intermediatePoint }) => {
            this.intermediatePoint = intermediatePoint;
        });
    }

    previousState() {
        window.history.back();
    }
}
