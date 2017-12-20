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

function fileToNumbers2dArr (file) {
  let out = file.split('\n').filter(e => e.length > 0)
          .map(line => line.split(/[^-0-9]/).filter(e => e.length > 0)
          .map(c => parseInt(c))
          )
  return out
}
// ===================== Solution functions
function applyMove (line) {
  if (line.length !== 9) throw 'numbers count is wrong ' + line
  // apply acceleration
  line[3] += line[6] // x acceleration to velocity
  line[4] += line[7] // y acceleration to velocity
  line[5] += line[8] // z acceleration to velocity
  // apply velocity
  line[0] += line[3] // x velocity to position
  line[1] += line[4] // y velocity to position
  line[2] += line[5] // z velocity to position
}

function cleanCollided (arr) {
  let removed = 0
  for (let i = 0; i < arr.length - 1; i++) {
    let p1 = arr[i]

    let listToDie = [i]
    loop2: // make list to kill
    for (let j = i + 1; j < arr.length; j++) {
      let p2 = arr[j]
      if (p1[0] === p2[0] && p1[1] === p2[1] && p1[2] === p2[2]) {
        listToDie.push(j)
      }
    }
    // kill them all
    if (listToDie.length > 1) {
      listToDie.reverse().forEach(z => arr.splice(z, 1))
      removed += listToDie.length
      i--
    }
  }
  return removed
}

function distanceToZero (line) {
  let d = Math.abs(line[0])
  d += Math.abs(line[1])
  d += Math.abs(line[2])
  return d
}

function findClosestParticle (arr) {
  let minDTZ = distanceToZero(arr[0])
  let closestParticle = 0
  for (let i = 1; i < arr.length; i++) {
    let dtc = distanceToZero(arr[i])
    if (dtc < minDTZ) {
      minDTZ = dtc
      closestParticle = i
    }
  }
  info('minDTZ: ' + minDTZ)
  return closestParticle
}

function calculate1 (file) {
  let arr = fileToNumbers2dArr(file)

  for (let j = 0; j < 1000; j++) {
    for (let i = 0; i < arr.length; i++) {
      applyMove(arr[i])
    }
  }
  let out = findClosestParticle(arr)
  return out
}

function calculate2 (file) {
  let arr = fileToNumbers2dArr(file)

  for (let j = 0; j < 100; j++) {
    for (let i = 0; i < arr.length; i++) {
      applyMove(arr[i])
    }
    let removed = cleanCollided(arr)
    // if (removed > 0) { info('tick ' + j + ', removed ' + removed + ', arr length: ' + arr.length) }
  }
  let finalAmount = arr.length
  return finalAmount
}

function test () {
  verify(0, calculate1, loadFile('test1.txt'))
  console.log('test of 1 part is finished')
  verify(1, calculate2, loadFile('test2.txt'))
  console.log('test of 2 part is finished')
}

function realTest () {
  verify(144, calculate1, loadFile('real.txt'))
  verify(477, calculate2, loadFile('real.txt')) // 485 too high
}

// test()
realTest()
