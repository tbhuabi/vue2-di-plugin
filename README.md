基于反射依赖注入的 vue 插件
=============================
本插件用于解决 vue 框架自带的依赖注入能力较为简单的问题，通过本插件，可以实现自动依赖分析，分层注入，自动关联上下文等功能

## 安装
```
npm install @tanbo/vue2-di-plugin
```

## 配置 tsconfig

在 tsconfig.json 中加入如下配置
```json
{
  "compilerOptions": {
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true
  }
}
```

## 使用示例

根依赖
```typescript
// # deps.ts
import { Injectable } from '@tanbo/vue2-di-plugin';

@Injectable()
export class Parent {
  name = 'parent'
}

@Injectable()
export class Child {
  constructor(private parent: Parent) {
  }
}
```
在创建 App.vue 创建根依赖
```typescript
// # App.vue
import { defineComponent } from '@vue/composition-api'

import { useRootReflectiveInjector } from '@tanbo/vue2-di-plugin'
import { Child, Parent } from './deps'

export default defineComponent({
  name: 'App',
  setup() {
    const injector = useRootReflectiveInjector([Parent, Child])
    console.log(injector)
    console.log(injector.get(Child))
  }
});
```
在后代组件中使用
```typescript
import { defineComponent } from '@vue/composition-api'

import { useReflectiveInjector } from '@tanbo/vue2-di-plugin'
import { Child } from './deps'

export default defineComponent({
  name: 'App',
  setup() {
    const injector = useReflectiveInjector()
    console.log(injector)
    console.log(injector.get(Child))
  }
});
```

## 小知识

在组件内调用 `useReflectiveInjector` 时，也可以传入新的 providers，然后再通过返回的 injector 实例获取 provider 提供的类的实例。同时，所有的后代组件也都可以通过 injector 获取到上层组件提供的类的实例。

更多依赖注入的用法请参考 [@tanbo/di](https://github.com/tbhuabi/di)
