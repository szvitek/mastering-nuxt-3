// this is a global middleware that runs on every route change
export default defineNuxtRouteMiddleware((to, from) => {
  const navigationHistory = useLocalStorage('history', []);
  navigationHistory.value.push(to.path);
});
