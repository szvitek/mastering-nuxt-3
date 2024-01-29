import type { H3Event } from 'h3';

// if the user doesn't exist on the request, throw a 401 error
export default (event: H3Event) => {
  if (!event.context.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }
};
