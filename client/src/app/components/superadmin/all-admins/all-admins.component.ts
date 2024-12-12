import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-admins',
  templateUrl: './all-admins.component.html',
  styleUrls: ['./all-admins.component.scss'],
})
export class AllAdminsComponent implements OnInit {
  public path = 'grids/superadmin';
  public file = 'all-admins.json';

  constructor() {}

  ngOnInit() {}
}
