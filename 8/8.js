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
	let actual = converter(input);
	let message = "Input: " ;
	if (input.length>50) {
		if (input.length>300) {
			message += "\n"+input.substring(0,300)+"\n";	
		} else {
			message += "\n"+input+"\n";	
		}
	} else{
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
	let arr2 = arr.map(item=> item.split(/\s+/).map(e=>e.replace(/[(),]/g,"")) )
				.filter( item=> !/\s+/.test(item) );
	return arr2;
}
let areArraysEqual = (a1,a2)=>a1.length==a2.length && a1.every((v,i)=> v === a2[i]);
let getIndexOfMaximum = a=>a.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);

// ===================== Solution functions

function isTrue(line,registers){
	let arr=line.slice(4);
	let leftHandOperand = getRegisterValue(arr[0],registers);
	constr = leftHandOperand +" "+arr[1]+" "+arr[2] ;
	info(constr)
	return eval(constr);
}
function calculateRegisterValue(line,registers){
	let constr = getRegisterValue(line[0],registers) +" "+line[1]+" "+line[2];
	info(constr);
	return eval(constr);
}
function getRegisterValue(key, registers){
	registers[key] = registers[key]==undefined?0:registers[key];
	return registers[key];
}
global.maximumValue=0;
function executeInstructions(input){
	let arr = convertFileToWords2dArray(input);
	inspect(arr);
	let arr2 = arr.map(e=> e.map(v=>{
		if (/-?\d+/.test(v)) { return parseInt(v);} 
		else if ('inc'==v) {return '+'}
		else if ('dec'==v) {return '-'}
		else	return v;
		})
		);
	inspect(arr2);

	let registers={};
	arr2.forEach(line=>{
		if (isTrue(line,registers)) {
			let nextValue = calculateRegisterValue(line,registers);
			global.maximumValue = Math.max(global.maximumValue,nextValue);
			registers[line[0]] = nextValue;
		}
	})
	inspect(registers);
	return registers;
}
function calculate1( input ){
	let registers = executeInstructions(input);
	let max = Math.max( ...Object.values( registers ) );
	return max;
}

function calculate2(input){
	let registers = executeInstructions(input);
	return global.maximumValue;
}

function test() {
	verify(1,calculate1, loadFile("test1.txt"));
	console.log("test of 1 part is finished");
	verify(10,calculate2, loadFile("test1.txt"));
	console.log("test of 2 part is finished");
}

function realTest(){
	verify(4416,calculate1, loadFile("real.txt"));
	verify(5199,calculate2, loadFile("real.txt"));
}

test();
realTest();
