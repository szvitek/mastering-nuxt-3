import type { H3Event } from 'h3';

// if the user doesn't exist on the request, throw a 401 error
export default async (event: H3Event) => {
  if (!event.context.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  const hasAccess = await $fetch('/api/user/hasAccess', {
    headers: {
      cookie: getHeader(event, 'cookie') as string,
    },
  });
  if (!hasAccess) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }
};
