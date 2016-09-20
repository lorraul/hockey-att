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
                if (objectArray[i][filteredBy] == filterValue)
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
    
    if (nrEl == 0) return '-';
    
    return Math.round(sum/nrEl); 
};

//check for numeric values
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

//get object from objectarray with property being max
function getMax(objectArray, property){
    var returnObject;
    var maxVal = 0;
    for (var i in objectArray){
        if (parseInt(objectArray[i][property]) > maxVal){
            returnObject = objectArray[i];
            maxVal = parseInt(objectArray[i][property]);
        }
    }
    return returnObject;
}

//get object from objectarray with property being min
function getMin(objectArray, property){
    var returnObject;
    var minVal = objectArray[0][property];
    for (var i in objectArray){
        if (parseInt(objectArray[i][property]) < minVal){
            returnObject = objectArray[i];
            minVal = parseInt(objectArray[i][property]);
        }
    }
    return returnObject;
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
            case 'january': return 0; break;
            case 'february': return 1; break;
            case 'march': return 2; break;
            case 'april': return 3; break;
            case 'may': return 4; break;
            case 'june': return 5; break;
            case 'july': return 6; break;
            case 'august': return 7; break;
            case 'september': return 8; break;
            case 'october': return 9; break;
            case 'november': return 10; break;
            case 'december': return 11; break;
            default: return 'invalid month label';
    }
}

//capitalize forst letter of string
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}