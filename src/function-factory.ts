import create_custom_fields from './functions/create_custom_fields';
import handle_messages from './functions/handle_messages';
import on_work_creation from './functions/on_work_creation';
import validate_part from './functions/validate_part';

export const functionFactory = {
  // Add your functions here
  create_custom_fields,
  handle_messages,
  on_work_creation,
  validate_part,
} as const;

export type FunctionFactoryType = keyof typeof functionFactory;
