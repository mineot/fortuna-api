type OptionArgs = {
  t?: (key: string) => string;
};

type MergeArgs = {
  url: string;
  payload: any;
  options?: OptionArgs;
};

export function getCsrfToken(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);

  return match ? decodeURIComponent(match[1]) : null;
}

export function getCsrfHeader() {
  const csrfToken = getCsrfToken();

  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(csrfToken ? { 'X-XSRF-TOKEN': csrfToken } : {}),
  };
}

export async function merge<T>({ url, payload, options }: MergeArgs): Promise<T> {
  const genericMessage = options?.t
    ? options.t('app.terms.error_occurred')
    : 'Unexpected error occurred';

  try {
    const response = await fetch(url, {
      method: 'PUT',
      credentials: 'include',
      headers: getCsrfHeader(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      let msg = body.errors?.[0]?.message;
      msg = msg || body.message;
      msg = msg || genericMessage;
      throw msg;
    }

    const body = await response.json();
    return body.data as T;
  } catch (error) {
    console.error('API Helper - Merge: ', error);

    if (typeof error === 'string') {
      throw error;
    }

    if (error instanceof Error) {
      throw error.message;
    }

    throw genericMessage;
  }
}

// type ResponseStatus = 'ERROR' | 'SUCCESS';
// type Response<T> = { status: ResponseStatus; message: string; data?: T };

// type FindByIdArgs = { url: string; id: number; useCredential?: boolean; t: TFunction };
// type ArchiveArgs = { url: string; id: number; t: TFunction };

// export async function findById<T>(args: FindByIdArgs): Promise<Response<T>> {
//   const { url, id, useCredential, t } = args;

//   try {
//     const options: RequestInit = useCredential
//       ? { credentials: 'include', headers: getCsrfHeader() }
//       : { headers: { Accept: 'application/json' } };

//     const response = await fetch(`${url}/${id}`, options);

//     if (!response.ok) {
//       const body = await response.json().catch(() => ({}));
//       return { status: 'ERROR', message: body.message };
//     }

//     const body = await response.json();
//     return { status: 'SUCCESS', message: body.message, data: body.data as T };
//   } catch (error) {
//     return {
//       status: 'ERROR',
//       message: error instanceof Error ? error.message : t('app.terms.error_unexpected'),
//     };
//   }
// }

// export async function archive<T>(args: ArchiveArgs): Promise<Response<T>> {
//   const { url, id, t } = args;

//   try {
//     const response = await fetch(`${url}/${id}/archive`, {
//       method: 'PATCH',
//       credentials: 'include',
//       headers: getCsrfHeader(),
//     });

//     if (!response.ok) {
//       const body = await response.json().catch(() => ({}));
//       return { status: 'ERROR', message: body.message };
//     }

//     const body = await response.json();
//     return { status: 'SUCCESS', message: body.message, data: body.data as T };
//   } catch (error) {
//     return {
//       status: 'ERROR',
//       message: error instanceof Error ? error.message : t('app.terms.error_unexpected'),
//     };
//   }
// }

// export async function update<T>(url: string, id: number, body: any): Promise<Response<T>> {
//   try {
//     const response = await fetch(url, {
//       method: 'PUT',
//       credentials: 'include',
//       headers: getCsrfHeader(),
//       body,
//     });

//     if (!response.ok) {
//       const json = await response.json().catch(() => ({}));

//       return {
//         status: 'ERROR',
//         message: json.message,
//       };
//     }

//     const json = await response.json();

//     return {
//       status: 'SUCCESS',
//       message: json.message,
//       data: json.data as T,
//     };
//   } catch (error) {
//     throw error;
//   }
// }
