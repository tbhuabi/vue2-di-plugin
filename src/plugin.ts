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
  const parentInjector = inject(DIInjectKey) as Injector
  const contextInjector = new ReflectiveInjector(parentInjector, providers);
  provide(DIInjectKey, contextInjector)
  return contextInjector
}

export class TestBad {
  static useReflectiveInjector(providers: Provider[]) {
    replacedContextInjector = new ReflectiveInjector(null, providers)
    return replacedContextInjector;
  }
}
