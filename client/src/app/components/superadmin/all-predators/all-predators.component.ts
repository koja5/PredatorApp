import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-predators',
  templateUrl: './all-predators.component.html',
  styleUrls: ['./all-predators.component.scss'],
})
export class AllPredatorsComponent implements OnInit {
  public path = 'grids/superadmin';
  public file = 'all-predators.json';

  constructor() {}

  ngOnInit() {}
}
