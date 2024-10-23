import { ConfigurationFileModel } from "./configuration-file.model";


export interface RequestModel {
  type: string;
  api: string;
  parametars?: any[];
  fields: any;
  root?: string;
  localData?: ConfigurationFileModel;
  parametarsDate: any;
}
