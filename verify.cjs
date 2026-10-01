// Run with Node.js: node verify.cjs
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const context = {window: {}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'guide.js'), 'utf8'), context);
const guide = JSON.parse(JSON.stringify(context.window.GUIDE));
const rows = JSON.parse(fs.readFileSync(path.join(__dirname, 'guide-source.json'), 'utf8'));
const expected = [];
for (const [field, response, explanation] of rows) {
  let group = expected.find(group => group.field === field);
  if (!group) {group = {field, options: []}; expected.push(group);}
  group.options.push({response, explanation});
}
assert.deepEqual(guide, expected, 'Guide fields, responses, order or guidance changed');
assert.equal(guide.length, 11);
assert.equal(guide.reduce((n, group) => n + group.options.length, 0), 63);
const special = guide.find(group => group.field === 'If Not Achieved, What Stopped It?');
assert(special.options.some(option => option.response === 'Other:'));
console.log('PASS: all 11 fields and 63 responses match the original Guide snapshot, including ordering and guidance.');
