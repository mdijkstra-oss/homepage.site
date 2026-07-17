import { isRecord } from '../../../lib/json';

export interface TextDeltaEvent {
  delta: string;
}

export interface FailedResponseEvent {
  message: string;
}

export function getTextDeltaEvent(value: Record<string, unknown> | undefined): TextDeltaEvent | undefined {
  return typeof value?.delta === 'string' ? { delta: value.delta } : undefined;
}

export function getFailedResponseEvent(value: Record<string, unknown> | undefined): FailedResponseEvent | undefined {
  const response = value?.response;
  const error = isRecord(response) ? response.error : undefined;
  const message = isRecord(error) ? error.message : undefined;
  return typeof message === 'string' ? { message } : undefined;
}
