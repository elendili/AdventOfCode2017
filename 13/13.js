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
// ===================== Solution functions

// [ 0 wall depth number, 1 - wall range height, 2 - security position, 
//   3 - secutity movement direction, 4 - number of packet ]
function fileToWalls(file){
	let ar = convertFileToNumbersArray(file);
	let wallsCount = ar[ ar.length-1][0];
	let expandedWalls=[];
	let expandedI=0;
	for (let i=0; i<ar.length;i++,expandedI++){
		let targetIndex = ar[i][0];

		for ( ; expandedI<targetIndex; expandedI++){
			expandedWalls.push( [ expandedI ,0, 0, 1, -1 ] );
		}
		expandedWalls.push([ ar[i][0], ar[i][1], 0, 1, -1 ]);
	}

	return expandedWalls;
}

function printWalls(walls,packetIndex=-1){
	let line = "";
	line = " "+walls.map(w=>w[0]).join('   ')+" ";
	info(line);
	line = walls.map(w=> (""+w[4]).padStart(3)  ).join(' ')+" ";
	info(line);
	let maxSize = Math.max( ...walls.map(w=>w[1]) );
	for(let i=0;i<maxSize;i++){
		line="";
		let b;
		walls.forEach((w,j)=>{
			
			b= (j == packetIndex && i==0 ) ? "(" :"[";
			line+= (i<=w[1]) ? b:" " ; 

			if (w[1]==0 && i==0 && w[2]!=0 ){ line+=".";}
			
			else {line+= (i==w[2] && w[1]>0)? "S":" " ; }

			b= (j == packetIndex && i==0) ? ")" :"]";

			line+= (i<=w[1]) ? b:" " ; 
			line+=" ";
		});
		info(line);
	}

}

function optimizedTacts(walls){
	for (let tact=0; walls[walls.length-1][4] == -1 || tact == Number.MAX_SAFE_INTEGER; tact++ ){

		// shift packet
		for (let i=walls.length-1;i>0;i--){
			walls[i][4] = walls[i-1][4];
		}
		walls[0][4]=tact;

		info(tact);
		// printWalls(walls);
		// check caught
		walls.forEach(w=>{
			if(w[1]>0 && w[4]>-1 && w[2]==0 ) {
				w[4]=-1;
			}
		});

		// set secutiry direction
		walls.forEach( w=> {
			if( w[2]>=w[1]-1 ) w[3]= -1;  
			if( w[2]<=0 ) w[3]= 1;  
		} );
		// shift security
		walls.forEach( w=>  w[2]= (w[1]>0) ? w[2]+w[3] : -1 );
		
	}

	return walls[walls.length-1][4];
}

function tacts(walls,delay=0){
	let caught = [];
	let packetIndex=-1; 
	for (let tact=0; packetIndex < walls.length; tact++ ){

		// shift packet
		if (tact>=delay) {packetIndex++};

		// info(tact);
		// printWalls(walls,packetIndex);
		// check caught
		walls.forEach(w=>{
			if(w[1]>0 && w[0]==packetIndex && w[2]==0 ) {
				caught.push({ 'depth':w[0], 'range':w[1] });
			}
		});

		// set secutiry direction
		walls.forEach( w=> {
			if( w[2]>=w[1]-1 ) w[3]= -1;  
			if( w[2]<=0 ) w[3]= 1;  
		} );
		// shift security
		walls.forEach( w=>  w[2]= (w[1]>0) ? w[2]+w[3] : -1 );

	}

	return caught;
}

function calculate1( file ){
	let walls = fileToWalls(file);
	let caught = tacts(walls);
	// inspect(caught);
	let severity = caught.reduce((ac,v)=>ac+(v['range']*v['depth']),0);
	return severity;
}

function calculate2( file ){
	let walls = fileToWalls(file);
	let delay = optimizedTacts(walls);
	return delay;
}


function test() {
	verify(24,calculate1,  loadFile("test1.txt") );
	console.log("test of 1 part is finished");
	verify(10,calculate2,  loadFile("test1.txt") );
	console.log("test of 2 part is finished");
}

function realTest(){
	verify(1704,calculate1 , loadFile("real.txt") );
	verify(3970918,calculate2 , loadFile("real.txt") );
}

test();
realTest();

