import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import {LogLevel, PLATFORM_CONSOLE_LOGGER, RNgPlatformLogger} from "rng-logger";


// @ts-ignore
const core = require('@nick-thompson/elementary').ElementaryWebAudioRenderer
// @ts-ignore
const el = require('@nick-thompson/elementary').el
// @ts-ignore
const ctx = new (window.AudioContext || window.webkitAudioContext)();

async function main(): Promise<any> {
  let node = await core.initialize(ctx, {
    numberOfInputs: 0,
    numberOfOutputs: 1,
    outputChannelCount: [2],
  });

  node.connect(ctx.destination);
}

if (environment.production) {
  enableProdMode();
}

Promise.all([
    platformBrowserDynamic([
      RNgPlatformLogger({
        level : LogLevel.DEBUG,
        maxBuffer: 50,
        nonResolvedStrategy: "ERROR"
      }),
      PLATFORM_CONSOLE_LOGGER,
      {provide: "elementary.el", useValue: el},
      {provide: "elementary.core", useValue: core},
      {provide: "AudioContext", useValue: ctx}
    ]).bootstrapModule(AppModule),
    main()
  ]
).catch(
  err => console.error(err)
)
