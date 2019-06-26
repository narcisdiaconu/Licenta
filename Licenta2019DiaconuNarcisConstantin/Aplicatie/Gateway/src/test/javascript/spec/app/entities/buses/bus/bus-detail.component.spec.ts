/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GatewayTestModule } from '../../../../test.module';
import { BusDetailComponent } from 'app/entities/buses/bus/bus-detail.component';
import { Bus } from 'app/shared/model/buses/bus.model';

describe('Component Tests', () => {
    describe('Bus Management Detail Component', () => {
        let comp: BusDetailComponent;
        let fixture: ComponentFixture<BusDetailComponent>;
        const route = ({ data: of({ bus: new Bus(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [GatewayTestModule],
                declarations: [BusDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(BusDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(BusDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.bus).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
