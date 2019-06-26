import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICity } from 'app/shared/model/stations/city.model';
import { CityService } from './city.service';

@Component({
    selector: 'jhi-city-delete-dialog',
    templateUrl: './city-delete-dialog.component.html'
})
export class CityDeleteDialogComponent {
    id: number;

    constructor(protected cityService: CityService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('closed');
    }

    confirmDelete(id: number) {
        this.cityService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'cityListModification',
                content: 'Deleted an city'
            });
            this.activeModal.dismiss('closed');
        });
    }
}
