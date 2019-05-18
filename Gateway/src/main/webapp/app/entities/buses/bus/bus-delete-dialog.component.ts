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
    bus: IBus;

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

@Component({
    selector: 'jhi-bus-delete-popup',
    template: ''
})
export class BusDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ bus }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(BusDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.bus = bus;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/bus', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/bus', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
