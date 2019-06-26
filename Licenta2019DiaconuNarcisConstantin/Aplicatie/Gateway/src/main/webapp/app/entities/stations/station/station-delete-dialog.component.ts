import { Component } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { StationService } from './station.service';

@Component({
    selector: 'jhi-station-delete-dialog',
    templateUrl: './station-delete-dialog.component.html'
})
export class StationDeleteDialogComponent {
    id: number;

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
