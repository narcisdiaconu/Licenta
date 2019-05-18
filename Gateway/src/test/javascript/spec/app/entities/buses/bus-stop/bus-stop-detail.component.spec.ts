/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GatewayTestModule } from '../../../../test.module';
import { BusStopDetailComponent } from 'app/entities/buses/bus-stop/bus-stop-detail.component';
import { BusStop } from 'app/shared/model/buses/bus-stop.model';

describe('Component Tests', () => {
    describe('BusStop Management Detail Component', () => {
        let comp: BusStopDetailComponent;
        let fixture: ComponentFixture<BusStopDetailComponent>;
        const route = ({ data: of({ busStop: new BusStop(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [GatewayTestModule],
                declarations: [BusStopDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(BusStopDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(BusStopDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.busStop).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
