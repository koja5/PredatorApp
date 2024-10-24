import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CallApiService } from 'src/app/services/call-api.service';

@Component({
  selector: 'app-not-active',
  templateUrl: './not-active.component.html',
  styleUrls: ['./not-active.component.scss'],
})
export class NotActiveComponent implements OnInit {
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
