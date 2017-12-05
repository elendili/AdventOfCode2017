// ===================== Utilities
const chalk = require('chalk');
const error = (text)=> console.error(chalk.red(text));
const pass = (text)=> console.info(chalk.green(text));
const info = (text)=> console.info(chalk.blue(text));

function loadFile(fileName){ 
	let fs = require('fs');
	let file = fs.readFileSync( __dirname + '/'+fileName, { encoding: 'utf8'} );
	return file;
}
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
// ===================== Solution functions
function convertFileToWords2dArray(inputFile){	
	let arr = inputFile.split(/\n/).filter(e=>e.length>0 ) ;
	let arr2 = arr.map(item=> item.split(/\s+/) )
				.filter( item=> !/\s+/.test(item) );
	return arr2;
}

function countRepetitionInLine(lineArr){
	let count=0, d=0;
	for (let i=0;i<lineArr.length;i++){
		for (let j=i+1;j<lineArr.length;j++){
			d = lineArr[i]==lineArr[j]?1:0;
			count += d;
	}}
	return count;
}
var charsToPrimes = {
"a":2,
"b":3,
"c":5,
"d":7,
"e":11,
"f":13,
"g":17,
"h":19,
"i":23,
"j":29,
"k":31,
"l":37,
"m":41,
"n":43,
"o":47,
"p":53,
"q":59,
"r":61,
"s":67,
"t":71,
"u":73,
"v":79,
"w":83,
"x":89,
"y":97,
"z":101
}
function getHashNumber(word){
		return word.split("")
		.map(e=> charsToPrimes[e])
		.reduce((a,b)=>a*b,1);
		;

}
function areAnagrams(word1,word2){
	if (word1.length==word2.length){
		return getHashNumber(word1)==getHashNumber(word2);
	}
	else return false;
}

function countAnagramsInLine(lineArr){
	let count=0, d=0;
	for (let i=0;i<lineArr.length;i++){
		for (let j=i+1;j<lineArr.length;j++){
			d = areAnagrams(lineArr[i],lineArr[j])?1:0;
			count += d;
	}}
	return count;
}

function calculate1( arr2words ){
	let result = arr2words
		.filter(e=> countRepetitionInLine(e)==0);
	return result.length;
}

function calculate2(arr2words){
	let result = arr2words
		.filter(e=> countAnagramsInLine(e)==0);
	return result.length;
}

function test() {
	verify(2,calculate1, convertFileToWords2dArray(loadFile("test1.txt")));
	console.log("test of 1 part is finished");
	verify(3,calculate2, convertFileToWords2dArray(loadFile("test2.txt")));
}

function realTest(){
	verify(466,calculate1, convertFileToWords2dArray(loadFile("real.txt")));
	verify(466,calculate2, convertFileToWords2dArray(loadFile("real.txt")));
}


test();
realTest();

