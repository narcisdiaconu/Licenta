import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IRoute } from 'app/shared/model/routes/route.model';
import { RouteService } from './route.service';

@Component({
    selector: 'jhi-route-delete-dialog',
    templateUrl: './route-delete-dialog.component.html'
})
export class RouteDeleteDialogComponent {
    id: number;

    constructor(protected routeService: RouteService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.routeService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'routeListModification',
                content: 'Deleted an route'
            });
            this.activeModal.dismiss(true);
        });
    }
}
