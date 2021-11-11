#!/usr/bin/env node

import meow from 'meow';

import { CSInitialize } from './commands';

const cli = meow(`
    Codescapes CLI

    Commands:
    - codescapes init <name> [targetDir]
`);

const pInit = new CSInitialize();
pInit.initialize();
const iStatus = pInit.run(cli.input, cli.flags);
pInit.finalize();

process.exit(iStatus);
