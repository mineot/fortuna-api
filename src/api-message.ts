export type ApiMessageBody<D> = {
  type: 'success' | 'warning' | 'error';
  message?: string;
  throwable?: unknown;
  data?: D;
};

export type ApiMessage<D> = Promise<ApiMessageBody<D>>;
