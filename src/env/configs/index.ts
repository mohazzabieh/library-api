import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

export default () => {
  let YAML_CONFIG_FILENAME = 'local.yaml';

  if (process.env.PLATFROM === 'docker') {
    YAML_CONFIG_FILENAME = 'docker.yaml';
  }

  return yaml.load(
    readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf-8'),
  ) as Record<string, any>;
};
