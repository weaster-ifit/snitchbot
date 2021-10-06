import LogBot from './base';

LogBot.log({ type: 'logged before init', data: 'it works!' });

setTimeout(() => LogBot.init(), 1000);

setTimeout(() => LogBot.log({ type: 'no data' }), 2000);
setTimeout(() => LogBot.log({ type: 'logged after init', data: 'foobar' }), 4000);
setTimeout(() => LogBot.log({ data: 'no type' }), 6000);
setTimeout(() => LogBot.log({ data: [1, 2, 3] }), 7000);
setTimeout(() => LogBot.log({ data: { foo: 'bar' } }), 8000);
