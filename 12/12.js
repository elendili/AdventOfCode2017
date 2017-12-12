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
	let arr = inputFile.split('\n');
	arr = arr.map(l=>l
			.match(/\d+/g));
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

function gatherGroupWithId(map, id){
	let set = new Set();
	set.add(id);
	let array;
	do {
		// inspect(map.keys());
		array = [ ...map.keys() ];
		array = array.filter( k => ! set.has(k) );
		// info('1');
		// inspect(array);
		array = array.filter( k => 
			map.get(k).filter( e => set.has(e) ).length > 0 
		);
		// info('2');
		// inspect(array);

		array = array.reduce( (list, k) => {
			list.push(k);
			list = list.concat(map.get(k));
			return list;
		}, []);
			
		// info('3');
		// inspect(array);

		set = new Set([...set, ...array]);
		// info('4. set');
		// inspect(set);

		// process.exit();
	} while (array.length>0);

	return set;
}

function calculate1( array ){
	let d2array  = convertFileToNumbersArray(array);
	let map = new Map();
	for (let line of d2array){
		map.set(line[0] , line.slice(1));
	}

	let groupSet = gatherGroupWithId(map,'0');
	return groupSet.size;
}

function calculate2( array ){
	let d2array  = convertFileToNumbersArray(array);
	let map = new Map();
	for (let line of d2array){
		map.set(line[0] , line.slice(1));
	}

	let keyNotInKnownGroup = '0';
	let groups = new Set();
	do {
		let groupSet = gatherGroupWithId(map, keyNotInKnownGroup);
		groups.add(groupSet);
		// info('groupSet: '+ groupSet.size );
		// inspect(groupSet);
		
		map = new Map( [...map.entries() ] );
		groupSet.forEach( k=> map.delete(k) );
		// info('map: '+map.size );
		// map = Object.keys(map).reduce( (a, e) => (a[e] = map[e], a ), {} );
		// inspect(map);

		// inspect(idsFromUnknownGroups);
		keyNotInKnownGroup = [...map.keys()] [0];
		info('keyNotInKnownGroup: '+keyNotInKnownGroup);
		// if (groups.size>30) process.exit();
	} while ( keyNotInKnownGroup != undefined )

	return groups.size;
}


function test() {
	verify(6,calculate1,  loadFile("test1.txt") );
	console.log("test of 1 part is finished");
	verify(2,calculate2,  loadFile("test1.txt") );
	console.log("test of 2 part is finished");
}

function realTest(){
	verify(128,calculate1 , loadFile("real.txt") );
	verify(209,calculate2 , loadFile("real.txt") );
}

test();
realTest();

