/*
Author: Aaron Edlebeck
*/

"use strict";

//TODO: Handle edge case of professors with same name

chrome.storage.local.get('checkBoxState', function (data) {
   if (data.checkBoxState == true) {
      runProgram();
   }
});

//Gets professor names on page
function getNames() {
   let names = [];
   let divs = document.querySelectorAll("#bodySearchResults > div.sectionListWrapper > div:nth-child(n) > div.sectionMeeting > div.sectionFieldInstructor.column > a");
   for (let i = 0; i < divs.length; i++) {
      let temp = divs[i].innerText;
      temp = temp.toString();
      temp = temp.toUpperCase();
      let contains = names.indexOf(temp);
      if (contains == -1) {
         names.push(temp);
      }
   }
   return names
}

//Sets objects in chrome local storage
function set(key, value) {
   var dataObj = {};
   dataObj[key] = value;
   chrome.storage.local.set(dataObj, function () {
      console.log("Set value in storage: " + JSON.stringify(dataObj));
   })
}

//Retrieves objects from chrome local storage
function get(key) {
   chrome.storage.local.get(key, function (data) {
      console.log(data);
      return JSON.stringify(data);
   })
}
 
//Starts editing of page data
async function runProgram() {
   let namesOnPage = getNames();
         for(let i = 0; i < namesOnPage.length; i++) {
            let obj1 = chrome.storage.local.get(namesOnPage[i]);
            obj1.then(function(result) {
               console.log(namesOnPage[i]);
               console.log(result);
               writeData(result, namesOnPage[i]);
            })
         }
      }

function writeData(data, keyword) {
   let divs = document.querySelectorAll("#bodySearchResults > div.sectionListWrapper > div:nth-child(n) > div.sectionMeeting > div.sectionFieldInstructor.column > a");
   for (let i = 0; i < divs.length; i++) {
      let temp = divs[i].innerText;
      temp = temp.toString();
      temp = temp.toUpperCase();
      data = JSON.stringify(data);
      data = data.substring(1, data.length - 1);
      data = data.replaceAll("\"", " ");
      if (divs[i].innerHTML.includes(keyword) && data !== '{}' && data) {
         divs[i].innerHTML = divs[i].innerHTML.replace(temp, data);
      }
   }
}
