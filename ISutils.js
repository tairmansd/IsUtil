/**
 * 
 */
 (function() {

 	$( document ).ready(function() {
 		window.is = is;
 		window.utils = utils;
 	});

	var utils = {
		multiSplit : multiSplit,
		filter : filter,
		deepSearch : deepSearch
	};

	var ERROR_MSG = {
		'ERR1': 'Should be of object type. Cannot be null, undefined, boolean or array.',
		'ERR2': 'Should be of array type. Cannot be null, undefined, boolean or object.',
		'ERR3': 'No operator found. Check your exprression.',
		'ERR4': 'Invalid input parameter type. Only valid for Array or Object type.'
	};

	function err(code) {
		console.error(new Error(ERROR_MSG[code]));
		return new Error(ERROR_MSG[code]);
	}

	var objectNotation = {
		'Un': undefined+"",
		'nu': null+"",
		'Nu': function(a) { return Number.isInteger(a);},
		'tr': true,
		'fa': false,
		'bo': function(a) { return typeof bool === 'boolean';},
		'St': function(a) { return "".constructor === a.constructor},
		'Na': function(a) { return isNaN(a);},
		'Fi': function(a) { return isFinite(a);},
		'Ob': function(a) { return {}.constructor === a.constructor},
		'Ol': function(a) { return is('!Un.!nu.!Ar.!bo.Ob',a) ? Object.keys(a).length > 0: false;},
		'Hk': function(a) { return this.hasOwnProperty(a);},
		'Ar': function(a) { return Array.isArray(a);},
		'Al': function(a) { return is('!Un.!nu.!bo.Ar.!Ob',a) ? a.length > 0: false; }
	};

	function isFunction(object) {
 		var getType = {};
 		return object && getType.toString.call(object) === '[object Function]';
	};
 	
 	var is = function is(param, value) {
 		var opArr = createOpArr(param);
 		var evalStr = '';
 		opArr.forEach(function(e,i) {
 
 			switch(e) {
 				case '.':
 					evalStr = evalStr + '&&';
 					break;
 				case '|':
 					evalStr = evalStr + '||';
 					break;
 				default:
 					evalStr = evalStr + evalIs(e,value);
 					break;
 			}
 		});

 		return eval(evalStr);
 	};
 	
 	function evalIs(op, va) {
 		var isNeg = (op.split('')[0] === '!');

 		op = isNeg ? op.substring(1) : op;

 		if(!isFunction(objectNotation[op])) {
 			if(isNeg) {
				return objectNotation.hasOwnProperty(op) ? objectNotation[op] !== va+"" : err('ERR3'); 				
 			}
 			return objectNotation.hasOwnProperty(op) ? objectNotation[op] === va : err('ERR3');
 		}
 		else {
 			if(isNeg) {
 				return objectNotation.hasOwnProperty(op) ? !objectNotation[op](va) : err('ERR3');	
 			}
 			return  objectNotation.hasOwnProperty(op) ? objectNotation[op](va) : err('ERR3');	
 		}
 	};

 	function createOpArr(param) {
 		var result = [];

 		var operand = '';
 		param.split('').forEach(function(e,i) {

 			if(e === '.' || e === '|') {
 				result.push(operand);
 				result.push(e);
 				operand = '';
 			}
 			else {
 				operand = operand + e;	
 			}
 		});
 		result.push(operand);
 		return result;
 	};

 	function multiSplit(str, spChArr) {
 		var temp = [];
 		spChArr.forEach(function(e,i) {
 			if(is('Al',temp)) {
 				temp.forEach(function(li,j) {
 					if(is('Al',li.split(e))) {
 						temp.splice(temp.indexOf(li),1);
 					}
 					temp = temp.concat(li.split(e));
 				});
 			} 
 			else {
 				temp = str.split(e);
 			}
 		});
 		return temp;
 	};

 	function filter(ob1, ob2, union) { 		
		var allKeys1 = is('Ol',ob1) ? Object.keys(ob1) : is('Al',ob1) ? ob1 : err('ERR4'); 
		var allKeys2 = is('Ol',ob2) ? Object.keys(ob2) : is('Al',ob2) ? ob2 : err('ERR4');

		var result = [];
		
		allKeys1.forEach(function(key, i) {
			var needUnion = is('tr',union) ? (allKeys2.indexOf(key) !== -1) : (allKeys2.indexOf(key) == -1);
			if(needUnion) {
				var keyArr = [];
				var json = {};
				json[key] = ob1[key];
				keyArr.push(json);
				json = {};
				json[key] = ob2[key];
				keyArr.push(json);
				result.push(keyArr);
			}
		});

		return result;
 	};

 	function deepSearch(object, key, value, result){
	    if(object.hasOwnProperty(key) && object[key] === value)
	        result.push(object);

	    for(var i=0;i<Object.keys(object).length;i++){

	        if(typeof object[Object.keys(object)[i]]=="object"){
	            deepSearch(object[Object.keys(object)[i]],key, value,result);
	        }
	    }
	}

 }());