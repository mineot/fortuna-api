import { authLogin, authLogout, authMe, authRefresh } from '../adapters/remote/auth-client.js';
import { getFlagValue } from '../services/args.js';
import type { CliContext, RemoteAdapter } from '../services/types.js';
import type { CliCommandHandler } from './registry.js';

function requireRemoteAdapter(context: CliContext): RemoteAdapter {
  if (context.adapter.mode !== 'remote') {
    throw new Error('This command requires remote mode. Use --mode remote.');
  }
  return context.adapter;
}

export const authLoginHandler: CliCommandHandler = {
  async execute(args, context) {
    const adapter = requireRemoteAdapter(context);

    const email = getFlagValue(args, '--email');
    const password = getFlagValue(args, '--password');

    if (!email || !password) {
      throw new Error('Missing required flags: --email and --password');
    }

    const response = await authLogin(adapter, { email, password });
    await context.sessionProvider.writeToken(response.access_token);

    return {
      logged_in: true,
      environment: context.config.environment,
      token_persisted_at: context.config.sessionFilePath
    };
  }
};

export const authRefreshHandler: CliCommandHandler = {
  async execute(_args, context) {
    const adapter = requireRemoteAdapter(context);

    const accessToken = await context.sessionProvider.readToken();
    if (!accessToken) {
      throw new Error('No saved session token. Run auth login first.');
    }

    const response = await authRefresh(adapter, accessToken);
    await context.sessionProvider.writeToken(response.access_token);

    return {
      refreshed: true,
      environment: context.config.environment,
      token_persisted_at: context.config.sessionFilePath
    };
  }
};

export const authLogoutHandler: CliCommandHandler = {
  async execute(_args, context) {
    const adapter = requireRemoteAdapter(context);

    const accessToken = await context.sessionProvider.readToken();
    if (accessToken) {
      await authLogout(adapter, accessToken);
    }

    await context.sessionProvider.clearToken();
    return {
      logged_out: true,
      environment: context.config.environment
    };
  }
};

export const authMeHandler: CliCommandHandler = {
  async execute(_args, context) {
    const adapter = requireRemoteAdapter(context);

    const accessToken = await context.sessionProvider.readToken();
    if (!accessToken) {
      throw new Error('No saved session token. Run auth login first.');
    }

    const user = await authMe(adapter, accessToken);
    return {
      user
    };
  }
};
