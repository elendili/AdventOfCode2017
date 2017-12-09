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
	let actual;
	if (arguments.length==3){
		 actual = arguments[1](input);
	} else if (arguments.length==2){
		 actual = arguments[1]
		 input = actual;
	}
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
function removeIgnored(line){
	line = line.replace(/!./g,"")
	// let regex = /(<[^>!]*?)!./;
	// while( regex.test(line) ) {
	// 	line = line.replace( regex ,"$1");
	// }
	return line;
}
function removeGarbage(line){
	line = removeIgnored(line);
	line = line.replace(/<[^>]*/g,"");
	return line;
}

function countGarbage(line){
	let count =0;
	let arr = line.match(/<[^>]*?>/g);
	arr.forEach(e=>{
		count+=e.length-2;
	});
	return count;
}

function countSymbol(symbol,line){
	let count=0;
	for (let i=0; line.indexOf(symbol,i)>-1; i = line.indexOf(symbol,i)+1  ){
		count+=1;
	}
	return count;
}

function check(line){
	let leftBraceC = countSymbol("{",line);
	let rightBraceC = countSymbol("}",line);
	verify(leftBraceC,rightBraceC);
}
function nestedGroupsScore(line){
	let ng=0, s=0;
	line.split("").forEach(e=>{
		if ("{"==e){ 
			ng+=1;
		} else 
		if ("}"==e){
			s+=ng;
			ng-=1;
		}
	});
	return s;
}
function calculate1( input ){
	let prepared = removeGarbage(input);
	let result = nestedGroupsScore(prepared);
	return result;
}

function calculate2(input){
	let prepared = removeIgnored(input);
	return countGarbage( prepared);
}

function test() {
	verify(1,calculate1,"{}");
	verify(6,calculate1,"{{{}}}");
	verify(5,calculate1,"{{},{}}");
	verify(16,calculate1,"{{{},{},{{}}}}");
	verify(1,calculate1,"{<a>,<a>,<a>,<a>}");
	verify(9,calculate1,"{{<ab>},{<ab>},{<ab>},{<ab>}}");
	verify(9,calculate1,"{{<!!>},{<!!>},{<!!>},{<!!>}}");
	verify(3,calculate1,"{{<a!>},{<a!>},{<a!>},{<ab>}}");
	console.log("test of 1 part is finished");
	verify(0,  calculate2, "<>");
	verify(17, calculate2, "<random characters>");
	verify(3,  calculate2, "<<<<>");
	verify(2,  calculate2, "<{!>}>");
	verify(0,  calculate2, "<!!>");
	verify(0,  calculate2, "<!!!>>");
	verify(10, calculate2, "<{o\"i!a,<{i<a>");
	console.log("test of 2 part is finished");
}

function realTest(){
	verify(10800,calculate1, loadFile("real.txt"));
	verify(4522,calculate2, loadFile("real.txt"));
}

test();
realTest();

