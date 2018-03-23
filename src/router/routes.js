import user from './user';
import company from './company';
import example from './example';
import project from './project';
import quotation from './quotation';

const indexPage = {
  path: '',
  component: () => import('pages/index'),
  meta: {
    title: 'Index',
    authorize: 'isAuthenticated()'
  }
};

const signInPage = {
  path: '/sign-in',
  component: () => import('src/pages/sign-in'),
  meta: {
    title: '로그인',
    authorize : 'permitAll'
  }
};

export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      indexPage,
      ...user,
      ...company,
      ...quotation,
      ...project,
      ...example
    ]
  },
  signInPage,

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]