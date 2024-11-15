export class PredatorItemModel {
  id?: number;
  name?: string;
}

export class TypeOfWaterModel {
  id?: number;
  name?: string;
}

export class TerritoryModel {
  id?: number;
  name?: string;
}

export class ActivityModel {
  id?: number;
  name?: string;
}

export class DataPredatorsModel {
  predators?: PredatorItemModel;
  typeOfWaters?: TypeOfWaterModel;
  territories?: TerritoryModel;
  activities?: ActivityModel;
}
