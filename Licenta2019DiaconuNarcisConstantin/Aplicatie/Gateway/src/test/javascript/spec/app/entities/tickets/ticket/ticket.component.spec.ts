/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Data } from '@angular/router';

import { GatewayTestModule } from '../../../../test.module';
import { TicketComponent } from 'app/entities/tickets/ticket/ticket.component';
import { TicketService } from 'app/entities/tickets/ticket/ticket.service';
import { Ticket } from 'app/shared/model/tickets/ticket.model';

describe('Component Tests', () => {
    describe('Ticket Management Component', () => {
        let comp: TicketComponent;
        let fixture: ComponentFixture<TicketComponent>;
        let service: TicketService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [GatewayTestModule],
                declarations: [TicketComponent],
                providers: [
                    {
                        provide: ActivatedRoute,
                        useValue: {
                            data: {
                                subscribe: (fn: (value: Data) => void) =>
                                    fn({
                                        pagingParams: {
                                            predicate: 'id',
                                            reverse: false,
                                            page: 0
                                        }
                                    })
                            }
                        }
                    }
                ]
            })
                .overrideTemplate(TicketComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(TicketComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TicketService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Ticket(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.tickets[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });

        it('should calculate the sort attribute for an id', () => {
            // WHEN
            const result = comp.sort();

            // THEN
            expect(result).toEqual(['id,desc']);
        });

        it('should calculate the sort attribute for a non-id attribute', () => {
            // GIVEN
            comp.predicate = 'name';

            // WHEN
            const result = comp.sort();

            // THEN
            expect(result).toEqual(['name,desc', 'id']);
        });
    });
});
