/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GatewayTestModule } from '../../../../test.module';
import { StationDetailComponent } from 'app/entities/stations/station/station-detail.component';
import { Station } from 'app/shared/model/stations/station.model';

describe('Component Tests', () => {
    describe('Station Management Detail Component', () => {
        let comp: StationDetailComponent;
        let fixture: ComponentFixture<StationDetailComponent>;
        const route = ({ data: of({ station: new Station(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [GatewayTestModule],
                declarations: [StationDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(StationDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(StationDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.station).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
