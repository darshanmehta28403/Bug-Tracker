// api-routes.enum.ts
export enum ApiRoutes {
  // ===== User APIs =====
  USER_BASE = '/api/user',
  GET_USERS = '/api/user',
  GET_USER_BY_ID = '/api/user/:id',
  CREATE_USER = '/api/user',
  UPDATE_USER = '/api/user/:id',
  DELETE_USER = '/api/user/:id',
  LOGIN_USER = '/api/user/login',
  SEND_MAIL = '/api/user/sendmail',
  UPDATE_PASSWORD = '/api/user/updatePassword/:id',

  // ===== Bug APIs =====
  BUG_BASE = '/api/bug',
  GET_BUGS = '/api/bug',
  GET_BUG_BY_ID = '/api/bug/:id',
  CREATE_BUG = '/api/bug',
  UPDATE_BUG = '/api/bug/:id',
  DELETE_BUG = '/api/bug/:id',

  // ===== Comment APIs =====
  COMMENT_BASE = '/api/comment',
  GET_COMMENTS = '/api/comment',
  GET_COMMENT_BY_ID = '/api/comment/:id',
  CREATE_COMMENT = '/api/comment',
  UPDATE_COMMENT = '/api/comment/:id',
  DELETE_COMMENT = '/api/comment/:id',

  // ===== Project APIs =====
  PROJECT_BASE = '/api/project',
  GET_PROJECTS = '/api/project',
  GET_PROJECT_BY_ID = '/api/project/:id',
  CREATE_PROJECT = '/api/project',
  UPDATE_PROJECT = '/api/project/:id',
  DELETE_PROJECT = '/api/project/:id',
  DELETE_PROJECT_MEMBER = '/api/project/member/:projectId/:memberId',
}
