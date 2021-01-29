import { Module } from '@nestjs/common';
import { PactConsumerModule } from 'nestjs-pact';
import path = require('path');

@Module({
  imports: [
    PactConsumerModule.register({
      consumer: {
        port: 5000,
        dir: path.resolve(process.cwd(), 'pact'),
        log: path.resolve(process.cwd(), 'logs', 'pact.log'),
        logLevel: 'info',
        spec: 2,
      },
      publication: {
        pactFilesOrDirs: [path.resolve(process.cwd(), 'pact')],
        pactBroker: '',
        consumerVersion: '2',
      },
    }),
  ],
})
export class PactModule {}
