// ===================== Utilities
const chalk = require('chalk');
const util = require('util');
const error = (text)=> console.error(chalk.red(text));
const pass = (text)=> console.info(chalk.green(text));
const info = (text)=> console.info(chalk.blue(text));
const inspect = (text,_depth=3)=> info("========\n"+util.inspect(text,{depth:_depth}) + "\n========");

function loadFile(fileName){ 
	let fs = require('fs');
	let file = fs.readFileSync( __dirname + '/'+fileName, { encoding: 'utf8'} );
	return file;
}
function toJson(obj){
	return JSON.stringify(obj);
}
function verify(expected,  converter, input){
	let actual, message="";
	if (arguments.length==3){
		 actual = arguments[1](input);
		 message = "Input: " ;
		 let inputMsg=input+"";
			if (inputMsg.length>50) {
				if (inputMsg.length>300) {
					message += "\n"+inputMsg.substring(0,300)+"\n";	
				} else {
					message += "\n"+inputMsg+"\n";	
				}
			} else{
				message += inputMsg+"\n";	
			}		 
	} else if (arguments.length==2){
		 actual = arguments[1]
		 input = actual;
	}

	message += "Expected: "+expected+"\n  Actual: "+actual;

	if (expected===actual){
		pass( message) ;
	}else if ( expected==actual ) {
		error( 'Type Comparison Fail\n'+message ) ;
	} else {
		error( 'Comparison Fail\n'+message ) ;
	}
}

function convertFileToNumbersArray(inputFile){	
	let arr = inputFile.match(/\d+/g)
			.map(e=>parseInt(e));
	return arr;
}

function convertFileToWords2dArray(inputFile){	
	let arr = inputFile.split(/\n/).filter(e=>e.length>0 ) ;
	let arr2 = arr.map(item=> item.split(/\s+/).map(e=>e.replace(/[(),]/g,"")) )
				.filter( item=> !/\s+/.test(item) );
	return arr2;
}

let areArraysEqual = (a1,a2)=>a1.length==a2.length && a1.every((v,i)=> v === a2[i]);
let getIndexOfMaximum = a=>a.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);

function stringToAsciiArray(string){
	asciiKeys = [];
	for (var i = 0; i < string.length; i ++)
	  asciiKeys.push(string[i].charCodeAt(0));
	return asciiKeys;
}
function toHexString(byteArray) {
  return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}
// ===================== Solution functions


// n =  x,  y+1
// s =  x,  y-1
// ne = x+1,y+1
// nw = x-1,y
// se = x+1,y
// sw = x-1,y-1
function makeDeltaFromDirection(string){
	let d = [];
	switch (string) {
		  case 'n':
		  	d = [0,1];
		    break;
		  case 's':
		  	d = [0,-1];
		    break;
		  case 'ne':
		  	d = [+1,+1];
		    break;
		  case 'nw':
		  	d = [-1,0];
		    break;
		  case 'se':
		  	d = [+1,0];
		    break;
		  case 'sw':
		  	d = [-1,-1];
		    break;
		  default:
		  	throw new Error("unrecognized movement: "+string);
		    break;
	}
	return d;
}
function getHexDistance(hex1,hex2){
	let xd = hex1[0]-hex2[0];
	let yd = hex1[1]-hex2[1];
	let td = xd - yd;
	let max = Math.max(Math.abs(xd),Math.abs(yd),Math.abs(td));
	return max;
}
function calculate1( array ){
	let currentCoordinates = [0,0];
	for (let command of array){
		let d = makeDeltaFromDirection(command);
		currentCoordinates[0]=currentCoordinates[0]+d[0];
		currentCoordinates[1]=currentCoordinates[1]+d[1];
	}
	let d = getHexDistance([0,0] , currentCoordinates);
	return d;
}
function calculate2( array ){
	let currentCoordinates = [0,0];
	let maxHistoryD=0,currentD=0;
	for (let command of array){
		let d = makeDeltaFromDirection(command);
		currentCoordinates[0]=currentCoordinates[0]+d[0];
		currentCoordinates[1]=currentCoordinates[1]+d[1];
		currentD = getHexDistance([0,0] , currentCoordinates) ;
		maxHistoryD = Math.max(maxHistoryD,currentD);
	}
	return maxHistoryD;
}


function test() {
	verify(3,calculate1,"ne,ne,ne".split(','));
	verify(0,calculate1,"ne,ne,sw,sw".split(','));
	verify(2,calculate1,"ne,ne,s,s".split(','));
	verify(3,calculate1,"se,sw,se,sw,sw".split(','));
	console.log("test of 1 part is finished");
	verify(2,calculate2,"ne,ne,sw,sw".split(','));
	console.log("test of 2 part is finished");
}

function realTest(){
	verify(761,calculate1 , loadFile("real.txt").split(',') );
	verify(1542,calculate2 , loadFile("real.txt").split(',') );
}

test();
realTest();

