import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IIntermediatePoint } from 'app/shared/model/routes/intermediate-point.model';
import { IntermediatePointService } from './intermediate-point.service';

@Component({
    selector: 'jhi-intermediate-point-delete-dialog',
    templateUrl: './intermediate-point-delete-dialog.component.html'
})
export class IntermediatePointDeleteDialogComponent {
    intermediatePoint: IIntermediatePoint;

    constructor(
        protected intermediatePointService: IntermediatePointService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.intermediatePointService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'intermediatePointListModification',
                content: 'Deleted an intermediatePoint'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-intermediate-point-delete-popup',
    template: ''
})
export class IntermediatePointDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ intermediatePoint }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(IntermediatePointDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.intermediatePoint = intermediatePoint;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/intermediate-point', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/intermediate-point', { outlets: { popup: null } }]);
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
