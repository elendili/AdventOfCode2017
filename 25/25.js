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
  let arr2 = arr.map(item => item.split(/\s+/).map(e => e.replace(/[(),]/g, '')).filter(e => e.length > 0))
        .filter(item => !/\s+/.test(item))
  return arr2
}

function convertFileToChar2dArray (inputFile) {
  let arr = inputFile.split(/\n/).filter(e => e.length > 0)
  let arr2 = arr.map(line => line.split('').filter(e => e.length > 0))
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
Begin in state A.
Perform a diagnostic checksum after 6 steps.

In state A:
  If the current value is 0:
    - Write the value 1.
    - Move one slot to the right.
    - Continue with state B.
  If the current value is 1:
    - Write the value 0.
    - Move one slot to the left.
    - Continue with state B.

In state B:
  If the current value is 0:
    - Write the value 1.
    - Move one slot to the left.
    - Continue with state A.
  If the current value is 1:
    - Write the value 1.
    - Move one slot to the right.
    - Continue with state A.
    */

    // A:[ {write:1,move:1,nextState:B} , {write:0,move:-1,nextState:B}
function loadStatesRules (file) {
  let lines = file.split('\n').filter(l => l.length > 0)
  let stateDescriptions = {}
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]
    if (/In state/.test(line)) {
      let stateDescription = {state: 'X', zero: {}, one: {}}
      stateDescription.state = line.replace(/In state /g, '').replace(/\W/g, '')
      line = lines[i + 2]
      stateDescription.zero.writeValue = parseInt(line.replace(/.*Write the value /g, '').replace(/\W/g, ''))
      line = lines[i + 3]
      stateDescription.zero.direction = /.*right.*/.test(line) ? 1 : -1
      line = lines[i + 4]
      stateDescription.zero.nextState = line.replace(/.*Continue with state /g, '').replace(/\W/g, '')

      line = lines[i + 6]
      stateDescription.one.writeValue = parseInt(line.replace(/.*Write the value /g, '').replace(/\W/g, ''))
      line = lines[i + 7]
      stateDescription.one.direction = /.*right.*/.test(line) ? 1 : -1
      line = lines[i + 8]
      stateDescription.one.nextState = line.replace(/.*Continue with state /g, '').replace(/\W/g, '')

      stateDescriptions[stateDescription.state] = stateDescription
    }
  }
  return stateDescriptions
}
function getStringTape (tape, machine) {
  let out = tape.map((v, i, a) => {
    if (machine.pointer === i) { return '[' + v + ']' } else { return ' ' + v + ' ' }
  })
  out = out.join('')
  out = out + '  state: ' + machine.state
  return out
}

function expandTape (tape, machine) {
  if (machine.pointer < 0) {
    tape.unshift(0)
    machine.pointer = 0
  }
  if (machine.pointer >= tape.length) {
    tape.push(0)
  }
}

function calculate1 (file, iterations) {
  let stateRules = loadStatesRules(file)
  // inspect(stateRules)
  let machine = {state: 'A', pointer: 0}
  let tape = [0]
  // info('0. ' + getStringTape(tape, machine))

  for (let step = 1; step <= iterations; step++) {
    let currentStateDescr = stateRules[machine.state]
    let condition
    if (tape[machine.pointer] == 0) {
      condition = currentStateDescr.zero
    } else {
      condition = currentStateDescr.one
    }
    tape[machine.pointer] = condition.writeValue
    machine.pointer = machine.pointer + condition.direction
    machine.state = condition.nextState

    expandTape(tape, machine)
    if (step % 1217359 == 0) info(step + '. ' + getStringTape(tape, machine))
  }

  let checksum = tape.reduce((a, v) => a + v, 0)
  return checksum
}

function calculate2 (file) {
}

function test1 () {
  verify(3, calculate1, loadFile('test1.txt'), 6)
}

function test2 () {
  verify(19, calculate2, loadFile('test1.txt'))
}

function real1 () {
  verify(2870, calculate1, loadFile('real.txt'), 12173597)
}

function real2 () {
  verify(1673, calculate2, loadFile('real.txt'))
}

// test1()
// test2()
real1()
// real2()
