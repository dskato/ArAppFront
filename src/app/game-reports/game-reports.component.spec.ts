import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameReportsComponent } from './game-reports.component';

describe('GameReportsComponent', () => {
  let component: GameReportsComponent;
  let fixture: ComponentFixture<GameReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
