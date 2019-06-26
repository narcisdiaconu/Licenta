/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GatewayTestModule } from '../../../../test.module';
import { RouteDetailComponent } from 'app/entities/routes/route/route-detail.component';
import { Route } from 'app/shared/model/routes/route.model';

describe('Component Tests', () => {
    describe('Route Management Detail Component', () => {
        let comp: RouteDetailComponent;
        let fixture: ComponentFixture<RouteDetailComponent>;
        const route = ({ data: of({ route: new Route(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [GatewayTestModule],
                declarations: [RouteDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(RouteDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(RouteDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.route).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
