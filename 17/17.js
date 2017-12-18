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

function shrinkText(inputMsg){
	let message="";
	if (inputMsg.length>50) {
		if (inputMsg.length>300) {
			message += "\n"+inputMsg.substring(0,300)+"\n";	
		} else {
			message += "\n"+inputMsg+"\n";	
		}
	} else{
		message += inputMsg+"\n";	
	}
	return message;
}
// expected, converter, input...
// expected, actual
function verify(expected,  converter, input) {
	let argArr = Object.values(arguments);
	let actual, message="";
	if (arguments.length>=3){
		 actual = converter.apply(this, argArr.slice(2));
		 message = "Input: " ;
		 argArr.slice(2).forEach(a=>
		 	message+= shrinkText(""+a)+'\n'
		 );
	} else if (arguments.length==2){
		 actual = arguments[1]
		 input = actual;
	}

	message += "Expected: "+expected+"\n  Actual: "+actual;

	if (expected===actual || expected==actual || (""+expected)==(""+actual)){
		pass( message) ;
	}else {
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

function gcd(a,b){
    if (b == 0)
        return a;
    else
        return gcd(b, a % b);
}

// super duper juggling algorithm 
function rightRotate(arr, d) {
    let j, k, t, t2,
    n = arr.length,
    _gcd = gcd(d, n),
    jumps = n/_gcd;
    for (let i = 0; i < _gcd; i++) {

        t = arr[i];
        for (let z=i, j=0; 
        		j<= jumps; 
        		j++, z = (z+d)%n ) {
        	t2=arr[z];
        	arr[z]=t;
        	t=t2;

        	// info(arr+"    "+t+" "+t2+" "+z+" "+j);
        }
    }
    return arr;
}

function number2Binary(number,width=32){
	let out = number.toString(2).padStart(32,"0");
	return out;
}

// ===================== Solution functions

function calculate1( file ){
	let stepsCount = parseInt( file );
	let arr = [0];
	// let endCount = 11;
	let endCount = 2018;
	for (let i=1,ni=0;i<endCount;i++){
		ni = (ni+stepsCount) % arr.length+1;
		// info(ni);
		arr.splice(ni, 0, i);
		// inspect(arr);
	}
	let i2017 = arr.indexOf(2017);
	let iNext = (i2017+1) % arr.length;
	let out = arr[iNext];
	return out
}
function searchValueAfterZeroIndex(stepsCount, endCount){
	let outValue = 0;
	let arrLength=1;
	// let endCount = 11;
	for (let i=1,ni=0;i<endCount;i++){
		if (i%1000000==0) info(i);
		ni = (ni+stepsCount) % arrLength +1;
		if (ni==1) outValue = i;
		arrLength +=1;
	}
	return outValue;
}

// 50000000
function calculate2( file, endCount ){
	let stepsCount = parseInt( file );
	return searchValueAfterZeroIndex(stepsCount, endCount);
}
	
function test() {
	verify(638,calculate1,  loadFile("test1.txt") );
	console.log("test of 1 part is finished");
	verify(1226,calculate2,  loadFile("test1.txt"), 2018 );
	console.log("test of 1 part is finished");
}

function realTest(){
	verify(866,calculate1,  loadFile("real.txt") );
	verify(11995607,calculate2,  loadFile("real.txt") , (50*1000*1000+1) );
}

// test();
realTest();
