/*
Author: Aaron Edlebeck
*/

"use strict";

chrome.runtime.onInstalled.addListener(function() {
   set('Enabled', 1);
   set('checkBoxState', true);
   fetchText(4351);
});

chrome.runtime.onMessage.addListener(
   function(request, sender, sendResponse) {
      if (request.msg == "update") {
         fetchText(4351);
      }
   }
)

let profNames = [];
function saveProfessorData(json) {
   for (let i = 0; i < json.professors.length; i++) {
      let firstLetter = json.professors[i].tFname;
      firstLetter = firstLetter.charAt(0);
      let lastName = json.professors[i].tLname;
      let newName = firstLetter + ". " + lastName;
      newName = newName.toUpperCase();
   
      let rating = json.professors[i].overall_rating;
      let numRatings = json.professors[i].tNumRatings;
      rating = rating + " - " + numRatings;
   
      if (profNames.indexOf(newName) != -1) {
         newName = newName + "unknown";
         }
      set(newName, rating);
      profNames.push(newName);
      }
}

async function fetchText(numProfs) {
   let numPages = Math.ceil(numProfs / 20)
   for (let i = 1; i <= numPages; i++) {
      let response = await fetch("https://www.ratemyprofessors.com/filter/professor/?&page=" + i + "&filter=teacherlastname_sort_s+asc&query=*%3A*&queryoption=TEACHER&queryBy=schoolId&sid=877");
      let data = await response.json();
      saveProfessorData(data);
      if (i == numPages) {
         console.log("completed updating data");
      }
   }
}

function set(key, value) {
   var dataObj = {};
   dataObj[key] = value;
   chrome.storage.local.set(dataObj, function () {
      console.log("Set value in storage: " + JSON.stringify(dataObj));
   })
}
