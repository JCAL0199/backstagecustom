/*
 * Hi!
 *
 * Note that this is an EXAMPLE Backstage backend. Please check the README.
 *
 * Happy hacking!
 */

import { createBackend } from '@backstage/backend-defaults';

import { createBackendModule } from '@backstage/backend-plugin-api';
import { gitlabAuthenticator } from '@backstage/plugin-auth-backend-module-gitlab-provider';
import {
  authProvidersExtensionPoint,
  createOAuthProviderFactory,
} from '@backstage/plugin-auth-node';
import fetch from 'node-fetch';

const gitlabGroupAuthResolver = createBackendModule({
  pluginId: 'auth',
  moduleId: 'gitlab-group-auth',
  register(reg) {
    reg.registerInit({
      deps: { providers: authProvidersExtensionPoint },
      async init({ providers }) {
        providers.registerProvider({
          providerId: 'gitlab',
          factory: createOAuthProviderFactory({
            authenticator: gitlabAuthenticator,
            async signInResolver({ profile, result }, ctx) {
              const groupId = '109548991'; // Replace with your actual group ID
              const accessToken = result.session.accessToken;

              if (!accessToken) {
                throw new Error('GitLab access token not found');
              }

              try {
                // 1. First get current user details
                const userRes = await fetch('https://gitlab.com/api/v4/user', {
                  headers: { Authorization: `Bearer ${accessToken}` },
                });
                const user = await userRes.json();

                // 2. Check group membership (better endpoint)
                const membersRes = await fetch(
                  `https://gitlab.com/api/v4/groups/${groupId}/members/${user.id}`,
                  { headers: { Authorization: `Bearer glpat-HbFdX7pUzmRjad-rhAv9` } }
                );

                if (membersRes.status !== 200) {
                  // More helpful error message
                  const groupInfo = await fetch(
                    `https://gitlab.com/api/v4/groups/${groupId}`,
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                  ).then(r => r.json());
                  
                  throw new Error(
                    `You must be a member of "${groupInfo.name}" (${groupInfo.full_path}) GitLab group to access this application. ` +
                    `Please request access from your group maintainer.`
                  );
                }
                
                return ctx.signInWithCatalogUser({
                  filter: {
                    'spec.profile.email': profile.email || user.email || '',
                  },
                });

              } catch (error: any) {
                console.error('GitLab auth error:', error);
                throw new Error(`Authentication failed: ${error.message}`);
              }
            },
          }),
        });
      },
    });
  },
});

const backend = createBackend();

backend.add(import('@backstage/plugin-catalog-backend-module-github-org'));
backend.add(import('@backstage/plugin-catalog-backend-module-gitlab-org'));

backend.add(import('@backstage/plugin-app-backend'));
backend.add(import('@backstage/plugin-proxy-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-github'));
backend.add(import('@backstage/plugin-techdocs-backend'));

// auth plugin
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('@backstage/plugin-auth-backend-module-github-provider'));
//backend.add(import('@backstage/plugin-auth-backend-module-gitlab-provider'));



// See https://backstage.io/docs/backend-system/building-backends/migrating#the-auth-plugin
//backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));
// See https://backstage.io/docs/auth/guest/provider

// catalog plugin
backend.add(import('@backstage/plugin-catalog-backend'));
backend.add(
  import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
);

// See https://backstage.io/docs/features/software-catalog/configuration#subscribing-to-catalog-errors
backend.add(import('@backstage/plugin-catalog-backend-module-logs'));

// permission plugin
backend.add(import('@backstage/plugin-permission-backend'));
// See https://backstage.io/docs/permissions/getting-started for how to create your own permission policy
backend.add(
  import('@backstage/plugin-permission-backend-module-allow-all-policy'),
);

// search plugin
backend.add(import('@backstage/plugin-search-backend'));

// search engine
// See https://backstage.io/docs/features/search/search-engines
backend.add(import('@backstage/plugin-search-backend-module-pg'));

// search collators
backend.add(import('@backstage/plugin-search-backend-module-catalog'));
backend.add(import('@backstage/plugin-search-backend-module-techdocs'));

// kubernetes
backend.add(import('@backstage/plugin-kubernetes-backend'));


backend.add(gitlabGroupAuthResolver);
backend.start();
