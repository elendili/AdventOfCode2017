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
function loadCharMatrix (file) {
  var out = file.split('\n').map(line => line.split(''))
  return out
}

function isInfected (matrix, p) {
  let value = matrix[p.y][p.x]
  return value === '#'
}

const directions = [ {y: -1, x: 0}, {y: 0, x: +1}, {y: +1, x: 0}, {y: 0, x: -1} ]

const turnRight = (currentDirection) => {
  let di = directions.findIndex(e => e.x === currentDirection.x && e.y === currentDirection.y) + 1
  di = di % directions.length
  return directions[ di ]
}

const turnLeft = (currentDirection) => {
  let di = directions.findIndex(e => e.x === currentDirection.x && e.y === currentDirection.y) - 1
  di = di < 0 ? 3 : di
  return directions[ di ]
}

const goBack = (currentDirection) => {
  currentDirection = Object.assign({}, currentDirection) // clone
  let x = currentDirection.x
  let y = currentDirection.y
  currentDirection.x = x != 0 ? x * (-1) : x
  currentDirection.y = y != 0 ? y * (-1) : y
  return currentDirection
}

const printMatrix = (matrix, pos) => info(getStringMatrixWithVirus(matrix, pos))

function getStringMatrixWithVirus (matrix, pos) {
  let out = ''
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[0].length; x++) {
      let c = matrix[y][x]
      if (pos.x === x && pos.y === y) {
        out += '[' + c + ']'
      } else {
        out += ' ' + c + ' '
      }
    }
    out += '\n'
  }
  return out
}
function expandMatrix (matrix, pos) {
  var width = matrix[0].length
  var height = matrix.length
  if (pos.x < 0) {
    matrix.forEach(l => l.unshift('.'))
    pos.x = 0
  }
  if (pos.x >= width) {
    matrix.forEach(l => l.push('.'))
  }
  if (pos.y < 0) {
    let newLine = Array.from('.'.repeat(width))
    matrix.unshift(newLine)
    pos.y = 0
  }
  if (pos.y >= height) {
    let newLine = Array.from('.'.repeat(width))
    matrix.push(newLine)
  }
  return pos
}

function calculate1 (file, iterations) {
  var matrix = loadCharMatrix(file)
  // info(twoDArToString(matrix))
  let center = {y: Math.floor(matrix.length / 2), x: Math.floor(matrix.length / 2)}
  let currentDirection = {y: -1, x: 0}
  let infectionAction = 0
  let pos = center
  for (let i = 0; i < iterations; i++) {
    // choose direction
    if (isInfected(matrix, pos)) {
      // turn right
      currentDirection = turnRight(currentDirection)
      // info('should be right')
      // inspect(currentDirection)
      // clean
      matrix[pos.y][pos.x] = '.'
    } else {
      // turn left
      currentDirection = turnLeft(currentDirection)
      // info('should be left')
      // inspect(currentDirection)
      // infect
      matrix[pos.y][pos.x] = '#'
      infectionAction += 1
    }
    pos.y = pos.y + currentDirection.y
    pos.x = pos.x + currentDirection.x
    pos = expandMatrix(matrix, pos)
  }
  return infectionAction
}

function calculate2 (file, iterations) {
  var matrix = loadCharMatrix(file)
  // info(twoDArToString(matrix))
  let center = {y: Math.floor(matrix.length / 2), x: Math.floor(matrix.length / 2)}
  let currentDirection = {y: -1, x: 0}
  let infectionAction = 0
  let pos = center

// Clean nodes become weakened.
// Weakened nodes become infected.
// Infected nodes become flagged.
// Flagged nodes become clean.
// If it is clean, it turns left.
// If it is weakened, it does not turn, and will continue moving in the same direction.
// If it is infected, it turns right.
// If it is flagged, it reverses direction, and will go back the way it came.
  for (let i = 0; i < iterations; i++) {
    // inspect(currentDirection)
    // choose direction
    let c = matrix[pos.y][pos.x]
    if (i % 1000000 == 0) info(i + '. ' + infectionAction)
    switch (c) {
      case '.':
        currentDirection = turnLeft(currentDirection)
        matrix[pos.y][pos.x] = 'W'
        break
      case 'W':
        matrix[pos.y][pos.x] = '#'
        infectionAction += 1
        break
      case '#':
        currentDirection = turnRight(currentDirection)
        matrix[pos.y][pos.x] = 'F'
        break
      case 'F':
        currentDirection = goBack(currentDirection)
        matrix[pos.y][pos.x] = '.'
        break
      default: throw 'unknown symbol ' + c
        break
    }

    pos.y = pos.y + currentDirection.y
    pos.x = pos.x + currentDirection.x
    pos = expandMatrix(matrix, pos)

    // printMatrix(matrix, pos)
  }
  return infectionAction
}

function test1 () {
  verify(41, calculate1, loadFile('test1.txt'), 70)
  verify(5587, calculate1, loadFile('test1.txt'), 10000)
  console.log('test of 1 part is finished')
}
function test2 () {
  verify(26, calculate2, loadFile('test1.txt'), 100)
  verify(2511944, calculate2, loadFile('test1.txt'), 10000000)
  console.log('test of 2 part is finished')
}

function real1 () {
  verify(5404, calculate1, loadFile('real.txt'), 10000)
}
function real2 () {
  verify(2511672, calculate2, loadFile('real.txt'), 10000000)
}

test1()
test2()
real1()
real2()
