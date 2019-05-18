import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IBusStop } from 'app/shared/model/buses/bus-stop.model';
import { BusStopService } from './bus-stop.service';

@Component({
    selector: 'jhi-bus-stop-delete-dialog',
    templateUrl: './bus-stop-delete-dialog.component.html'
})
export class BusStopDeleteDialogComponent {
    busStop: IBusStop;

    constructor(protected busStopService: BusStopService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.busStopService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'busStopListModification',
                content: 'Deleted an busStop'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-bus-stop-delete-popup',
    template: ''
})
export class BusStopDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ busStop }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(BusStopDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.busStop = busStop;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/bus-stop', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/bus-stop', { outlets: { popup: null } }]);
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
