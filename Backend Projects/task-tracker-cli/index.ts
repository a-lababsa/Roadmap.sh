#! /usr/bin/env node 

import { main } from "./src/main";

const command = process.argv.slice(2);

main(command);