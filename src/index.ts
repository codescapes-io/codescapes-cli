#!/usr/bin/env node

import { Command } from 'commander';
import { CSInitialize } from './commands/index.js';

const program = new Command();
program
    .command('init')
    .argument('<templateDir>')
    .argument('<targetDir>')
    .option('-p, --project <projectName>', 'project name')
    .action((templateDir: string, targetDir: string, option) => {
        const pInit = new CSInitialize(templateDir, targetDir, option);
        const res = pInit.run();
        process.exit(res);
    });
program.parse(process.argv);
