import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { DashboardComponent } from "./dashboard.component";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { HttpClientTestingModule } from "@angular/common/http/testing";

const TEST_URLS = ["test1", "test2"];

describe("DashboardComponent", () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let el: DebugElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, DashboardComponent],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DashboardComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        fixture.detectChanges();
      });
  }));

  it("Have a card for every URL", () => {
    const cardCount = el.queryAll(By.css(".grid")).length;

    component.imgUrls$ = of(TEST_URLS);

    fixture.detectChanges();

    expect(cardCount === TEST_URLS.length);
  });
});
