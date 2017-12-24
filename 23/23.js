// ===================== Utilities
const chalk = require('chalk')
const util = require('util')
const error = (text = '') => console.error(chalk.red(text))
const pass = (text = '') => console.info(chalk.green(text))
const info = (text = '') => console.info(chalk.blue(text))
const lineNumber = () => (new Error().stack.split('\n')[3].split(':')[1])
const inspect = (text = '', _depth = 3) =>
            info('======== ' + lineNumber() + ' ========\n' + util.inspect(text, {depth: _depth}) + '\n=====================')

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

function convertFileToChar2dArray (inputFile) {
  let arr = inputFile.split(/\n/).filter(e => e.length > 0)
  let arr2 = arr.map(line => line.split(''))
  return arr2
}
let areArraysEqual = (a1, a2) => a1.length == a2.length && a1.every((v, i) => v === a2[i])
let getIndexOfMaximum = a => a.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0)

function stringToAsciiArray (string) {
  asciiKeys = []
  for (var i = 0; i < string.length; i++) { asciiKeys.push(string[i].charCodeAt(0)) }
  return asciiKeys
}
function toHexString (byteArray) {
  return Array.from(byteArray, function (byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2)
  }).join('')
}

function gcd (a, b) {
  if (b == 0) { return a } else { return gcd(b, a % b) }
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

function fileToNumbers2dArr (file) {
  let out = file.split('\n').filter(e => e.length > 0)
          .map(line => line.split(/[^-0-9]/).filter(e => e.length > 0)
          .map(c => parseInt(c))
          )
  return out
}

function twoDArToString (ar) {
  let maxLength = 0
  ar = ar.map(l => l.map(c => { let oc = '' + c; maxLength = Math.max(oc.length, maxLength); return oc }))
  ar = ar.map(l => l.map(c => c.padStart(maxLength, ' ')).join('')).join('\n')
  return ar
}

function rotate2dAr (arr2) {
  let out = []
  let n = arr2.length
  let latest = n - 1
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (out[i] == undefined) { out[i] = [] }
        // c = floor(s/2)
        // c = latest/2
        // y,x
        // rotate +90
        // 0,0 (in 4) -> 0-1.5,0-1.5= Max(abs(-1.5)) = 1.5
        // 0,1 (in 4) -> 0-1.5,1-1.5=Max(|-1.5|,|-0.5|) = 1.5
        // 0,2 (in 4) -> 0-1.5,2-1.5=Max(|-1.5|,|0.5|) = 1.5
        // 0,3 (in 4) -> 0-1.5,3-1.5=Max(|-1.5|,|1.5|) = 1.5
        // 2,3 (in 4) -> 2-1.5,3-1.5=Max(|-0.5|,|1.5|) = 1.5

        // 1,1 (in 4) -> 1-1.5,1-1.5=Max(|-0.5|,|-0.5|) = 0.5
        // 2,2 (in 4) -> 2-1.5,2-1.5=Max(|0.5|,|0.5|) = 0.5
        // 1,2 (in 4) -> 1-1.5,2-1.5=Max(|-0.5|,|0.5|) = 0.5

        // 1,1 (in 3) -> 1-1,1-1 => 0
        // 2,2 (in 3) -> 2-1,2-1 => 1
        // 0,2 (in 3) -> 0-1,2-1 => 1

        // c = (s-1)/2
        // level = max(abs(x-c),abs(y-c))

      // out[i][j] = arr2[j][latest - i] // rotate -90
      // out[i][j] = arr2[latest - j][i] // rotate +90
      // out[i][j] = arr2[latest - i][latest - j] // rotate +180
      // out[i][j] = arr2[Math.abs(j - latest)][i] // rotate +90
      // out[i][j] = arr2[Math.abs(i - latest)][Math.abs(j - latest)] // rotate +180

      // out[i][j] = arr2[latest - j][latest - i ] // vertical flip and rotate + 90
      // out[i][j] = arr2[j][i] // transpose
      // out[i][j] = arr2[i][latest - j] // flip on vertical axis
      // out[i][j] = arr2[latest - i][j] // flip on horizontal axis

      // out = arr2[0].map((c, i) => arr2.map(row => row[i])) // transpose
    }
  }
  return out
}

function transpose2dArray (arr2) {
  let out = arr2[0].map((c, i) => arr2.map(row => row[i])).slice(0).reverse() // transpose
  return out
}
function rotate2dArrayClockWise (arr2) {
  let out = arr2[0].map((c, i) => arr2.map(row => row[i]).slice(0).reverse()) // +90
  return out
}

function rotate2dArrayOn180Degree (arr2) {
  let latest = arr2.length - 1
  let out = arr2[0].map((c, i) => arr2[latest - i].slice(0).reverse()) // +180 rotate
  return out
}
function rotate2dArrayCounterClockWise (arr2) {
  let latest = arr2.length - 1
  let out = arr2[0].map((c, i) => arr2.map(row => row[latest - i])) // -90
  return out
}

function flip2dArrayVertical (arr2) {
  let out = arr2[0].map((c, i) => arr2[i].slice(0).reverse()) // flip on vertical axis
  return out
}

function flip2dArrayHorizontal (arr2) {
  let latest = arr2.length - 1
  let out = arr2[0].map((c, i) => arr2[latest - i]) // flip on horisontal axis
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

for 23rd day:
set X Y sets register X to the value of Y.
sub X Y decreases register X by the value of Y.
mul X Y sets register X to the result of multiplying the value contained in register X by the value of Y.
jnz X Y jumps with an offset of the value of Y, but only if the value of X is not zero. (An offset of 2 skips the next instruction, an offset of -1 jumps to the previous instruction, and so on.)

*/
function getV (registers, key) {
  let out
  if (isNaN(key)) {
    out = registers[key] = registers[key] == undefined ? 0 : registers[key]
  } else {
    out = key
  }
  return out
}

function snd (registers, p) { registers['lastSound'] = getV(registers, p[0]) }
function set (registers, p) {
  registers[ p[0] ] = getV(registers, p[1])
}
function add (registers, p) { registers[p[0]] = getV(registers, p[0]) + getV(registers, p[1]) }
function sub (registers, p) { registers[p[0]] = getV(registers, p[0]) - getV(registers, p[1]) }
function mul (registers, p) { registers[p[0]] = getV(registers, p[0]) * getV(registers, p[1]) }
function mod (registers, p) { registers[p[0]] = getV(registers, p[0]) % getV(registers, p[1]) }
function rcv (registers, p) { registers['recovery'].push(registers['lastSound']) }
function jnz (registers, p) {
  if (getV(registers, p[0]) != 0) {
    registers['pointer'] = getV(registers, 'pointer') + getV(registers, p[1]) - 1
  }
}

function prepareInstructions (d2arr) {
  let instr = []
  d2arr.forEach(line => {
    switch (line[0]) {
      case 'snd': instr.push([snd, line.slice(1) ]); break
      case 'set': instr.push([set, line.slice(1) ]); break
      case 'add': instr.push([add, line.slice(1) ]); break
      case 'sub': instr.push([sub, line.slice(1) ]); break
      case 'mul': instr.push([mul, line.slice(1) ]); break
      case 'mod': instr.push([mod, line.slice(1) ]); break
      case 'rcv': instr.push([rcv, line.slice(1) ]); break
      case 'jnz': instr.push([jnz, line.slice(1) ]); break
    }
  })
  return instr
}

function calculate1 (file) {
  file = convertFileToWords2dArray(file)
  file = file.map(line => line.map(e => /-?\d+/.test(e) ? parseInt(e) : e))
  let instructions = prepareInstructions(file)
  let instructionsLength = instructions.length
  let registers = {pointer: 0}
  let mulInvoked = 0
  for (let i = 0, ci = registers.pointer;
    ((ci = registers.pointer) > -1) && ci < instructionsLength;
     ci = registers.pointer = registers.pointer + 1, i++
     ) {
    let command = instructions[ci]
    // info(ci)
    // inspect(registers)
    // inspect(command)

    if (command[0] === mul) { mulInvoked++ }
    command[0](registers, command[1])
  }
  return mulInvoked
}

function calculate2 (file, iterations) {
  file = convertFileToWords2dArray(file)
  file = file.map(line => line.map(e => /-?\d+/.test(e) ? parseInt(e) : e))
  let instructions = prepareInstructions(file)
  let instructionsLength = instructions.length
  let registers = {pointer: 0, a: 1}
  for (let i = 0, ci = registers.pointer;
    ((ci = registers.pointer) > -1) && ci < instructionsLength && i < iterations;
     ci = registers.pointer = registers.pointer + 1, i++
     ) {
    let command = instructions[ci]
    info(i + '. line ' + (ci + 1) + ': ' + command[0].name + ' ' + command[1])
    // inspect(registers)
    // inspect(command)

    command[0](registers, command[1])
    if (i % 10000000 == 0) { info(i + '. ' + registers.h); inspect(registers) }
  }
  return registers.h
}

function test1 () {
  verify(41, calculate1, loadFile('test1.txt'))
  verify(5587, calculate1, loadFile('test1.txt'), 10000)
  console.log('test of 1 part is finished')
}
function test2 () {
  verify(26, calculate2, loadFile('test1.txt'), 100)
  verify(2511944, calculate2, loadFile('test1.txt'), 10000000)
  console.log('test of 2 part is finished')
}

function real1 () {
  verify(4225, calculate1, loadFile('real.txt'))
}
function real2 () {
  verify(2511672, calculate2, loadFile('real.txt'), 100)
}

// test1()
// test2()
// real1()
real2()
