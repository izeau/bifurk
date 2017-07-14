#!/usr/bin/env node

'use strict';

const { openSync, readSync, readFileSync } = require('fs');

const MEM_SIZE = process.env.MEM_SIZE || 30000;
const mem = new Int8Array(MEM_SIZE);
const stack = [0];
const prg = readFileSync(process.argv[2], 'utf-8');
const len = prg.length - 1;

let ptr = 0;
let skip, fd;

try {
  fd = openSync('/dev/stdin', 'rs');
} catch (e) {
  fd = process.stdin.fd;
}

while (stack[0] < len) {
  switch (prg[stack[0]++]) {
    case '>': ptr++; break;
    case '<': ptr--; break;
    case '+': mem[ptr]++; break;
    case '-': mem[ptr]--; break;
    case '.': process.stdout.write(String.fromCharCode(mem[ptr])); break;
    case ',': while(!readSync(fd, mem, ptr, 1)); break;
    case ']': stack.shift(); break;
    case '[':
      if (mem[ptr]) {
        stack[0]--;
        stack.unshift(stack[0] + 1);

        break;
      }

      for (skip = 1; skip > 0; stack[0]++) {
        if (prg[stack[0]] === '[') {
          skip += 1;
        } else if (prg[stack[0]] === ']') {
          skip -= 1;
        }
      }
  }
}
