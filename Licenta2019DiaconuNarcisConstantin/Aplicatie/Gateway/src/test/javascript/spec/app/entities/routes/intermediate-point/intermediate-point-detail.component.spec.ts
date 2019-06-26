/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GatewayTestModule } from '../../../../test.module';
import { IntermediatePointDetailComponent } from 'app/entities/routes/intermediate-point/intermediate-point-detail.component';
import { IntermediatePoint } from 'app/shared/model/routes/intermediate-point.model';

describe('Component Tests', () => {
    describe('IntermediatePoint Management Detail Component', () => {
        let comp: IntermediatePointDetailComponent;
        let fixture: ComponentFixture<IntermediatePointDetailComponent>;
        const route = ({ data: of({ intermediatePoint: new IntermediatePoint(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [GatewayTestModule],
                declarations: [IntermediatePointDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(IntermediatePointDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(IntermediatePointDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.intermediatePoint).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
