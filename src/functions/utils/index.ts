import { betaSDK } from '@devrev/typescript-sdk';
import { SetTagWithValue } from '@devrev/typescript-sdk/dist/auto-generated/beta/beta-devrev-sdk';

import { createContact } from '../common/devrev_api';

export async function checkIfContactExistInDevRev(
  revUserList: any,
  //   workObject: any,
  result: any,
  sender: string,
  devrevSDK: betaSDK.Api<unknown>
) {
  let revUserId;
  if (revUserList?.length > 0) {
    const revUser = revUserList[0];
    // workObject.rev_user_id = revUser.id;
    revUserId = revUser.id;
    if (revUser.rev_org) {
      //   workObject.rev_org_id = revUser.rev_org.id;
      const revUserOrgId = revUser.rev_org_id;
    }
  } else {
    const senderBody = {
      email: result?.email,
      firstname: result?.firstname ?? sender,
      phone_number: sender,
    };
    const revUserDetails = await createContact(devrevSDK, senderBody);
    if (revUserDetails) {
      revUserId = revUserDetails?.id;
      //   workObject.rev_user_id = revUserId;
    }
  }
  return revUserId;
}

export async function setTags(tagsList: any[], sender: string) {
  const tagId: SetTagWithValue[] = [];
  const customerNumberTag = tagsList.find((tag) => tag.name === 'customer-number' && tag.display_id);
  tagId.push({ id: customerNumberTag?.display_id, value: sender });
  const channelSmsTag = tagsList.find((tag) => tag.name === 'channel-sms' && tag.display_id);
  tagId.push({ id: channelSmsTag?.display_id });
  return tagId;
}
