import { betaSDK } from '@devrev/typescript-sdk';
import {
  ConversationsCreateRequest,
  ConversationsCreateRequestTypeValue,
} from '@devrev/typescript-sdk/dist/auto-generated/beta/beta-devrev-sdk';

import { TAG_CUSTOMER_NUMBER } from '../common/constants';
import {
  conversationCreate,
  createExternalTimelineComment,
  generateTitle,
  getConversationsList,
  getTagList,
} from '../common/devrev_api';
import { getDevRevBetaClient, getRevUserByUserID } from '../common/devrev_sdk';
import { checkIfContactExistInDevRev, setTags } from '../utils';

export async function createConversation(
  sender: any,
  devrevPAT: string,
  devrevSDK: betaSDK.Api<unknown>,
  result: string,
  updatedContent: any,
  keyword: any,
  revUserList: any
) {
  const revUserId = await checkIfContactExistInDevRev(revUserList, result, sender, devrevSDK);
  const revUserToken = await getRevUserByUserID(revUserId, devrevSDK);

  const revUserSDK = getDevRevBetaClient(revUserToken);

  const tagsList = await getTagList(devrevSDK);
  const tagDisplayId = tagsList.find((tag) => tag.name === TAG_CUSTOMER_NUMBER)?.display_id;

  const conversations: any[] = await getConversationsList(devrevSDK, sender, tagDisplayId);
  if (conversations.length > 0) {
    const conversationObject = conversations[0];
    if (conversationObject.members.find((member: any) => member.id === revUserId)) {
      await createExternalTimelineComment(revUserSDK, conversations[0].display_id, updatedContent);
    }
  } else {
    const revUserToken = await getRevUserByUserID(revUserId, devrevSDK);

    const revUserSDK = getDevRevBetaClient(revUserToken);

    const tagsList = await getTagList(devrevSDK);
    const tags = await setTags(tagsList, sender);

    const body: ConversationsCreateRequest = {
      // source_channel: 'textlocal sms',
      tags: tags,
      title: await generateTitle(devrevPAT, updatedContent),
      type: ConversationsCreateRequestTypeValue.Support,
    };
    const conversation = await conversationCreate(revUserSDK, body);

    await createExternalTimelineComment(revUserSDK, conversation?.id, updatedContent);
  }
}
