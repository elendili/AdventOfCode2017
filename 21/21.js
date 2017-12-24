// ===================== Utilities
const chalk = require('chalk')
const util = require('util')
const error = (text = '') => console.error(chalk.red(text))
const pass = (text = '') => console.info(chalk.green(text))
const info = (text = '') => console.info(chalk.blue(text))
const lineNumber = () => (new Error().stack.split('\n')[3].split(':')[1])
const inspect = (text = '', _depth = 3) =>
            info('======== ' + lineNumber() + ' ========\n' + util.inspect(text, {depth: _depth}) + '\n========')

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

function loadRules (file) {
  // inspect(file)
  let arr = file.split('\n')
        .map(line => line
          .split(/[=>\s]+/)
          .filter(e => e.length > 0)
          .map(e => e.split('/').map(k => k.split('')))
    )
  // inspect(arr)
  return arr
}

function dividePattern (pattern, divisor) {
  if (typeof pattern === 'string') {
    pattern = pattern.split('\n')
  }
  let char2dArray = pattern.map(l => l.split(''))
  // inspect(char2dArray)
  let resultArray = []
  for (let i = 0; i < pattern.length / divisor; i++) {
    for (let j = 0; j < pattern.length / divisor; j++) {
      let segment = []
      for (let k = 0; k < divisor; k++) {
        for (let z = 0; z < divisor; z++) {
          let c = char2dArray[i * divisor + k][j * divisor + z]
          if (segment[k] == undefined) {
            segment[k] = []
          }
          segment[k][z] = c
          // inspect(segment)
        }
      }
      resultArray.push(segment)
    }
  }
  return resultArray
}

function countPixels (segment) {
  let out = (segment + '').match(/#/gi)
  return out === null ? 0 : out.length
}

function findRule (segment, rules) {
  // inspect(rules)
  rules = rules.filter(rule => rule[0].length === segment.length)
              .filter(rule => countPixels(rule[0]) === countPixels(segment))
  let segmentString = twoDArToString(segment)
  // info('--------')
  // rules.forEach((r, i) => info(i + '\n' + twoDArToString(r[0]) + '\n'))
  // find exact match
  for (let i = 0; i < rules.length; i++) {
    let maskString = twoDArToString(rules[i][0])
    if (maskString === segmentString) {
      return rules[i]
    }
  }

  // find skewed match
  let toCompare = []
  for (let i = 0; i < rules.length; i++) {
    let mask = rules[i][0]
    toCompare = []
    toCompare.push(twoDArToString(mask))
    toCompare.push(twoDArToString(rotate2dArrayClockWise(mask)))
    toCompare.push(twoDArToString(flip2dArrayVertical(rotate2dArrayClockWise(mask))))
    toCompare.push(twoDArToString(rotate2dArrayOn180Degree(mask)))
    toCompare.push(twoDArToString(rotate2dArrayCounterClockWise(mask)))
    toCompare.push(twoDArToString(flip2dArrayVertical(rotate2dArrayCounterClockWise(mask))))
    toCompare.push(twoDArToString(flip2dArrayHorizontal(mask)))
    toCompare.push(twoDArToString(flip2dArrayVertical(mask)))
    toCompare.push(twoDArToString(flip2dArrayHorizontal(flip2dArrayVertical(mask))))

    if (toCompare.indexOf(segmentString) > -1) {
      return rules[i]
    }
    if (i == 8 && segmentString === twoDArToString([ ['#', '#', '#'], ['#', '.', '.'], ['.', '#', '.'] ])) {
      info(segmentString)
      toCompare.forEach(e => info('\n' + e))
    }
  }
  // info(segmentString)
  // toCompare.forEach(e => info('\n' + e))
  throw new Error('no rule found ')
}
function applyRules (segments, rules) {
  let out = []
  for (let segment of segments) {
    let rule = findRule(segment, rules)
    // info('found rule: ' + rule)
    // inspect(rule)
    out.push(rule[1])
  }
  // inspect(out)
  return out
}

function uniteSegments (segments) {
  var width = Math.sqrt(segments.length)
  var out = []
  let segSize = segments[0][0].length
  // segments = segments.map(e=>)
  for (let i = 0; i < segments.length; i++) {
    let w = i % width // width in segments
    let h = Math.floor(i / width) // heigth in segments
    let segment = segments[i]
    for (let l = 0; l < segment.length; l++) {
      let line = segment[l]
      for (let c = 0; c < line.length; c++) {
        let ch = line[c]
        let hindex = h * segSize + l

        // inspect(hindex)
        if (out[hindex] == undefined) {
          out[hindex] = []
        }
        let windex = w * segSize + c
        out[hindex][windex] = ch
      }
    }
  }
  // inspect(out)
  out = out.map(l => l.join(''))
  // info(out)
  return out
}

var startPattern = [ '.#.', '..#', '###' ]

function calculate1 (file, iterations) {
  var rules = loadRules(file)
  var pattern = startPattern
  var segments
  for (let i = 0; i < iterations; i++) {
    if (pattern.length % 2 == 0) {
      segments = dividePattern(pattern, 2)
    } else if (pattern.length % 3 == 0) {
      segments = dividePattern(pattern, 3)
    }
    // inspect(segments)
    segments = applyRules(segments, rules)
    pattern = uniteSegments(segments)
    info(i)
  }
  inspect(pattern)
  // info(twoDArToString(pattern))
  let out = countPixels(pattern)
  return out
}

function calculate2 (file) {
}

function test () {
  verify(12, calculate1, loadFile('test1.txt'), 2)
  console.log('test of 1 part is finished')
  // verify(1, calculate2, loadFile('test2.txt'))
  // console.log('test of 2 part is finished')
}

function realTest () {
  verify(139, calculate1, loadFile('real.txt'), 5)
  verify(1857134, calculate1, loadFile('real.txt'), 18)
}

test()
realTest()
