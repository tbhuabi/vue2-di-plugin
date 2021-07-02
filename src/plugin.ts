import { inject, InjectionKey, provide } from '@vue/composition-api'
import { Injector, NullInjector, Provider, ReflectiveInjector } from '@tanbo/di'

const DIInjectKey = Symbol('DIInjectKey') as InjectionKey<Injector>

let replacedContextInjector: ReflectiveInjector = null;

function createReplacedInjector(providers: Provider[] = []) {
  replacedContextInjector.parentInjector = new ReflectiveInjector(new NullInjector(), providers);
  provide(DIInjectKey, replacedContextInjector)
  const injector = replacedContextInjector;
  replacedContextInjector = null;
  return injector;
}

export function useRootReflectiveInjector(providers: Provider[] = []) {
  if (replacedContextInjector) {
    return createReplacedInjector(providers)
  }
  const contextInjector = new ReflectiveInjector(new NullInjector(), providers);
  provide(DIInjectKey, contextInjector)
  return contextInjector
}

export function useReflectiveInjector(providers: Provider[] = []) {
  if (replacedContextInjector) {
    return createReplacedInjector(providers)
  }
  let parentInjector: Injector;
  try {
    parentInjector = inject(DIInjectKey) as Injector
  } catch (e) {
    throw new Error('[vue2-di-plugin]: cannot find parentInjector!')
  }
  const contextInjector = new ReflectiveInjector(parentInjector, providers);
  provide(DIInjectKey, contextInjector)
  return contextInjector
}

export class TestBed {
  static useReflectiveInjector(providers: Provider[]) {
    replacedContextInjector = new ReflectiveInjector(null, providers)
    return replacedContextInjector;
  }
}
