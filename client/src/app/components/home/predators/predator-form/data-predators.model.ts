export class PredatorModel {
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
  predators?: PredatorModel;
  typeOfWaters?: TypeOfWaterModel;
  territories?: TerritoryModel;
  activities?: ActivityModel;
}
