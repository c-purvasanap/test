import { betaSDK } from '@devrev/typescript-sdk';

import { WorkType } from '../common/constants';
import {
  createExternalTimelineComment,
  createTicket,
  generateTitle,
  getTicketDataByPhoneNumber,
  updateWorkWithTextlocalDetails,
} from '../common/devrev_api';
import { getDevRevBetaClient, getRevUserByUserID } from '../common/devrev_sdk';
import { checkIfContactExistInDevRev } from '../utils';

export async function createTicketOrCreateTimelineComment(
  sender: string,
  devrevPAT: any,
  devrevSDK: betaSDK.Api<unknown>,
  result: any,
  updatedContent: any,
  firstKeyword: any,
  revUserList: any
) {
  const tickets = await getTicketDataByPhoneNumber(sender, devrevPAT);
  //comment on ticket if it is already exist
  if (tickets && tickets.length > 0) {
    const ticket = tickets[0];
    const revUserToken = await getRevUserByUserID(ticket.created_by.id, devrevSDK);
    const revUserSDK = getDevRevBetaClient(revUserToken);
    await createExternalTimelineComment(revUserSDK, ticket.display_id, updatedContent);
  }
  //create a new ticket
  else {
    //automatically generate the title based on the message content
    const title = await generateTitle(devrevPAT, updatedContent);
    const workObject: any = {
      title: title,
      type: WorkType.TICKET,
    };
    // const revUserList = await getRevUserlist(devrevSDK, [sender]);
    const revUserId = await checkIfContactExistInDevRev(revUserList, result, sender, devrevSDK);
    if (revUserId) {
      const revUserToken = await getRevUserByUserID(revUserId, devrevSDK);
      const workDetails = await createTicket(revUserToken, workObject);
      const workId = workDetails?.display_id;
      const inNumber = `+${result.inNumber}`;
      await updateWorkWithTextlocalDetails(workId, inNumber, firstKeyword, sender, devrevSDK);
      const revUserSDK = getDevRevBetaClient(revUserToken);
      await createExternalTimelineComment(revUserSDK, workId, updatedContent);
    }
  }
}
