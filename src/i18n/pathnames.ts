export const pathnames = {
  '/': '/',
  '/pathnames': '/pathnames',
  '/test/[id]': '/test/[id]'
};

export type AppPathnames = keyof typeof pathnames;
