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
			if (input.length>50) {
				if (input.length>300) {
					message += "\n"+input.substring(0,300)+"\n";	
				} else {
					message += "\n"+input+"\n";	
				}
			} else{
				message += input+"\n";	
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

function slice(array, chunk, offset) {
    var subarray = [];
    for (var i = 0; i<chunk; i++) {
        var ind = (offset + i) % array.length;
        subarray.push(array[ind]);
    }

    return subarray;
}


function reverseChunk(array, chunk, offset) {
    let len=Math.floor(chunk/2);
    for (var i = 0; i<len; i++) {
        var indS = (offset + i) % array.length;
        var indE = (offset + (chunk -1) - i) % array.length;
        var s = array[indS];
        array[indS] = array[indE];
        array[indE] = s;
    }
    return array;
}

function calculate1( sequence,lengths ){
	lengths = convertFileToNumbersArray(lengths);
	let currentPosition=0;
	let skipSize =0;
	for (length of lengths){
		reverseChunk(sequence,length,currentPosition);
		currentPosition=(currentPosition+length+skipSize)% sequence.length;
		skipSize++;
	}
	let result = sequence[0]*sequence[1];
	return result;
}

function calculate2(sequence,lengths){
	lengths = lengths.trim();
	lengths = stringToAsciiArray(lengths);
	lengths = lengths.concat(	[17, 31, 73, 47, 23] );

	let currentPosition=0;
	let skipSize =0;
	for (let round=0;round<64;round++){
		for (length of lengths){
			reverseChunk(sequence,length,currentPosition);
			currentPosition=(currentPosition+length+skipSize)% sequence.length;
			skipSize++;
		}
	}
	// reduce
	let densedHash = [];
	for (let blockIndex=0; blockIndex<256;blockIndex+=16){
		let subarray = sequence.slice(blockIndex,blockIndex+16);
		let xored = 0;
		for (let z of subarray){
			xored = xored ^ z;
		}
		densedHash.push(xored);
	}
	let result = toHexString(densedHash);
	if (result.length!=32) { throw new Error("wrong length");}
	return result;
}

function test() {
	verify(12,calculate1([...Array(5).keys()],loadFile("test1.txt")));
	console.log("test of 1 part is finished");
	verify("a2582a3a0e66e6e86e3812dcb672a272",
		calculate2([...Array(256).keys()], "" ));
	
	verify("33efeb34ea91902bb2f59c9920caa6cd",
		calculate2([...Array(256).keys()], "AoC 2017" ));	
	
	verify("3efbe78a8d82f29979031a4aa0b16a9d",
		calculate2([...Array(256).keys()], "1,2,3" ));	
	
	verify("63960835bcdc130f0b66d7ff4f6a5a8e",
		calculate2([...Array(256).keys()], "1,2,4" ));
	console.log("test of 2 part is finished");
}

function realTest(){
	verify(38415,calculate1([...Array(256).keys()],loadFile("real.txt")));
	verify("9de8846431eef262be78f590e39a4848",calculate2([...Array(256).keys()],loadFile("real.txt")));
}

test();
realTest();

