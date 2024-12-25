import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-activities',
  templateUrl: './all-activities.component.html',
  styleUrls: ['./all-activities.component.scss'],
})
export class AllActivitiesComponent implements OnInit {
  public path = 'grids/superadmin';
  public file = 'all-activities.json';

  constructor() {}

  ngOnInit() {}
}
