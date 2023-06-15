import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoverPasswordEmailComponent } from './recover-password-email.component';

describe('RecoverPasswordEmailComponent', () => {
  let component: RecoverPasswordEmailComponent;
  let fixture: ComponentFixture<RecoverPasswordEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecoverPasswordEmailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecoverPasswordEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
