/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { GatewayTestModule } from '../../../../test.module';
import { UserdetailsDeleteDialogComponent } from 'app/entities/users/userdetails/userdetails-delete-dialog.component';
import { UserdetailsService } from 'app/entities/users/userdetails/userdetails.service';

describe('Component Tests', () => {
    describe('Userdetails Management Delete Component', () => {
        let comp: UserdetailsDeleteDialogComponent;
        let fixture: ComponentFixture<UserdetailsDeleteDialogComponent>;
        let service: UserdetailsService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [GatewayTestModule],
                declarations: [UserdetailsDeleteDialogComponent]
            })
                .overrideTemplate(UserdetailsDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(UserdetailsDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(UserdetailsService);
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
