import * as Crypto from "crypto";
import { FilterXSS } from "xss";

import {
  IUserSaveData,
  IUser,
  UsersMySQLRepository,
} from "../repositories/UsersMySQLRepository";
import ValidUserCredentials from "../helpers/ValidUserCredentials";
import JWTToken from "../helpers/JWTToken";
import { ApiErrorTypes } from "../helpers/ApiResponseHandler";
import { IVKUserAccessData, VKOAuth } from "../helpers/VKOAuth";

interface IJWTTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IPasswordEncodeConfig {
  SALT: string;
  ITERATIONS: number;
  KEYLEN: number;
  ALG: string;
}

export interface IJWTConfig {
  ISS: string;
  ACCESS_TIME: number;
  REFRESH_TIME: number;
  SECRET: string;
}

export class AuthService {
  constructor(
    private readonly _usersMySQLRepository: UsersMySQLRepository,
    private readonly _validUserCredentials: ValidUserCredentials,
    private readonly _filterXSS: FilterXSS,
    private readonly _crypto: typeof Crypto,
    private readonly _jwtToken: JWTToken,
    private readonly _vkOAuth: VKOAuth,

    private readonly _passwordEncodeConfig: IPasswordEncodeConfig,
    private readonly _jwtConfig: IJWTConfig
  ) {}

  async signUp(userData: IUserSaveData): Promise<IJWTTokens> {
    userData.password = this._crypto
      .pbkdf2Sync(
        userData.password,
        this._passwordEncodeConfig.SALT,
        this._passwordEncodeConfig.ITERATIONS,
        this._passwordEncodeConfig.KEYLEN,
        this._passwordEncodeConfig.ALG
      )
      .toString("hex");

    const userId: number = await this._usersMySQLRepository.save({
      email: userData.email,
      username: userData.username,
      password: userData.password,
    });

    return {
      accessToken: this._jwtToken.create(
        {
          iss: this._jwtConfig.ISS,
          exp: Date.now() + this._jwtConfig.ACCESS_TIME,
          userId: userId,
        },
        this._jwtConfig.SECRET
      ),
      refreshToken: this._jwtToken.create(
        {
          iss: this._jwtConfig.ISS,
          exp: Date.now() + this._jwtConfig.REFRESH_TIME,
          userId: userId,
        },
        this._jwtConfig.SECRET
      ),
    };
  }

  async getVKUserAccessData(
    vkCode: string,
    redirectUrl: string
  ): Promise<IVKUserAccessData> {
    return this._vkOAuth.getVKUserAccessData(vkCode, redirectUrl);
  }

  async findUserWithVKId(vkId: number): Promise<IUser> {
    return await this._usersMySQLRepository.findWithVKId(vkId);
  }

  async validVKUser(accessToken, vkUserId): Promise<boolean> {
    return await this._vkOAuth.validVKUser(accessToken, vkUserId);
  }

  userCredentialsIsNotValid(
    email: string,
    username: string,
    password: string
  ): { errorType: ApiErrorTypes } | false {
    if (!this._validUserCredentials.email(email)) {
      return { errorType: "email-invalid" };
    }

    if (
      !this._validUserCredentials.username(this._filterXSS.process(username))
    ) {
      return { errorType: "username-invalid" };
    }

    if (!this._validUserCredentials.password(password)) {
      return { errorType: "password-invalid" };
    }

    return false;
  }
}
