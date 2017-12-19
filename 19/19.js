// ===================== Utilities
const chalk = require('chalk')
const util = require('util')
const error = (text = '') => console.error(chalk.red(text))
const pass = (text = '') => console.info(chalk.green(text))
const info = (text = '') => console.info(chalk.blue(text))
const inspect = (text = '', _depth = 3) => info('========\n' + util.inspect(text, {depth: _depth}) + '\n========')

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

// ===================== Solution functions

function followPath (ar2d) {
  // search input
  let x = ar2d[0].indexOf('|')
  let y = 0
  let dx = 0
  let dy = 1
  let stop = false
  let path = ''
  let steps = 0
  let char
  while (!stop) {
    x = x + dx
    y = y + dy
    steps += 1
    // info('x:' + x + ' y:' + y + ' dx:' + dx + ' dy:' + dy)
    char = ar2d[y][x]
    // info('char:' + char)
    if (/[A-Z]/.test(char)) {
      path += char
    } else if (char == '+') {
      if (dx == 0) {
        if (/[A-Z]|\-/.test(ar2d[y][x - 1])) { dx = -1; dy = 0 } else if (/[A-Z]|\-/.test(ar2d[y][x + 1])) { dx = 1; dy = 0 }
      } else if (dy == 0) {
        if (/[A-Z]|\|/.test(ar2d[y - 1][x])) { dx = 0; dy = -1 } else if (/[A-Z]|\|/.test(ar2d[y + 1][x])) { dx = 0; dy = 1 }
      }
    } else if (char == ' ') { stop = true }
  }
  return {path: path, steps: steps}
}
function calculate1 (file) {
  let ar2d = convertFileToChar2dArray(file)
  let out = followPath(ar2d)['path']
  return out
}

function calculate2 (file) {
  let ar2d = convertFileToChar2dArray(file)
  let out = followPath(ar2d)['steps']
  return out
}

function test () {
  verify('ABCDEF', calculate1, loadFile('test1.txt'))
  console.log('test of 1 part is finished')
  verify(38, calculate2, loadFile('test1.txt'))
  console.log('test of 2 part is finished')
}

function realTest () {
  verify('RUEDAHWKSM', calculate1, loadFile('real.txt'))
  verify(17264, calculate2, loadFile('real.txt'))
}

test()
realTest()
