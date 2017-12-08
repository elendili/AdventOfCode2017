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
function makeTreeAsNodesMap(words2dArray){
	// create map of nodes
	let nodes = new Map();
	words2dArray.forEach(e=>{
			let node = {"name":e[0],'weight':parseInt(e[1]),'childrenWeigth':0,'children':[],"parent":null};
			if (e[2] === "->") {
				node["children"] = e.slice(3);
			}
			nodes.set(node["name"] , node);
		});
	// assign parents
	nodes.forEach((v,k,map)=>
		v["children"].forEach((childName,i,arr)=>  { 
			let node = nodes.get(childName);
			node["parent"]=v;
			arr[i]= node;
		})
	);
	//make weights

 	return nodes;

}

function getWeigth(node){
	let sum;	
	if (node["children"].length == 0) {
		sum =  node["weight"]
	} else {
		sum =  node["children"]
		.reduce((iv,cv)=>iv+getWeigth(cv) ,0);
		node['childrenWeigth']=sum;
		sum = sum+node["weight"]
	}
	return sum;
}

function calculate1( input ){
	let nodes = makeTreeAsNodesMap(convertFileToWords2dArray(input));
	let result = [ ...nodes.values()].filter(e=>e["parent"]===null);
	let parent = result[0];
	return parent["name"];
}
function getWeigthWithChildren(node){
	return node["weight"]+node["childrenWeigth"];
}
function getImbalancedChildren(node){
	let mode;
	for (n1 of node["children"]){
		let ineq=0;
		for (n2 of node["children"]){
			let diff = getWeigthWithChildren(n2) - getWeigthWithChildren(n1);
			if ( diff !=0 ) {
				ineq++;
			}
			if (ineq>1){
				let result = [n1,getWeigthWithChildren(n2)];
				return result;
			}
		}
	}
	return null;
}
function calcWeights(nodes){
	let result = [ ...nodes.values()].filter(e=>e["parent"]===null);
	let parent = result[0];
	getWeigth(parent);
}

function calculate2(input){
	let nodes = makeTreeAsNodesMap(convertFileToWords2dArray(input));
	calcWeights(nodes);
	let imba = [ ...nodes.values()]
		.filter(e=> getImbalancedChildren(e)!==null )
		.map(e=> getImbalancedChildren(e) )
		.sort((a,b)=>a[0]["childrenWeigth"]-b[0]["childrenWeigth"])
		;
	let imbaChildrenWeight = imba[0][0]["childrenWeigth"];
	let normalWeight = imba[0][1];
	let result = normalWeight-imbaChildrenWeight;
	// inspect(imba[0][0]);
	// info(imbaChildrenWeight);
	// info(normalWeight);
	// info(result);
	return result;
}

function test() {
	verify("tknk",calculate1, loadFile("test1.txt"));
	console.log("test of 1 part is finished");
	verify(60,calculate2, loadFile("test1.txt"));
	console.log("test of 2 part is finished");
}

function realTest(){
	verify("dtacyn",calculate1, loadFile("real.txt"));
	verify(521,calculate2, loadFile("real.txt"));
}

test();
realTest();

