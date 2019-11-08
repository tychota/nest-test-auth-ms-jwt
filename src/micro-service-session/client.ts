import * as path from 'path';

const protoPath = path.join(process.cwd(), 'proto', 'session.proto');

export default {
  url: 'localhost:50501',
  package: 'session',
  protoPath,
};
