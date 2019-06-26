/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { GatewayTestModule } from '../../../../test.module';
import { BusStopUpdateComponent } from 'app/entities/buses/bus-stop/bus-stop-update.component';
import { BusStopService } from 'app/entities/buses/bus-stop/bus-stop.service';
import { BusStop } from 'app/shared/model/buses/bus-stop.model';

describe('Component Tests', () => {
    describe('BusStop Management Update Component', () => {
        let comp: BusStopUpdateComponent;
        let fixture: ComponentFixture<BusStopUpdateComponent>;
        let service: BusStopService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [GatewayTestModule],
                declarations: [BusStopUpdateComponent]
            })
                .overrideTemplate(BusStopUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(BusStopUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(BusStopService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new BusStop(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.busStop = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new BusStop();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.busStop = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.create).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));
        });
    });
});
