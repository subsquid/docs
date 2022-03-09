# Handler Interfaces

We already discussed that there are three different types of Handlers. Subsquid SDK defines interface for these functions, so that the methods to attach them to a Processor can be type-safe. Here are their definitions.

## `EventHandler`

```typescript
export interface EventHandler {
    (ctx: EventHandlerContext): Promise<void>
}
```

Simply enought, it is a function that takes in an `EventHandlerContext` argument and returns a `Promise`, so it is asynchronous. And this is the method to attach an `EventHandler` to a Processor:

```typescript
export class SubstrateProcessor {

    // ...
    
    addEventHandler(eventName: QualifiedName, fn: EventHandler): void
    addEventHandler(eventName: QualifiedName, options: EventHandlerOptions, fn: EventHandler): void
    addEventHandler(eventName: QualifiedName, fnOrOptions: EventHandlerOptions | EventHandler, fn?: EventHandler): void {
        this.assertNotRunning()
        let handler: EventHandler
        let options: EventHandlerOptions = {}
        if (typeof fnOrOptions === 'function') {
            handler = fnOrOptions
        } else {
            handler = assertNotNull(fn)
            options = fnOrOptions
        }
        this.hooks.event.push({
            event: eventName,
            handler,
            ...options
        })
    }
    
    // ...
}

```

## `ExtrinsicHandler`

The `ExtrinsicHandler` is extremely similar to the `EventHandler` interface, just as the respective contexts are.

```typescript
export interface ExtrinsicHandler {
    (ctx: ExtrinsicHandlerContext): Promise<void>
}
```

This is the method to attach an `EventHandler` to a Processor:

```typescript
export class SubstrateProcessor {

    // ...
    
    addExtrinsicHandler(extrinsicName: QualifiedName, fn: ExtrinsicHandler): void
    addExtrinsicHandler(extrinsicName: QualifiedName, options: ExtrinsicHandlerOptions, fn: ExtrinsicHandler): void
    addExtrinsicHandler(extrinsicName: QualifiedName, fnOrOptions: ExtrinsicHandler | ExtrinsicHandlerOptions, fn?: ExtrinsicHandler): void {
        this.assertNotRunning()
        let handler: ExtrinsicHandler
        let options: ExtrinsicHandlerOptions = {}
        if (typeof fnOrOptions == 'function') {
            handler = fnOrOptions
        } else {
            handler = assertNotNull(fn)
            options = {...fnOrOptions}
        }
        let triggers = options.triggerEvents || ['system.ExtrinsicSuccess']
        new Set(triggers).forEach(event => {
            this.hooks.extrinsic.push({
                event,
                handler,
                extrinsic: extrinsicName,
                range: options.range
            })
        })
    }
    
    // ...
}

```

## `BlockHandler`

The `BlockHandler` interface is once again, a prototype of a function taking in a `BlockHandlerContext` argument and returning a `Promise`

```typescript
export interface BlockHandler {
    (ctx: BlockHandlerContext): Promise<void>
}
```

What's different, this time, is that developers can attach a `BlockHandler` function to be executed before or after the block is processed.

```typescript
export class SubstrateProcessor {

    // ...
    
    addPreHook(fn: BlockHandler): void
    addPreHook(options: BlockHookOptions, fn: BlockHandler): void
    addPreHook(fnOrOptions: BlockHandler | BlockHookOptions, fn?: BlockHandler): void {
        this.assertNotRunning()
        let handler: BlockHandler
        let options: BlockHookOptions = {}
        if (typeof fnOrOptions == 'function') {
            handler = fnOrOptions
        } else {
            handler = assertNotNull(fn)
            options = fnOrOptions
        }
        this.hooks.pre.push({handler, ...options})
    }

    addPostHook(fn: BlockHandler): void
    addPostHook(options: BlockHookOptions, fn: BlockHandler): void
    addPostHook(fnOrOptions: BlockHandler | BlockHookOptions, fn?: BlockHandler): void {
        this.assertNotRunning()
        let handler: BlockHandler
        let options: BlockHookOptions = {}
        if (typeof fnOrOptions == 'function') {
            handler = fnOrOptions
        } else {
            handler = assertNotNull(fn)
            options = fnOrOptions
        }
        this.hooks.post.push({handler, ...options})
    }
    
    // ...
}

```

## `EvmLogHandler`

The `EvmLogHandler` is extremely similar to the `EventHandler` interface, just as the respective contexts are.

```typescript
export interface EvmLogHandler {
    (ctx: EvmLogHandlerContext): Promise<void>
}
```

This is how to attach an `EvmLogHandler` to a `SubstrateEvmProcessor`:

```typescript
export class SubstrateEvmProcessor extends SubstrateProcessor {
    addEvmLogHandler(contractAddress: string, fn: EvmLogHandler): void
    addEvmLogHandler(contractAddress: string, options: EvmLogHandlerOptions, fn: EvmLogHandler): void
    addEvmLogHandler(contractAddress: string, fnOrOptions: EvmLogHandlerOptions | EvmLogHandler, fn?: EvmLogHandler): void {
        this.assertNotRunning()
        let handler: EvmLogHandler
        let options: EvmLogHandlerOptions = {}
        if (typeof fnOrOptions === 'function') {
            handler = fnOrOptions
        } else {
            handler = assertNotNull(fn)
            options = fnOrOptions
        }
        this.hooks.evmLog.push({
            contractAddress,
            handler,
            ...options
        })
    }
}

```

