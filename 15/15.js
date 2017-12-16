// ===================== Utilities
const chalk = require('chalk');
const util = require('util');
const error = (text="")=> console.error(chalk.red(text));
const pass = (text="")=> console.info(chalk.green(text));
const info = (text="")=> console.info(chalk.blue(text));
const inspect = (text="",_depth=3)=> info("========\n"+util.inspect(text,{depth:_depth}) + "\n========");
	
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
	let arr = inputFile.split('\n');
	arr = arr.map(l=>l
			.match(/\d+/g).map(n=>parseInt(n)));
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


function number2Binary(number,width=32){
	let out = number.toString(2).padStart(32,"0");
	return out;
}

// ===================== Solution functions

function* numberGenerator(startValue, factor, internalCriteriaFactor=1) {
	info("generator started with init="+startValue+" and factor="+factor);
	let out = startValue;
	while (true) {
	  	out = out*factor;
	  	out = out % 2147483647;
	  	if (out % internalCriteriaFactor ==0){
	  		yield out;	
	  	}
	}
}

function isJudgeEqual(number1,number2){
		number1 = number1 << 16 >>> 16;
		number2 = number2 << 16 >>> 16;
		return number1 == number2;
}

function countPairs(gen1,gen2,pairsAmount=40*1000*1000){
	let count =0;
	for (let i=0;i<pairsAmount;i++){
		let av = gen1.next().value;
		// info(number2Binary(av));
		let bv=gen2.next().value;
		// info(number2Binary(bv));
		count+= isJudgeEqual(av,bv)?1:0;

	}
	return count;
}

function calculate1( file ){
	let ar = convertFileToNumbersArray(file).map(a=>a[0]);
	inspect(ar);
	let gen1 = numberGenerator(ar[0],16807);
	let gen2 = numberGenerator(ar[1],48271);
	return countPairs(gen1,gen2);
}

function calculate2( file ){
	let ar = convertFileToNumbersArray(file).map(a=>a[0]);
	inspect(ar);
	let gen1 = numberGenerator(ar[0],16807, 4);
	let gen2 = numberGenerator(ar[1],48271, 8);

	return countPairs(gen1,gen2, 5*1000*1000);
}
	
function test() {
	verify(588,calculate1,  loadFile("test1.txt") );
	console.log("test of 1 part is finished");
	verify(309,calculate2,  loadFile("test1.txt") );
	console.log("test of 2 part is finished");
}

function realTest(){
	verify(609,calculate1 , loadFile("real.txt") );
	verify(253,calculate2 , loadFile("real.txt") );
}

test();
realTest();

