/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { GatewayTestModule } from '../../../../test.module';
import { IntermediatePointUpdateComponent } from 'app/entities/routes/intermediate-point/intermediate-point-update.component';
import { IntermediatePointService } from 'app/entities/routes/intermediate-point/intermediate-point.service';
import { IntermediatePoint } from 'app/shared/model/routes/intermediate-point.model';

describe('Component Tests', () => {
    describe('IntermediatePoint Management Update Component', () => {
        let comp: IntermediatePointUpdateComponent;
        let fixture: ComponentFixture<IntermediatePointUpdateComponent>;
        let service: IntermediatePointService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [GatewayTestModule],
                declarations: [IntermediatePointUpdateComponent]
            })
                .overrideTemplate(IntermediatePointUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(IntermediatePointUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(IntermediatePointService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new IntermediatePoint(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.intermediatePoint = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new IntermediatePoint();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.intermediatePoint = entity;
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
