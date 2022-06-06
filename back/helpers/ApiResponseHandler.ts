interface IApiErrorResponse {
  code: number;
  message: string;
}

interface IApiErrorLangs {
  ru: string;
  en: string;
}

interface IApiErrorTranslation {
  [name: string]: IApiErrorLangs;
}

interface IApiRedirectResponse {
  code: number;
  redirect_url: string;
}

function createApiErrorTranslations<T extends IApiErrorTranslation>(
  translations: T
): Readonly<Record<keyof T, IApiErrorLangs>> {
  return translations;
}

type ApiErrorTypes = keyof typeof apiErrorTranslations;

export default class ApiResponseHandler {
  genErrorData(
    statusCode: number,
    errorType: ApiErrorTypes,
    lang: keyof IApiErrorLangs
  ): IApiErrorResponse {
    return {
      code: statusCode,
      message: apiErrorTranslations[errorType][lang] || "No info",
    };
  }

  genRedirectData(
    statusCode: number,
    redirectUrl: string
  ): IApiRedirectResponse {
    return {
      code: statusCode,
      redirect_url: redirectUrl,
    };
  }
}

const apiErrorTranslations = createApiErrorTranslations({
  "email-ocuppied": {
    ru: "E-mail уже занят",
    en: "E-Mail is already in use",
  },
  "email-invalid": {
    ru: "E-mail введен не верно",
    en: "The e-mail was entered incorrectly",
  },
  "username-invalid": {
    ru: "Недопустимый никнейм",
    en: "Invalid user name",
  },
  "password-invalid": {
    ru: "Ненадежный пароль",
    en: "Unreliable password",
  },
  "server-error": {
    ru: "Ошибка сервера",
    en: "Server error",
  },
});