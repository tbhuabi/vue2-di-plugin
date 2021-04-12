import { inject, InjectionKey, provide } from '@vue/composition-api'
import { Injector, NullInjector, Provider, ReflectiveInjector } from '@tanbo/di'

const DIInjectKey = Symbol('DIInjectKey') as InjectionKey<Injector>

export function useRootReflectiveInjector(providers: Provider[] = []) {
  const contextInjector = new ReflectiveInjector(new NullInjector(), providers);
  provide(DIInjectKey, contextInjector)
  return contextInjector
}

export function useReflectiveInjector(providers: Provider[] = []) {
  const parentInjector = inject(DIInjectKey) as Injector
  const contextInjector = new ReflectiveInjector(parentInjector, providers);
  provide(DIInjectKey, contextInjector)
  return contextInjector
}
