import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IUserdetails } from 'app/shared/model/users/userdetails.model';
import { UserdetailsService } from './userdetails.service';

@Component({
    selector: 'jhi-userdetails-delete-dialog',
    templateUrl: './userdetails-delete-dialog.component.html'
})
export class UserdetailsDeleteDialogComponent {
    userdetails: IUserdetails;

    constructor(
        protected userdetailsService: UserdetailsService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.userdetailsService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'userdetailsListModification',
                content: 'Deleted an userdetails'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-userdetails-delete-popup',
    template: ''
})
export class UserdetailsDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ userdetails }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(UserdetailsDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.userdetails = userdetails;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/userdetails', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/userdetails', { outlets: { popup: null } }]);
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
