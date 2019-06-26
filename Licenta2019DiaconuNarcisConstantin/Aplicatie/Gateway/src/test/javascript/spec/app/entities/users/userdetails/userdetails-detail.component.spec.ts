/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GatewayTestModule } from '../../../../test.module';
import { UserdetailsDetailComponent } from 'app/entities/users/userdetails/userdetails-detail.component';
import { Userdetails } from 'app/shared/model/users/userdetails.model';

describe('Component Tests', () => {
    describe('Userdetails Management Detail Component', () => {
        let comp: UserdetailsDetailComponent;
        let fixture: ComponentFixture<UserdetailsDetailComponent>;
        const route = ({ data: of({ userdetails: new Userdetails(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [GatewayTestModule],
                declarations: [UserdetailsDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(UserdetailsDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(UserdetailsDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.userdetails).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
