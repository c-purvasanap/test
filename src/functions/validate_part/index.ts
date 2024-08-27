import { WorkType } from '../common/constants';
import { getDefaultPart } from '../common/devrev_api';

export async function validate(event: any) {
  if (event?.input_data?.global_values?.primary_use_case === WorkType.TICKET) {
    const part = await getDefaultPart(event?.context?.secrets?.service_account_token, event?.context?.dev_oid);
    if (part === null || part === undefined) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw 'Mandatory setup missing: Please set the part set up in Portal Preferences';
    }
  }
}

export const run = async (events: any[]) => {
  for (const event of events) {
    validate(event);
  }
};

export default run;
