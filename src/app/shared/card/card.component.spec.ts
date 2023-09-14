import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CardComponent } from './card.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;
  let el: DebugElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CardComponent],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        el = fixture.debugElement;
      });
  }));

  it('should create the host component', () => {
    console.log(component);
    expect(component).toBeTruthy();
  });

  it('should have an image element', () => {
    const cards = el.queryAll(By.css('.animal-image'));
    expect(cards.length).toBe(1);
  });
});
