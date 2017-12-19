const day18 = require('./18-2.js')
const info = day18.info
const verify = day18.verify
const calculate1 = day18.calculate1

const longComputation = () => {
  let sum = 0
  for (let i = 0; i < 1000; i++) {
    sum += i
  };
  return sum
}

process.on('message', (msg) => {
  const sum = longComputation()
  process.send(sum)
})

let registers = { 'queue': [], 'p': 1 }
console.log(require('util').inspect(day18))
console.log(typeof day18.loadFile)
console.log(typeof loadFile)
verify(1226, calculate1, day18.loadFile('test2.txt'))
