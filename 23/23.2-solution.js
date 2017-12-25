let h = 0
for (let b = 106700; b <= 123700; b += 17) {
  let f = 1
  for (let d = 2; d < b; d++) {
    // console.log('loop 2 d=:' + d)
    if ((b % d) === 0) {
      f = 0
      // console.log('loop 2 b=:' + b + ', d=' + d)
      // break
    }
    // for (let e = 2; e !== b; e++) {     // inner loop replace
    //   console.log('loop 3')
    //   if (d * e == b) { f = 0 }    // with mod instr
    // }
  }
  if (f == 0) {
    h += 1
    // console.log('h=' + h)
  }
}
console.log('final h=' + h)

// 905 is right solution
