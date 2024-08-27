import {
  CustomSchemaFragmentsSetRequest,
  CustomSchemaFragmentsSetRequestType,
  SchemaFieldDescriptor,
  SchemaFieldDescriptorFieldType,
} from '@devrev/typescript-sdk/dist/auto-generated/beta/beta-devrev-sdk';

import { CUSTOM_FIELD_APP_NAME, INNUMBER, KEYWORD, SENDER } from '../common/constants';
import { getDevRevBetaSDK } from '../common/devrev_sdk';

export async function createCustomFields(event: any) {
  const fields: SchemaFieldDescriptor[] = [
    {
      field_type: SchemaFieldDescriptorFieldType.Text,
      is_filterable: true,
      name: SENDER,
      ui: {
        display_name: 'Sender',
        group_name: 'SMS attributes',
        is_groupable: true,
        is_hidden: false,
      },
    },
    {
      field_type: SchemaFieldDescriptorFieldType.Text,
      is_filterable: true,
      name: INNUMBER,
      ui: {
        display_name: 'InNumber',
        group_name: 'SMS attributes',
        is_groupable: true,
        is_hidden: false,
      },
    },
    {
      field_type: SchemaFieldDescriptorFieldType.Text,
      is_filterable: true,
      name: KEYWORD,
      ui: {
        display_name: 'Keyword',
        group_name: 'SMS attributes',
        is_groupable: true,
        is_hidden: false,
      },
    },
  ];
  const body: CustomSchemaFragmentsSetRequest = {
    app: CUSTOM_FIELD_APP_NAME,
    description: 'Custom fields',
    fields: fields,
    leaf_type: 'ticket',
    type: CustomSchemaFragmentsSetRequestType.AppFragment,
  };

  try {
    const devrevSDK = getDevRevBetaSDK(event);
    const response = await devrevSDK.customSchemaFragmentsSet(body);
  } catch (error) {
    console.error('Error creating Custom Fields', error);
    return false;
  }
  return true;
}

export const run = async (events: any[]) => {
  for (const event of events) {
    const valid = await createCustomFields(event);
    if (!valid) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw 'Cannot create custom fields';
    }
  }
};

export default run;
