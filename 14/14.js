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

function knotHash(lengths){
	let sequence = [...Array(256).keys()];
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


function genHashes(input){
	let ar = [];
	for(let i=0;i<128;i++){
		ar.push(input+"-"+i);
	}
	return ar;
}

function hex2Bin(hexLine){
	let out = hexLine.split('').map(c=>parseInt(c, 16));
	out = out.map(n=>n.toString(2).padStart(4,"0") );
	out = out.reduce((ac,v)=>ac+v,"");
	return out;
}
function binToSquaresPrintable(line){
	return line.replace(/0/g,'.').replace(/1/g,'#');
}

function makeBinaryLines(file){
	let hashes = genHashes(file);
	let binlines = hashes.map( line => knotHash(line) )
		.map( line => hex2Bin(line) );
	return binlines;

}

function calculate1( file ){
	let binlines = makeBinaryLines(file);
	let onesCount = binlines
					.map(l=> l.split('').filter(c=>c=='1').length )
					.reduce( (ac,v)=> ac+v,0);
	return onesCount;
}

function outputSegment(ar2d, size=16){
	return ar2d.slice(0,size).map(a=>a.slice(0,size)).map(l=>l.map(c=>(""+c).padStart(3)).join(' ')).forEach(l=>info(l)); 
}

function markGroup(ar2d,r,c,g){
	ar2d[r][c]=g;
	// propagate to this row, previos column 
	if ( c>0 && ar2d[r][c-1] == '#' ) {
		markGroup(ar2d,r,c-1,g);
	} 
	// on this column previous square
	if ( r>0 && ar2d[r-1][c] == '#'  ){
		markGroup(ar2d,r-1,c,g);
	}
	// this row, next column 
	if ( c<ar2d.length-1 &&  ar2d[r][c+1] =='#' ){
		markGroup(ar2d,r,c+1,g);
	} 
	// this column, next row
	if ( r<ar2d.length-1 &&  ar2d[r+1][c] =='#' ){
		markGroup(ar2d,r+1,c,g);
	}
}

function searchAndCountGroups(ar2d){
	let g=0;
	let gi=5000000;
	for (let r=0; r<ar2d.length;r++){
		for (let c=0; c<ar2d.length;c++){
			if (ar2d[r][c] == '#') {
				g++;
				if (g==gi) outputSegment(ar2d);
				if (g==gi) info('\n');
				markGroup(ar2d,r,c,g);
				if (g==gi) outputSegment(ar2d);
				if (g==gi) process.exit();
			
			}
		}

	}
	return g;
}

function calculate2( file ){
	let binlines = makeBinaryLines(file);
	// convertBinaryLinesToRegions
	let printable = binlines.map(l=>binToSquaresPrintable(l));
	let ar2d = printable.map(l=>l.split(''));
	let g = searchAndCountGroups(ar2d);
	return g;
}

function test() {
	verify(8108,calculate1,  loadFile("test1.txt") );
	console.log("test of 1 part is finished");
	verify(1242,calculate2,  loadFile("test1.txt") );
	console.log("test of 2 part is finished");
}

function realTest(){
	verify(8230,calculate1 , loadFile("real.txt") );
	verify(1103,calculate2 , loadFile("real.txt") );
}

test();
realTest();

