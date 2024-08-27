import { betaSDK } from '@devrev/typescript-sdk';
import {
  AuthTokensCreateRequest,
  ConversationsCreateRequest,
  ConversationsListRequest,
  RevUsersCreateRequest,
  TagsListRequest,
  TimelineEntriesCollection,
  TimelineEntriesCreateRequest,
  TimelineEntriesCreateRequestType,
  TimelineEntryVisibility,
  WorksCreateRequest,
  WorksUpdateRequest,
  WorkType,
} from '@devrev/typescript-sdk/dist/auto-generated/beta/beta-devrev-sdk';
import axios from 'axios';

import {
  CUSTOM_FIELD_APP_NAME,
  INNUMBER_FIELD_FORMATTED,
  KEYWORD_FIELD_FORMATTED,
  SENDER_FIELD_FORMATTED,
  TAG_CHANNEL_SMS,
  TAG_CUSTOMER_NUMBER,
} from './constants';

export async function generateTitle(devrevPAT: string, content: any) {
  const payload = {
    messages: [
      {
        content: `${content}, generate a title`,
        role: 'system',
      },
    ],
  };
  const url = `https://api.devrev.ai/internal/recommendations.chat.completions`;
  try {
    const res = await axios.post(url, payload, {
      headers: {
        Authorization: devrevPAT,
      },
      timeout: 1000 * 10,
    });
    const jsonData = res.data.slice('data: '.length);
    const dataObject = JSON.parse(jsonData);
    return dataObject.text_response.replace(/^"(.*)"$/, '$1');
  } catch (error) {
    console.error('Error fetching the API:', error);
    throw error;
  }
}

export async function createTicket1(devrevSDK: betaSDK.Api<unknown>, workObject: any) {
  const body: WorksCreateRequest = {
    applies_to_part: workObject.part,
    owned_by: workObject.owner,
    // reported_by: [workObject.revUserId],
    // rev_org: workObject.rev_org_id,
    source_channel: 'Textlocal SMS',
    title: workObject.title,
    type: WorkType.Ticket,
  };
  if (workObject.rev_org_id) {
    (body.reported_by = [workObject.rev_user_id]), (body.rev_org = workObject.rev_org_id);
  }
  try {
    const response = await createWork(devrevSDK, body);
    return response?.data.work;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createTicket(revToken: string, workObject: any) {
  const body = {
    title: workObject.title,
    type: WorkType.Ticket,
  };
  try {
    const url = 'https://api.devrev.ai/internal/works.create';
    const response = await axios.post(url, body, {
      headers: {
        Authorization: revToken,
      },
    });
    return response.data.work;
  } catch (error) {
    console.error('Failed to create a ticket');
  }
}

export async function createWork(devrevSDK: betaSDK.Api<unknown>, workObject: WorksCreateRequest) {
  try {
    const response = await devrevSDK.worksCreate(workObject);
    return response;
  } catch (error) {
    console.error('Failed to create work: ', error);
    return null;
  }
}

export async function getDevUserList(devrevSDK: betaSDK.Api<unknown>) {
  const response = await devrevSDK.devUsersList();
  return response.data.dev_users;
}

export async function createExternalTimelineComment(devrevSDK: betaSDK.Api<unknown>, workId: any, comment: string) {
  const body: TimelineEntriesCreateRequest = {
    body: comment,
    collections: [TimelineEntriesCollection.Discussions],
    object: workId,
    type: TimelineEntriesCreateRequestType.TimelineComment,
    visibility: TimelineEntryVisibility.External,
  };
  try {
    const response = await devrevSDK.timelineEntriesCreate(body);
    return response;
  } catch (error) {
    console.error('Failed to create timeline comment: ' + error);
    return null;
  }
}

export async function createExternalTimelineComment1(token: string, workId: any, comment: string) {
  const body: TimelineEntriesCreateRequest = {
    body: comment,
    collections: [TimelineEntriesCollection.Discussions],
    object: workId,
    type: TimelineEntriesCreateRequestType.TimelineComment,
    visibility: TimelineEntryVisibility.External,
  };
  const url = 'https://api.devrev.ai/internal/timeline-entries.create';
  const response = await axios.post(url, body, {
    headers: {
      Authorization: token,
    },
  });
  return response;
}

export async function getWorkData(devrevSDK: betaSDK.Api<unknown>, workId: string) {
  const body = {
    id: workId,
  };
  try {
    const response = await devrevSDK.worksGet(body);
    const work = response.data.work;
    return work;
  } catch (error) {
    console.error('Failed to get work data: ', error);
    return null;
  }
}

export async function getRevUserlist(devrevSDK: betaSDK.Api<unknown>, phoneNumbers?: string[]) {
  const body = {
    phone_numbers: phoneNumbers,
  };
  try {
    const response = await devrevSDK.revUsersListPost(body);
    return response.data.rev_users;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getRevUserToken(devrevSDK: betaSDK.Api<unknown>, body: AuthTokensCreateRequest) {
  try {
    const response = await devrevSDK.authTokensCreate(body);
    const token = response.data.access_token;
    return token;
  } catch (error) {
    console.log('Error in getting rev user token ', error);
    throw new Error('Error in getting rev user token');
  }
}

export async function createContact(devrevSDK: betaSDK.Api<unknown>, senderBody: any) {
  const body: RevUsersCreateRequest = {
    display_name: senderBody?.firstname ?? senderBody.sender,
    email: senderBody?.email,
    external_ref: senderBody.phone_number,
    phone_numbers: [senderBody.phone_number],
  };
  try {
    const response = await devrevSDK.revUsersCreate(body);
    return response.data.rev_user;
  } catch (error) {
    console.error('Failed to create RevUser: ', error);
    return null;
  }
}

export async function updateWorkWithTextlocalDetails(
  workId: string,
  inNumber: string,
  firstKeyword: string,
  sender: string,
  devrevSDK: betaSDK.Api<unknown>
) {
  const body: WorksUpdateRequest = {
    custom_fields: {
      [INNUMBER_FIELD_FORMATTED]: inNumber,
      [KEYWORD_FIELD_FORMATTED]: firstKeyword,
      [SENDER_FIELD_FORMATTED]: sender,
    },

    custom_schema_spec: {
      apps: [CUSTOM_FIELD_APP_NAME],
    },
    id: workId,
    type: WorkType.Ticket,
  };
  try {
    const response = await devrevSDK.worksUpdate(body);
    return response;
  } catch (error) {
    console.error('Failed to update work: ', error);
    return null;
  }
}

export async function getTicketDataByPhoneNumber(sender: string, devrevPAT: string) {
  const body = {
    custom_fields: {
      app_textlocal__sender: [`${sender}`],
    },
    type: ['ticket'],
  };
  const url = 'https://api.devrev.ai/internal/works.list';
  try {
    const response = await axios.post(url, body, {
      headers: {
        Authorization: devrevPAT,
      },
    });
    return response.data.works;
  } catch (error) {
    console.error('Failed to get ticket by phone number: ', error);
  }
}

export async function getConversationsList(
  devrevSDK: betaSDK.Api<unknown>,
  sender: string,
  tagDisplayId: string | undefined
) {
  const body: ConversationsListRequest = {
    tags_v2: [
      {
        id: tagDisplayId,
        value: sender,
      },
    ],
  };
  try {
    const response = await devrevSDK.conversationsListPost(body);
    return response.data.conversations;
  } catch (error) {
    console.error('Failed to get conversation list: ', error);
    return [];
  }
}

export async function conversationCreate(devrevSDK: betaSDK.Api<unknown>, body: ConversationsCreateRequest) {
  try {
    const response = await devrevSDK.conversationsCreate(body);
    return response.data.conversation;
  } catch (error) {
    console.log('Error in creating conversation ', error);
    throw new Error('Error in creating conversation');
  }
}

export async function getTagList(devrevSDK: betaSDK.Api<unknown>) {
  const body: TagsListRequest = {
    name: [TAG_CUSTOMER_NUMBER, TAG_CHANNEL_SMS],
  };
  try {
    const response = await devrevSDK.tagsListPost(body);
    return response.data.tags;
  } catch (error) {
    console.error('Failed to get tag list: ', error);
    return [];
  }
}

export async function getDefaultPart(devrevToken: string, devrevOrgId: string) {
  const devrevAuthToken = devrevToken;
  const orgId = devrevOrgId;
  const url = `https://app.devrev.ai/api/gateway/internal/preferences.get?object=${orgId}&&type=org_preferences`;
  try {
    const res = await axios.get(url, {
      headers: {
        Authorization: `${devrevAuthToken}`,
      },
    });
    const data = res.data;
    return res.data?.preference?.rev_portal?.ticket_creation_preferences?.default_ticket_part_id?.id;
  } catch (error) {
    console.error('Error fetching the API:', error);
    throw error;
  }
}
