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
	let arr = inputFile.split("\n")
		.map(e=>e.trim())
		.filter(e=>/\d+/.test(e) )
		.map(e=>parseInt(e)) ;
	return arr;
}

function convertFileToWords2dArray(inputFile){	
	let arr = inputFile.split(/\n/).filter(e=>e.length>0 ) ;
	let arr2 = arr.map(item=> item.split(/\s+/) )
				.filter( item=> !/\s+/.test(item) );
	return arr2;
}

// ===================== Solution functions

function jumper1(instructions){
	// info(instructions);
	let nextAdress=0, value,len=instructions.length, step=0;
	while(nextAdress<len && nextAdress>=0){
		value = instructions[nextAdress];
		instructions[nextAdress]=value+1;
		nextAdress += value;
		step+=1;
	}
	// info(instructions);
	return step;
}

function jumper2(instructions){
	// info(instructions);
	let nextAdress=0, value,len=instructions.length, step=0;
	while(nextAdress<len && nextAdress>=0){
		value = instructions[nextAdress];
		
		if (value>=3){
			instructions[nextAdress]=value-1;
		} else {
			instructions[nextAdress]=value+1;
		}
		nextAdress += value;
		step+=1;
	}
	// info(instructions);
	return step;
}

function calculate1( input ){
	let result = jumper1(convertFileToNumbersArray(input));
	return result;
}

function calculate2(input){
	let result = jumper2(convertFileToNumbersArray(input));
	return result;
}

function test() {
	verify(5,calculate1, loadFile("test1.txt"));
	console.log("test of 1 part is finished");
	verify(10,calculate2, loadFile("test1.txt"));
	console.log("test of 2 part is finished");
}

function realTest(){
	verify(318883,calculate1, loadFile("real.txt"));
	verify(23948711,calculate2, loadFile("real.txt"));
}


test();
realTest();

