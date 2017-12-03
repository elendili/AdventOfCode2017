function loadFile(fileName){ 
	let fs = require('fs');
	let file = fs.readFileSync( __dirname + '/'+fileName, { encoding: 'utf8'} );
	return file;
}

function verify(expected,  converter, input){
	let actual = converter(input);
	let message = "Input:\n"+input+"\nExpected: "+expected+", actual: "+actual;
	if (expected!==actual){
		console.error(message);
	}else{
		console.info(message);
	}
}

function convertFileTo2dArray(inputFile){	
	let arr = inputFile.split("\n").filter(e=>/\d+/.test(e) ) ;
	let arr2 = arr.map(function(item){ return convertToNumbers(item);  });
	return arr2;
}
function convertToNumbers( str){
	return str.split(/\s+/).filter(item => /\d+/.test(item) )
		.map( item => parseInt(item));
}
function calculate1( str ){
	d2arr = convertFileTo2dArray(str);
	result = d2arr.map( e=> Math.max(...e) - Math.min(...e) );
	result = result.reduce( (e1,e2) => e1+e2, 0);
	return result;
}

function calculate2( str ){
	d2arr = convertFileTo2dArray(str);
	result = d2arr.map( e=> e.sort() );
	result = result.map( e=> {
		for (var i = 0, len = e.length; i < len; i++) {
			for ( var j=0; j<len; j++){
				if (  e[j] != e[i]  && e[j] % e[i] == 0 ) {
					return e[j]/e[i];
				}
			}
		}
		return 0;
	} );
	result = result.reduce( (e1,e2) => e1+e2, 0);
	return result;
}

function test() {
	verify(18,calculate1, loadFile('test1.txt') );
	console.log("test of 1 part is finished");
	verify(9,calculate2, loadFile('test2.txt') );
	console.log("test of 2 part is finished");
}

function realTest(){
	verify(46402,calculate1, loadFile('real1.txt'));
	verify(265,calculate2, loadFile('real1.txt'));
}
// http://adventofcode.com/2017/day/1


test();
realTest();
