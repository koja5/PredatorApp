import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-territories',
  templateUrl: './all-territories.component.html',
  styleUrls: ['./all-territories.component.scss'],
})
export class AllTerritoriesComponent implements OnInit {
  public path = 'grids/superadmin';
  public file = 'all-territories.json';

  constructor() {}

  ngOnInit() {}
}
