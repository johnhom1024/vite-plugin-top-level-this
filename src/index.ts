import { Plugin } from 'vite';

import { TopLevelThisReplacer } from './utils';

interface Options {
  libs: Array<{
    libraryName: string;
    replacement: string;
  }>;
}

export default function topLevelThisPlugin(pluginOptions: Options): Plugin {
  return {
    name: 'vite-plugin-top-level-this',
    transform(code, id) {
      const { libs = [] } = pluginOptions;
      const matchOne = libs.find((lib) => {
        return id.includes(lib.libraryName);
      });

      if (matchOne) {
        const replacer = new TopLevelThisReplacer(code);
        replacer.replaceThis();
        return replacer.getCode();
      }

      return code;
    },
  };
}
