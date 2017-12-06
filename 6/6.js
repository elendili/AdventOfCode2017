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

function convertFileToNumbersArray(inputFile){	
	let arr = inputFile.match(/[^\s]+/g)
			.map(e=>parseInt(e));
	return arr;
}

function convertFileToWords2dArray(inputFile){	
	let arr = inputFile.split(/\n/).filter(e=>e.length>0 ) ;
	let arr2 = arr.map(item=> item.split(/\s+/) )
				.filter( item=> !/\s+/.test(item) );
	return arr2;
}
let areArraysEqual = (a1,a2)=>a1.length==a2.length && a1.every((v,i)=> v === a2[i]);
let getIndexOfMaximum = a=>a.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);

// ===================== Solution functions

function redistributor(array){
	// info(instructions);
	let combinationsStorage=new Set();
	let maxIndex, maxValue;
	let step=0;
	while( !combinationsStorage.has(array.toString()) ){

		combinationsStorage.add(array.toString());
		
		//find maximum
		maxIndex = getIndexOfMaximum(array);
		//prepare before redistribution
		maxValue = array[maxIndex];
		array[maxIndex]=0;
		// redistribute
		for(let i=1;i<=maxValue;i++){
			let next = (maxIndex+i)%array.length;
			array[next]=array[next]+1;
		}
		
		step++;

	}
	// info(instructions);
	return step;
}


function redistributorWithStepsMemory(array){
	// info(instructions);
	let combinationsStorage=new Map();
	let maxIndex, maxValue;
	let step=0;
	while( !combinationsStorage.has(array.toString()) ){

		combinationsStorage.set(array.toString(), step);
		
		//find maximum
		maxIndex = getIndexOfMaximum(array);
		//prepare before redistribution
		maxValue = array[maxIndex];
		array[maxIndex]=0;
		// redistribute
		for(let i=1;i<=maxValue;i++){
			let next = (maxIndex+i)%array.length;
			array[next]=array[next]+1;
		}
		
		step++;

	}
	// info(instructions);
	return step-combinationsStorage.get( array.toString() );
}


function calculate1( input ){
	let result = redistributor(convertFileToNumbersArray(input));
	return result;
}

function calculate2(input){
	let result = redistributorWithStepsMemory(convertFileToNumbersArray(input));
	return result;
}

function test() {
	verify(5,calculate1, loadFile("test1.txt"));
	console.log("test of 1 part is finished");
	verify(4,calculate2, loadFile("test1.txt"));
	console.log("test of 2 part is finished");
}

function realTest(){
	verify(12841,calculate1, loadFile("real.txt"));
	verify(8038,calculate2, loadFile("real.txt"));
}

test();
realTest();

