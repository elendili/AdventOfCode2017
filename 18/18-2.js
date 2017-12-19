// ===================== Utilities
const chalk = require('chalk')
const util = require('util')
const error = (text = '') => console.error(chalk.red(text))
const pass = (text = '') => console.info(chalk.green(text))
const info = (text = '') => console.info(chalk.blue(text))
const inspect = (text = '', _depth = 3) => info('========\n' + util.inspect(text, {depth: _depth}) + '\n========')

module.exports = {
  loadFile: loadFile,
  info: info,
  verify: verify
}

function loadFile (fileName) {
  let fs = require('fs')
  let file = fs.readFileSync(__dirname + '/' + fileName, { encoding: 'utf8'})
  return file
}

function toJson (obj) {
  return JSON.stringify(obj)
}

function shrinkText (inputMsg) {
  let message = ''
  if (inputMsg.length > 50) {
    if (inputMsg.length > 300) {
      message += '\n' + inputMsg.substring(0, 300) + '\n'
    } else {
      message += '\n' + inputMsg + '\n'
    }
  } else {
    message += inputMsg + '\n'
  }
  return message
}
// expected, converter, input...
// expected, actual
function verify (expected, converter, input) {
  let argArr = Object.values(arguments)
  let actual, message = ''
  if (arguments.length >= 3) {
    actual = converter.apply(this, argArr.slice(2))
    message = 'Input: '
    argArr.slice(2).forEach(a =>
      message += shrinkText('' + a) + '\n'
     )
  } else if (arguments.length == 2) {
    actual = arguments[1]
    input = actual
  }

  message += 'Expected: ' + expected + '\n  Actual: ' + actual

  if (expected === actual || expected == actual || ('' + expected) == ('' + actual)) {
    pass(message)
  } else {
    error('Comparison Fail\n' + message)
  }
}

function convertFileToNumbersArray (inputFile) {
  let arr = inputFile.split('\n')
  arr = arr.map(l => l
      .match(/\d+/g).map(n => parseInt(n)))
  return arr
}

function convertFileToWords2dArray (inputFile) {
  let arr = inputFile.split(/\n/).filter(e => e.length > 0)
  let arr2 = arr.map(item => item.split(/\s+/).map(e => e.replace(/[(),]/g, '')))
        .filter(item => !/\s+/.test(item))
  return arr2
}

let areArraysEqual = (a1, a2) => a1.length == a2.length && a1.every((v, i) => v === a2[i])
let getIndexOfMaximum = a => a.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0)

function stringToAsciiArray (string) {
  let asciiKeys = []
  for (var i = 0; i < string.length; i++) { asciiKeys.push(string[i].charCodeAt(0)) }
  return asciiKeys
}
function toHexString (byteArray) {
  return Array.from(byteArray, function (byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2)
  }).join('')
}

function gcd (a, b) {
  if (b === 0) { return a } else { return gcd(b, a % b) }
}

// super duper juggling algorithm
function rightRotate (arr, d) {
  let j, k, t, t2,
    n = arr.length,
    _gcd = gcd(d, n),
    jumps = n / _gcd
  for (let i = 0; i < _gcd; i++) {
    t = arr[i]
    for (let z = i, j = 0;
            j <= jumps;
            j++, z = (z + d) % n) {
      t2 = arr[z]
      arr[z] = t
      t = t2

          // info(arr+"    "+t+" "+t2+" "+z+" "+j);
    }
  }
  return arr
}

function number2Binary (number, width = 32) {
  let out = number.toString(2).padStart(32, '0')
  return out
}

// ===================== Solution functions

/*

snd X plays a sound with a frequency equal to the value of X.
set X Y sets register X to the value of Y.
add X Y increases register X by the value of Y.
mul X Y sets register X to the result of multiplying the value contained in register X by the value of Y.
mod X Y sets register X to the remainder of dividing the value contained in register X by the value of Y (that is, it sets X to the result of X modulo Y).
rcv X recovers the frequency of the last sound played, but only when the value of X is not zero. (If it is zero, the command does nothing.)
jgz X Y jumps with an offset of the value of Y, but only if the value of X is greater than zero. (An offset of 2 skips the next instruction, an offset of -1 jumps to the previous instruction, and so on.)

*/
function getV (registers, key) {
  let out
  if (isNaN(key)) {
    out = registers[key] = registers[key] === undefined ? 0 : registers[key]
  } else {
    out = key
  }
  return out
}

function snd (registers, p) { registers['outqueue'].push(getV(registers, p[0])) }
function set (registers, p) { registers[ p[0] ] = getV(registers, p[1]) }
function add (registers, p) { registers[p[0]] = getV(registers, p[0]) + getV(registers, p[1]) }
function mul (registers, p) { registers[p[0]] = getV(registers, p[0]) * getV(registers, p[1]) }
function mod (registers, p) { registers[p[0]] = getV(registers, p[0]) % getV(registers, p[1]) }
function rcv (registers, p) { registers[p[0]] = registers['inqueue'].pop() }
function jgz (registers, p) {
  if (getV(registers, p[0]) > 0) {
    registers['pointer'] = getV(registers, 'pointer') + getV(registers, p[1]) - 1
  }
}

function prepareInstructions (d2arr) {
  let instr = []
  d2arr.forEach(line => {
    switch (line[0]) {
      case 'snd': instr.push([ snd, line.slice(1) ]); break
      case 'set': instr.push([ set, line.slice(1) ]); break
      case 'add': instr.push([ add, line.slice(1) ]); break
      case 'mul': instr.push([ mul, line.slice(1) ]); break
      case 'mod': instr.push([ mod, line.slice(1) ]); break
      case 'rcv': instr.push([ rcv, line.slice(1) ]); break
      case 'jgz': instr.push([ jgz, line.slice(1) ]); break
    }
  })
  return instr
}

function loopOnInstructions (instructions, registers) {
  let instructionsLength = instructions.length
  for (let i = 0, ci = getV(registers, 'pointer');
    (ci = getV(registers, 'pointer')) > -1 && ci < instructionsLength;
    ci = registers['pointer'] = registers['pointer'] + 1, i++
    ) {
    let command = instructions[ci]
    // info(i + 'inside loop. command: ' + command); inspect(registers)
    // info('command == rcv  ' + (command === rcv))
    // info("registers['inqueue'].length == 0  " + (registers['inqueue'].length == 0))
    if (command[0] === rcv && registers['inqueue'].length == 0) return registers['outqueue']
    else command[0](registers, command[1])
  }
  return registers['outqueue']
}

function calculate2 (file, endCount) {
  file = convertFileToWords2dArray(file)
  file = file.map(line => line.map(e => /-?\d+/.test(e) ? parseInt(e) : e))
  let instructions = prepareInstructions(file)

  let registers0 = { 'inqueue': [], 'outqueue': [], 'p': 0 }
  let registers1 = { 'inqueue': [], 'outqueue': [], 'p': 1 }

  let outCount = 0, out0, out1, i = 0

  do {
    i++
    // info(i + ' ======================================================================')
    // info('b. program 0:'); inspect(registers0)
    // info('b. program 1:'); inspect(registers1)
    out0 = loopOnInstructions(instructions, registers0)
    registers1['inqueue'] = out0.reverse()
    out1 = loopOnInstructions(instructions, registers1)
    registers0['inqueue'] = out1.reverse()
    outCount += out1.length

    // info('e. program 0:'); inspect(registers0)
    // info('e. program 1:'); inspect(registers1)
  } while ((out0.length > 0 || out1.length > 0))
  // } while ((out0.length > 0 || out1.length > 0) && i < 5)

  // info('registers0 '); inspect(registers0)
  // info('registers1 '); inspect(registers1)
  return outCount
}

function test () {
  // verify(4, calculate1, loadFile('test1.txt'))
  // console.log('test of 1 part is finished')
  verify(1, calculate2, loadFile('test1.txt'))
  verify(3, calculate2, loadFile('test2.txt'))
  console.log('test of 2 part is finished')
}

function realTest () {
  verify(7112, calculate2, loadFile('real.txt'))
}

test()
realTest()
