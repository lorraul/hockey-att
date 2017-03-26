//get an array of properties from an array of objects filtered by filterValue of filteredBy property
function getColumn(objectArray, property, filteredBy, filterValue){
    var propertyValues = [];
    var filterMonthNr, entryDate;
    for (var i in objectArray){
        if (!filteredBy || !filterValue){
            propertyValues.push(objectArray[i][property]);
        }
        else {
            if (filteredBy != 'date'){
                if (typeof objectArray[i][filteredBy] == 'undefined') {
                    continue;
                }
                if (objectArray[i][filteredBy].trim() == filterValue)
                    propertyValues.push(objectArray[i][property]);
            }
            else {
                monthNr = getMonthNr(filterValue);
                entryDate = new Date(objectArray[i].date);
                if (entryDate.getMonth() == monthNr)
                    propertyValues.push(objectArray[i][property]);
            }
        }
    }
    return propertyValues;
};

//get the average value of an array of numbers
function getAverage(valueArray){
    
    if (valueArray.length == 0) return '-';
    
    var sum=0, nrEl=0;
    for(var i=0; i<valueArray.length; i++){
        if (isNumeric(valueArray[i])){
            sum += parseInt(valueArray[i], 10);
            nrEl++;
        }
    }
    
    if (nrEl == 0) return 'no data';
    
    return Math.round(sum/nrEl); 
};

//check for numeric values
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}


//get object from objectarray with property being max, multiple cases included
function getMax(objectArray, property, filteredBy, filterValue){
	if (objectArray.length == 0) return {};
    var returnArray = [];
    var maxVal = 0;
	if (!filteredBy || !filterValue){
		for (var i in objectArray){
            if (parseInt(objectArray[i][property]) > maxVal){
                returnArray= [objectArray[i]]; //reset returnArray if new max is found
                maxVal = parseInt(objectArray[i][property]);
            }
			if (parseInt(objectArray[i][property]) == maxVal){
				returnArray.push(objectArray[i]);
			}
		}
	} else {
		for (var i in objectArray){
            if (typeof objectArray[i][filteredBy] == 'undefined') {
                    continue;
            }
			if (objectArray[i][filteredBy].trim() == filterValue){
                if (parseInt(objectArray[i][property]) > maxVal){
                    returnArray= [objectArray[i]]; //reset returnArray if new max is found
                    maxVal = parseInt(objectArray[i][property]);
                }
                else if (parseInt(objectArray[i][property]) == maxVal){
                    returnArray.push(objectArray[i]);
                }
            }
		}
	}
    return returnArray;
}

//get object from objectarray with property being min, multiple cases included
function getMin(objectArray, property, filteredBy, filterValue) {
    if (objectArray.length == 0) return {};
    var returnArray = [];
    var minVal = getMax(objectArray, property)[0].attendance;
    if (!filteredBy || !filterValue) {
        for (var i in objectArray) {
            if (parseInt(objectArray[i][property]) < minVal) {
                returnArray = [objectArray[i]]; //reset returnArray if new max is found
                minVal = parseInt(objectArray[i][property]);
            }
            if (parseInt(objectArray[i][property]) == minVal) {
                returnArray.push(objectArray[i]);
            }
        }
    } else {
        for (var i in objectArray) {
            if (typeof objectArray[i][filteredBy] == 'undefined') {
                continue;
            }
            if (objectArray[i][filteredBy].trim() == filterValue) {
                if (parseInt(objectArray[i][property]) < minVal) {
                    returnArray = [objectArray[i]]; //reset returnArray if new max is found
                    minVal = parseInt(objectArray[i][property]);
                }
                else if (parseInt(objectArray[i][property]) == minVal){
                    returnArray.push(objectArray[i]);
                }
            }
        }
    }
    return returnArray;
}

//get the latest date from an array of dates
function getLatestDate(dateArray){
    for (var i in dateArray){
        dateArray[i] = new Date(dateArray[i]);
    }
    var maxDate=new Date(Math.max.apply(null,dateArray));
    return maxDate;
}

function getMonthNr(month){
    switch (month) {
            case 'January': return 0; break;
            case 'February': return 1; break;
            case 'March': return 2; break;
            case 'April': return 3; break;
            case 'May': return 4; break;
            case 'June': return 5; break;
            case 'July': return 6; break;
            case 'August': return 7; break;
            case 'September': return 8; break;
            case 'October': return 9; break;
            case 'November': return 10; break;
            case 'December': return 11; break;
            default: return 'invalid month label';
    }
}

//capitalize first letter of a string
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//object sorting by property, decreasing order
//Source: http://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value-in-javascript
function compareAttendance(a,b) {
  if (a.attendance < b.attendance)
    return 1;
  if (a.attendance > b.attendance)
    return -1;
  return 0;
}