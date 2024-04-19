import traverse from '@babel/traverse';
import * as parser from '@babel/parser';
import { identifier, Node } from '@babel/types';
import generate from '@babel/generator';

export class TopLevelThisReplacer {
  // 当前的层级
  private currentLevel = 0;
  // 是否替换过
  private hasReplaced = false;
  private ast: Node;
  private code: string;

  constructor(code: string) {
    this.code = code;
    this.ast = parser.parse(this.code, { sourceType: 'module' });
  }

  replaceThis() {
    traverse(this.ast, {
      // 在进入每个节点时触发
      enter: (path) => {
      },
      // 在离开每个节点时触发
      exit: (path) => {
        if (this.currentLevel > 0) {
          this.currentLevel --;
        }
      },
      ThisExpression: (path) => {
        if (this.currentLevel === 0) {
          const windowNode = identifier('window');
          path.replaceWith(windowNode);
          this.hasReplaced = true;
        }
      },
      FunctionExpression: (path) => {
        // 遇到function函数，层级+1
        this.currentLevel ++;
      },
    });

    return this;
  }

  getCode() {
    if (this.hasReplaced) {
      return generate(this.ast).code;
    }

    return this.code;
  }
}
