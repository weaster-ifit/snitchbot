import LogBot from './base';

LogBot.log({ type: 'logged before init', data: 'it works!' });

setTimeout(() => LogBot.init(), 1000);

setTimeout(() => LogBot.log({ type: 'no data' }), 2000);
setTimeout(() => LogBot.log({ type: 'logged after init', data: 'foobar' }), 3000);

// No type
setTimeout(() => LogBot.log({ data: 'no type' }), 4000);
setTimeout(() => LogBot.log({ data: [1, 2, 3] }), 5000);
setTimeout(() => LogBot.log({ data: { foo: 'bar' } }), 6000);


setTimeout(() => LogBot.log({ type: 'Type 5', data: { baz: 'buz' } }), 7000);
setTimeout(() => LogBot.log({ type: 'Type 6', data: { foo: 'bar' } }), 8000);

// Logs an error
const a = {};
const b = {};
b.a = a;
a.b = b;
setTimeout(() => LogBot.log({ type: 'Type 6', data: { foo: a } }), 8000);