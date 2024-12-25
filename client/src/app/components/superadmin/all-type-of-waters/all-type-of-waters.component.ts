import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-type-of-waters',
  templateUrl: './all-type-of-waters.component.html',
  styleUrls: ['./all-type-of-waters.component.scss'],
})
export class AllTypeOfWatersComponent implements OnInit {
  public path = 'grids/superadmin';
  public file = 'all-type-of-waters.json';

  constructor() {}

  ngOnInit() {}
}
