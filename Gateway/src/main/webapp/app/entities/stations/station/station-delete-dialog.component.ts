import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IStation } from 'app/shared/model/stations/station.model';
import { StationService } from './station.service';

@Component({
    selector: 'jhi-station-delete-dialog',
    templateUrl: './station-delete-dialog.component.html'
})
export class StationDeleteDialogComponent {
    station: IStation;

    constructor(protected stationService: StationService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.stationService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'stationListModification',
                content: 'Deleted an station'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-station-delete-popup',
    template: ''
})
export class StationDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ station }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(StationDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.station = station;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/station', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/station', { outlets: { popup: null } }]);
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
