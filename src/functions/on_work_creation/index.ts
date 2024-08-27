import { getDevRevBetaSDK } from '../common/devrev_sdk';

export async function handleEvent(event: any) {
  const devrevSDK = getDevRevBetaSDK(event);
}

export const run = async (events: any[]) => {
  console.log('On_Work_Creation_Event' + JSON.stringify(events));
  for (const event of events) {
    await handleEvent(event);
  }
};

export default run;
