import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CallApiService } from 'src/app/services/call-api.service';

@Component({
  selector: 'app-need-to-approve',
  templateUrl: './need-to-approve.component.html',
  styleUrls: ['./need-to-approve.component.scss'],
})
export class NeedToApproveComponent implements OnInit {
  public loader = true;

  constructor(
    private _service: CallApiService,
    private _activatedRouter: ActivatedRoute
  ) {}

  ngOnInit() {
    this.checkAccountStatus();
  }

  checkAccountStatus() {
    this.loader = true;
    this._service
      .callGetMethod(
        '/api/auth/checkIsNeedToActive',
        this._activatedRouter.snapshot.params.email
      )
      .subscribe((data) => {
        this.loader = false;
      });
  }
}
