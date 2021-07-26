// JavaScript Document
var scorm = pipwerks.SCORM;  //Shortcut
var lmsConnected = false;
var LMSSuspendData;

function handleError(msg){
   alert(msg);
   //window.close();
}

function initCourse(){
   //scorm.init returns a boolean
   lmsConnected = scorm.init();
   //If the scorm.init function succeeded...
   if(lmsConnected){
	  //Let's get the completion status to see if the course has already been completed
	  var completionstatus = scorm.get("cmi.core.lesson_status");
	  //If the course has already been completed...
	  if(completionstatus === "completed" || completionstatus === "passed"){
		 //...let's display a message and close the browser window
		 handleError("You have already completed this course. You do not need to continue.");
	  } else {
		  //handleError("LMSconnect = " + lmsConnected);
	  }
	  //var mySuspendData = scorm.get("cmi.suspend_data");
    //console.log(mySuspendData);
    LMSSuspendData = scorm.get("cmi.suspend_data"); // assign to global var in main.js
   //If the course couldn't connect to the LMS for some reason...
   } else {
	  //... let's alert the user then close the window.
	  handleError("Error: + LMSconnect =" + lmsConnected + "Course could not connect with the LMS. Please contact the help desk.");
   }
}

function initCourse_orig(){
   //scorm.init returns a boolean
   lmsConnected = scorm.init();
   //If the scorm.init function succeeded...
   if(lmsConnected){
	  //Let's get the completion status to see if the course has already been completed
	  var completionstatus = scorm.get("cmi.core.lesson_status");
	  //If the course has already been completed...
	  if(completionstatus === "completed" || completionstatus === "passed"){
		 //...let's display a message and close the browser window
		 handleError("You have already completed this course. You do not need to continue.");
	  } else {
		  //handleError("LMSconnect = " + lmsConnected);
	  }
	  //var mySuspendData = scorm.get("cmi.suspend_data");
    //console.log(mySuspendData);
    LMSSuspendData = scorm.get("cmi.suspend_data"); // assign to global var in main.js
		console.log("Retrieved value of 'suspend_data': "+LMSSuspendData);
   //If the course couldn't connect to the LMS for some reason...
   } else {
	  //... let's alert the user then close the window.
	  handleError("Error: + LMSconnect =" + lmsConnected + "Course could not connect with the LMS. Please contact the help desk.");
   }
}

function completeCourse_Click(){
   //If the lmsConnection is active...
   if(lmsConnected){
	  //... try setting the course status to "completed"
	  var success = scorm.set("cmi.core.lesson_status", "completed");
	  //If the course was successfully set to "completed"...
	  if(success){
		 //... disconnect from the LMS, we don't need to do anything else.
		 scorm.quit();
		 handleError("Your completion status has been recorded");
		 window.close();
	  //If the course couldn't be set to completed for some reason...
	  } else {
		 //alert the user and close the course window
		 handleError("Error: Course could not connect with the LMS. Please contact the help desk.");
	  }
   //If the course isn't connected to the LMS for some reason...
   } else {
	  //alert the user and close the course window
	  handleError("Error: Course is not connected to the LMS.  Please contact help desk.");

   }
}

function setSuspendData(newData){
	 if ((lmsConnected) && (newData)) {
		 console.log("Data sent from course to be saved in LMS - " + newData);
		 scorm.set("cmi.suspend_data", newData);
	 }
}

function sendSuspendData(){
	 if(lmsConnected){
		var myPageTracking = courseMgr.getCourseProgressString();

		console.log("what page - " + myPageTracking);

		 var num = 15;
		 var myPageTracking2 = num.toString();
		 console.log("what is being sent - " + myPageTracking2);

		 scorm.set("cmi.suspend_data", myPageTracking);
	 }

}
