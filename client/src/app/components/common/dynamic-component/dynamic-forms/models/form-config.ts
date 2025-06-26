import { RequestModel } from 'src/app/models/request.model';
import { FieldConfig } from './field-config';
import { FieldsWithAdditionalInfo } from './fields-with-additional-info';

export class FormConfig {
  actionButtons?: any;
  request?: RequestModel;
  actionRequest?: {
    createNew: {
      title: any;
      enable: boolean;
      request: RequestModel;
      newPage: CreateNewOnNewPageModel;
    };
    save: any;
  };
  editSettingsRequest?: any;
  additionalInfo?: FieldsWithAdditionalInfo;
  config?: FieldConfig[];
  childrens?: FormConfig[];
  class?: string;
}

export class CreateNewOnNewPageModel {
  link?: string;
}
