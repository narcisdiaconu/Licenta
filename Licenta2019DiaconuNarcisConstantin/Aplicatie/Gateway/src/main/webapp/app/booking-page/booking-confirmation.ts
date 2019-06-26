import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'jhi-booking-confirm-modal',
    templateUrl: './booking-confirmation.html'
})
export class BookingConfirmationModalComponent implements AfterViewInit {
    constructor(private router: Router, public activeModal: NgbActiveModal) {}

    ngAfterViewInit() {}

    home() {
        this.activeModal.dismiss('closed');
        this.router.navigate(['']);
    }

    tickets() {
        this.activeModal.dismiss('closed');
        this.router.navigate(['my-tickets']);
    }
}
