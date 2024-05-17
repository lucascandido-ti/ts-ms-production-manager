import { ConfigService } from '@nestjs/config';

import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';

import { IsInstance, ValidateNested } from 'class-validator';

import { ApiConfig } from './api.config';
import { getConfigModuleOptions } from './utils';

import defaultSettingsJson from './settings.json';

export * from './api.config';
export * from './rabbitmq.config';

export * from './utils';
export * from './providers';

export class Config {
  @IsInstance(ApiConfig)
  @ValidateNested()
  api: ApiConfig;
}

export function getConfigJsonConfigMap(
  configService: ConfigService,
): Record<string, unknown> {
  try {
    const configJsonString = configService.get<string>('MY_SETTINGS');
    const configJson = JSON.parse(configJsonString);
    return _.merge(defaultSettingsJson, configJson);
  } catch (error: unknown) {
    console.warn(`Error to load config data: ${error}`);
    console.warn(`Try load by local settings...`);
    return getConfigJsonLocal();
  }
}

export function getConfigJsonLocal(): Record<string, unknown> {
  try {
    const configJsonPath = path.join(
      process.cwd(),
      '/src/config/settings.json',
    );
    const configJsonString = fs.readFileSync(configJsonPath, {
      encoding: 'utf-8',
    });
    const configJson = JSON.parse(configJsonString);

    return _.merge(defaultSettingsJson, configJson);
  } catch {
    return defaultSettingsJson;
  }
}

// Se for testar localmente, alterar a função de captura de configurações para getConfigJsonLocalHost

// const configService = new ConfigService();

export const configModuleOptions = getConfigModuleOptions(
  Config,
  getConfigJsonLocal(),
);
