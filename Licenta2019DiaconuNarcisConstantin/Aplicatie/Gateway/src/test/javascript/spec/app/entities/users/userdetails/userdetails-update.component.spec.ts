/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { GatewayTestModule } from '../../../../test.module';
import { UserdetailsUpdateComponent } from 'app/entities/users/userdetails/userdetails-update.component';
import { UserdetailsService } from 'app/entities/users/userdetails/userdetails.service';
import { Userdetails } from 'app/shared/model/users/userdetails.model';

describe('Component Tests', () => {
    describe('Userdetails Management Update Component', () => {
        let comp: UserdetailsUpdateComponent;
        let fixture: ComponentFixture<UserdetailsUpdateComponent>;
        let service: UserdetailsService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [GatewayTestModule],
                declarations: [UserdetailsUpdateComponent]
            })
                .overrideTemplate(UserdetailsUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(UserdetailsUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(UserdetailsService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new Userdetails(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.userdetails = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new Userdetails();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.userdetails = entity;
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
