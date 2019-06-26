import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IBus } from 'app/shared/model/buses/bus.model';
import { BusService } from './bus.service';

@Component({
    selector: 'jhi-bus-delete-dialog',
    templateUrl: './bus-delete-dialog.component.html'
})
export class BusDeleteDialogComponent {
    id: number;

    constructor(protected busService: BusService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.busService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'busListModification',
                content: 'Deleted an bus'
            });
            this.activeModal.dismiss(true);
        });
    }
}
