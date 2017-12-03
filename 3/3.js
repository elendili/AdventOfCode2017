const chalk = require('chalk');
const error = (text)=> console.error(chalk.red(text));
const pass = (text)=> console.info(chalk.green(text));
const info = (text)=> console.info(chalk.blue(text));


function toJson(obj){
	return JSON.stringify(obj);
}
function verify(expected,  converter, input){
	let actual = converter(input);
	let message = "Input: " ;
	if (input.length>50) {
		message += "\n"+input+"\n";	
	}else{
		message += input+"\n";	
	}
	message += "Expected: "+expected+", actual: "+actual;

	if (expected!==actual){
		error( 'Comparison Fail\n'+message ) ;
	}else{
		pass( message) ;
	}
}

function getCoords(number){
	let c = {'x':0,'y':0};
	let d = [ 0, 0 ];
	for (let i=2; i<=number;i++){
		if (c['x']>0){
			if (c['x']==c['y']){
				d=[-1,0]; // left
			} else if (c['x']== - (c['y']-1) ){
				d=[0,1]; // up
			}
		} else {
			if (c['x']==c['y']){
				d=[1,0];// right
			} else if ( c['x']== - (c['y'])) {
				d=[0,-1];// down
			}
		}
		c['x']+=d[0];
		c['y']+=d[1];
	}
	return c;
}
function getSpiralMatrixFilledWithSums(number){
	let c = [0,0];
	let cn = 1;
	let map = Object.create(null);
	map[c.slice(0)] = cn;
	
	while (cn<=number) {
		if (c[0]>0){
			if (c[0]==c[1]){
				d=[-1,0]; // left
			} else if (c[0] == - (c[1]-1) ){
				d=[0,1]; // up
			}
		} else {
			if (c[0]==c[1]){
				d=[1,0];// right
			} else if ( c[0] == - (c[1])) {
				d=[0,-1];// down
			}
		}
		c = [ c[0]+d[0], c[1]+d[1] ];

		cn = getSumOfNearest(c,map);	
		map[c.slice(0)]= cn;
		
		// pass('====');
		// info(toJson(map));
		
	}
	return map;
}

function getSumOfNearest(c, map){
	let sum=0;
	let value=0;
	for ( let x = c[0]-1; x<=c[0]+1; x++ ){
	for ( let y = c[1]-1; y<=c[1]+1; y++ ){
		value = map[ [x,y].slice(0) ] ;
//		info(toJson(map));
		if (typeof value === "number") {
			sum+= value;
		}
	}}
	return sum;
}

function calculate1( number ){
	let c = getCoords(number);
	result = Math.abs (c['x']) + Math.abs (c['y']);
	return result;
}

function calculate2(number){
	let matrix = getSpiralMatrixFilledWithSums(number);
	for (lastProperty in matrix);
	return matrix[lastProperty];
}

function test() {
	verify(0,calculate1, 1);
	verify(3,calculate1, 12);
	verify(2,calculate1, 23);
	verify(31,calculate1, 1024);
	console.log("test of 1 part is finished");
	verify(54,calculate2, 26 );
	verify(122,calculate2, 59 );
	verify(362,calculate2, 351 );
	console.log("test of 2 part is finished");
}

function realTest(){
	verify(552,calculate1, 325489);
	verify(330785,calculate2, 325489  );
}
// http://adventofcode.com/2017/day/1


test();
realTest();
