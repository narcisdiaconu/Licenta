/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { GatewayTestModule } from '../../../../test.module';
import { IntermediatePointDeleteDialogComponent } from 'app/entities/routes/intermediate-point/intermediate-point-delete-dialog.component';
import { IntermediatePointService } from 'app/entities/routes/intermediate-point/intermediate-point.service';

describe('Component Tests', () => {
    describe('IntermediatePoint Management Delete Component', () => {
        let comp: IntermediatePointDeleteDialogComponent;
        let fixture: ComponentFixture<IntermediatePointDeleteDialogComponent>;
        let service: IntermediatePointService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [GatewayTestModule],
                declarations: [IntermediatePointDeleteDialogComponent]
            })
                .overrideTemplate(IntermediatePointDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(IntermediatePointDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(IntermediatePointService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete(123);
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(123);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
