export class PredatorModel {
  id?: number;
  id_user?: number;
  id_predator?: number;
  name_of_predator?: string;
  total_number!: number;
  including_young_animals?: number;
  including_female_animals?: number;
  including_male_animals?: number;
  id_type_of_water!: number;
  name_of_type_of_water: string;
  distance_to_water?: number;
  id_territory!: number;
  name_of_territory: string;
  id_activity!: number;
  name_of_activity: string;
  comment?: string;
  gallery?: any;
}
