/*get an array of property values

required parameters
objectArray - array of objects: sheet json
dataColumn - string: datasource column name

optional parameters
filterBy - string: filter by objects from column
filterValue - value of filterProperty filtered
filterProperty - string: property of the object from filterBy column
leagueData - league data object

example calls (controller level):

get the attendances of games where team1 is 'New Jersey Devils'
getColumnFiltered(AttendanceDataRes.dataArray, null, 'attendance', 'team1', null, 'New Jersey Devils')

getColumnFiltered(AttendanceDataRes.attendanceData.dataArray, null, 'date');
getColumnFiltered(AttendanceDataRes.attendanceData.dataArray,AttendanceDataRes.leagueData,'attendance','team1','country','ROM');
getColumnFiltered(AttendanceDataRes.attendanceData.dataArray, null, 'attendance', 'team1', null, 'HK Beograd');
getColumnFiltered(AttendanceDataRes.attendanceData.dataArray, null, 'attendance');
getColumnFiltered(AttendanceDataRes.attendanceData.dataArray, null, 'attendance', 'date', null, 'October');
*/
function getColumnFiltered(objectArray, ligueData, dataColumn, filteredBy, filterProperty, filterValue) {
    var i;
    var propertyValues = [];
    var filterMonthNr, entryDate;
    for (i in objectArray) {
        if (!filteredBy || !filterValue) {
            propertyValues.push(objectArray[i][dataColumn]);
        } else {
            if (filteredBy == 'date') {
                var monthNr = getMonthNr(filterValue);
                entryDate = new Date(objectArray[i].date);
                if (entryDate.getMonth() == monthNr)
                    propertyValues.push(objectArray[i][dataColumn]);
            } else {
                if (!filterProperty) { //simple filter if we don't need to get associated object for filterBy from league data json
                    if (typeof objectArray[i][filteredBy] == 'undefined') {
                        continue;
                    }
                    if (objectArray[i][filteredBy].trim() == filterValue)
                        propertyValues.push(objectArray[i][dataColumn]);
                } else { //filter by property of associated object, 
                    //if associated object is a team, currently the only case
                    //get filterBy's associated object
                    if (angular.isDefined(objectArray[i][filteredBy])) { //check if the filteredBy property has value
                        var assocObject = _.find(ligueData.teams, function (o) {
                            return o.long == objectArray[i][filteredBy].trim();
                        });
                        if (angular.isDefined(assocObject) && assocObject.country == filterValue)
                            propertyValues.push(objectArray[i][dataColumn]);
                    }
                }
            }
        }
    }
    return propertyValues;
}

//get the average value of an array of numbers
function getAverage(valueArray) {

    if (valueArray.length === 0) return '-';

    var sum = 0,
        nrEl = 0;
    for (var i = 0; i < valueArray.length; i++) {
        if (isNumeric(valueArray[i])) {
            sum += parseInt(valueArray[i], 10);
            nrEl++;
        }
    }

    if (nrEl === 0) return 'no data';

    return Math.round(sum / nrEl);
}

//check for numeric values
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}


//get object from objectarray with property being max, multiple cases included
function getMax(objectArray, property, filteredBy, filterValue) {
    var i;
    if (objectArray.length === 0) return {};
    var returnArray = [];
    var maxVal = 0;
    if (!filteredBy || !filterValue) {
        for (i in objectArray) {
            if (parseInt(objectArray[i][property]) > maxVal) {
                returnArray = [objectArray[i]]; //reset returnArray if new max is found
                maxVal = parseInt(objectArray[i][property]);
            }
            if (parseInt(objectArray[i][property]) == maxVal) {
                returnArray.push(objectArray[i]);
            }
        }
    } else {
        for (i in objectArray) {
            if (typeof objectArray[i][filteredBy] == 'undefined') {
                continue;
            }
            if (objectArray[i][filteredBy].trim() == filterValue) {
                if (parseInt(objectArray[i][property]) > maxVal) {
                    returnArray = [objectArray[i]]; //reset returnArray if new max is found
                    maxVal = parseInt(objectArray[i][property]);
                } else if (parseInt(objectArray[i][property]) == maxVal) {
                    returnArray.push(objectArray[i]);
                }
            }
        }
    }
    return returnArray ? returnArray : null;
}

//get object from objectarray with property being min, multiple cases included
function getMin(objectArray, property, filteredBy, filterValue) {
    var i;
    if (objectArray.length === 0) return {};
    var returnArray = [];
    var maxObject = getMax(objectArray, property)[0];
    var minVal = maxObject ? maxObject.attendance : null;
    if (!filteredBy || !filterValue) {
        for (i in objectArray) {
            if (parseInt(objectArray[i][property]) < minVal) {
                returnArray = [objectArray[i]]; //reset returnArray if new max is found
                minVal = parseInt(objectArray[i][property]);
            }
            if (parseInt(objectArray[i][property]) == minVal) {
                returnArray.push(objectArray[i]);
            }
        }
    } else {
        for (i in objectArray) {
            if (typeof objectArray[i][filteredBy] == 'undefined') {
                continue;
            }
            if (objectArray[i][filteredBy].trim() == filterValue) {
                if (parseInt(objectArray[i][property]) < minVal) {
                    returnArray = [objectArray[i]]; //reset returnArray if new max is found
                    minVal = parseInt(objectArray[i][property]);
                } else if (parseInt(objectArray[i][property]) == minVal) {
                    returnArray.push(objectArray[i]);
                }
            }
        }
    }
    return returnArray;
}

//get the latest date from an array of dates
function getLatestDate(dateArray) {
    if (dateArray.length === 0) return null;
    for (var i in dateArray) {
        dateArray[i] = new Date(dateArray[i]);
    }
    var maxValue = Math.max.apply(null, dateArray);
    return !isNaN(maxValue) ? new Date(maxValue) : null;
}

function getMonthNr(month) {
    switch (month) {
        case 'January':
            return 0;
        case 'February':
            return 1;
        case 'March':
            return 2;
        case 'April':
            return 3;
        case 'May':
            return 4;
        case 'June':
            return 5;
        case 'July':
            return 6;
        case 'August':
            return 7;
        case 'September':
            return 8;
        case 'October':
            return 9;
        case 'November':
            return 10;
        case 'December':
            return 11;
        default:
            return 'invalid month label';
    }
}

//capitalize first letter of a string
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//object sorting by property, decreasing order
//Source: http://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value-in-javascript
function compareAttendance(a, b) {
    if (a.attendance < b.attendance || (isNaN(a.attendance) && !isNaN(b.attendance)))
        return 1;
    if (a.attendance > b.attendance || (!isNaN(a.attendance) && isNaN(b.attendance)))
        return -1;
    return 0;
}
