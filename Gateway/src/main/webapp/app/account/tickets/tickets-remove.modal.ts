import { Component, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TicketService } from 'app/entities/tickets/ticket';
import { JhiEventManager } from 'ng-jhipster';

@Component({
    selector: 'jhi-tickets-remove-modal',
    templateUrl: './tickets-remove.modal.html'
})
export class TicketRemoveModalComponent implements AfterViewInit {
    id: number;
    message: string;

    constructor(public activeModal: NgbActiveModal, private ticketService: TicketService, private eventManager: JhiEventManager) {}

    ngAfterViewInit() {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.ticketService.delete(id).subscribe(
            response => {
                this.eventManager.broadcast({
                    name: 'myTicketsListModification',
                    content: 'Deleted an ticket'
                });
                this.activeModal.dismiss(true);
            },
            err => console.log(err)
        );
    }
}
