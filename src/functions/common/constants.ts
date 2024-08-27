export enum WorkType {
  CONVERSATION = 'Conversation',
  TICKET = 'Ticket',
}

export const SENDER = 'sender';
export const INNUMBER = 'in_number';
export const KEYWORD = 'keyword';
export const CUSTOM_FIELD_APP_NAME = 'textlocal';

export const SENDER_FIELD_FORMATTED = `app_${CUSTOM_FIELD_APP_NAME}__${SENDER}`;
export const INNUMBER_FIELD_FORMATTED = `app_${CUSTOM_FIELD_APP_NAME}__${INNUMBER}`;
export const KEYWORD_FIELD_FORMATTED = `app_${CUSTOM_FIELD_APP_NAME}__${KEYWORD}`;

export const TAG_CUSTOMER_NUMBER = 'customer-number';
export const TAG_CHANNEL_SMS = 'channel-sms';
