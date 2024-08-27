import { WorkType } from '../common/constants';
import { getRevUserlist } from '../common/devrev_api';
import { getDevRevBetaSDK } from '../common/devrev_sdk';
import { createConversation } from '../create_conversation';
import { createTicketOrCreateTimelineComment } from '../create_ticket';

export async function handleEvent(event: any) {
  const devrevPAT = event.context.secrets.service_account_token;
  const devrevSDK = getDevRevBetaSDK(event);
  const {
    sender,
    result,
    updatedContent,
    keyword,
  }: { sender: string; result: any; updatedContent: any; keyword: any } = parseBody(event);

  const revUserList = await getRevUserlist(devrevSDK, [sender]);

  if (event.input_data.global_values.primary_use_case === WorkType.TICKET) {
    await createTicketOrCreateTimelineComment(
      sender,
      devrevPAT,
      devrevSDK,
      result,
      updatedContent,
      keyword,
      revUserList
    );
  } else {
    await createConversation(sender, devrevPAT, devrevSDK, result, updatedContent, keyword, revUserList);
  }
}

function parseBody(event: any) {
  const rawBody = event.payload.body_raw;

  // Decode the Base64 encoded string
  const decodedData = Buffer.from(rawBody, 'base64').toString('utf-8');

  // Parse the URL-encoded string
  const parsedData = new URLSearchParams(decodedData);

  // Convert parsed data to a plain object for easier access
  const result: any = {};
  for (const [key, value] of parsedData.entries()) {
    result[key] = decodeURIComponent(value);
  }
  const keywordMatch = result.content.match(/\S+/);
  const keyword = keywordMatch ? keywordMatch[0] : '';

  // Remove the first keyword from the content
  const updatedContent = result.content.replace(new RegExp(`^${keyword}\\s*`, 'm'), '').trim();

  console.log(updatedContent);
  const sender = `+${result.sender}`;
  return { keyword, result, sender, updatedContent };
}

export const run = async (events: any[]) => {
  console.log(' evnet ' + JSON.stringify(events));
  for (const event of events) {
    await handleEvent(event);
  }
};

export default run;
