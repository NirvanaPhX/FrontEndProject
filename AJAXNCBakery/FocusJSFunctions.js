// Version 1.02  - Mar 11, 2021
//
//#region Change History:
//
// Mar 06 2021 1.01
// - Fixed but in CalculateTopPosition() method where it did not take scrolling vertically or
//   horizontally into consideration
//
// Mar 11 2021 1.02
// - Added error handling to all methods so they report problems with missing ids in the console
// - Added # regions and change history note
// - Bug fixed in LostFocus() and LostFocusGroup() to clear out the .innerHTML if the id is specified
//     if you want the original functionality where the .innerHTML is not cleared, don't pass the id parameter
//     e.g.     LostFocus(,'message-id')    or LostFocusGroup(,'message-id') 
// - Upgrades to the HasFocus() method
//   New abilities:
//     -  will add Required message if the "required" attribute exists on the element you are pointing at
//     -  will display the title="something" attribute of the element you are pointing at if the <input> is in error
//     -  you can style these new abilities in CSS with CSS selectors like these
//            .help-title {
//                font-size: smaller;
//                color: rgba(163, 3, 168, 0.966);
//            }
//            .help-RequiredField {
//                font-size: .75em;
//                color: white  ;
//                background-color: Red;
//                padding: 2px 5px 2px 5px;
//                width: auto;
//                top: -20px;
//            }
//
//#endregion

//#region function CalculateTopPosition(helperMsgId, rectangle, message) 
/// Repositions the floating message box, after inserting the message into it and recalculating the size
function CalculateTopPosition(helperMsgId, rectangle, message) {
    var msgElement = document.getElementById(helperMsgId);
    if (msgElement && msgElement.innerHTML !== undefined && msgElement.style !== undefined) {
        msgElement.innerHTML = message;
        // We might need to make some adjustments for the height of this element if it wraps
        var rectangleOfMsgElement = msgElement.getBoundingClientRect();

        // Not sure the math is right, but it appears 3.5 times the input field height works well
        var topOffset = rectangle.top - (rectangle.height + rectangleOfMsgElement.height) + window.scrollY;
        // Add an inline style of the top to the helperMsgId to position it absolutely 
        // on the screen. 
        msgElement.style.top = topOffset + "px";
        
        // Not sure we have the math right, but -32 seems to work well
        var leftOffset = rectangle.left + rectangle.width - 32 +window.scrollX;
        // Add an inline style of the left to the helperMsgId to position it absolutely 
        // on the screen. 
        msgElement.style.left = leftOffset + "px";
    }
    else {
        console.log(`Could not find id of help box '${helperMsgId}' so cannot display it`);
    }

}
//#endregion

//#region function HasFocus(id, helperMsgId)
/// Method that allows us to provide help text by pointing at a specific element on the screen
/// using another element on the screen.
///  Remember to use CSS to style the element that has the helperMsgId identifier
///  The elemement you are pointing at must have the data-helpMsg="your message here" attribute
/// New abilities will add Required message & will display the title="something" attribute of the
///  element you are pointing at if the <input> is in error
function HasFocus(id, helperMsgId) {
    var inputElement = document.getElementById(id);
    if (inputElement) {
        // Get the bounding rectangle where the element is on the web page
        // see https://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element-relative-to-the-browser-window
        var rectangleOfElement = inputElement.getBoundingClientRect();

        if (rectangleOfElement && rectangleOfElement.top !== undefined) {
            var msgText = inputElement.getAttribute("data-helpMsg");
            // If the element is a required field, indicate so
            if (inputElement && inputElement.getAttribute('required') !== undefined && inputElement.checkValidity() !== undefined) {
                if (inputElement.checkValidity() == false) {
                    msgText = `<span class='help-RequiredField'>This is a required field</span><br>${msgText}`;
                    ToggleClassState(helperMsgId, 'hidden', false);
                }
            }
            // If the element is in error, show the title field too it if exists
            if (inputElement && inputElement.checkValidity() !== undefined) {
                if (inputElement.checkValidity() == false) {
                    var title = inputElement.getAttribute("title");
                    if (title && title !== undefined) {
                        msgText += `<br><span class='help-title'>${title}</span>`;
                    ToggleClassState(helperMsgId, 'hidden', false);
                    }
                }
            }
            // Reposition the element on the web page
            CalculateTopPosition(helperMsgId,
                rectangleOfElement,
                msgText);
        }
    }
    else {
        console.log(`Could not find id '${id}' so cannot focus on it`);
    }
}
//#endregion

//#region function LostFocus(id, helperMsgId)
/// Method that allows us to hide the help message box
function LostFocus(id, helperMsgId) {
    // Update the element to remove the top position
    var msgElement = document.getElementById(helperMsgId);
    if (msgElement) {
        msgElement.style = "";  // Remove the top and left inline style
        if (id) {
            msgElement.innerHTML = "";  // Remove the help text inside the element
        }
        // Toggle the class called "hidden" on the helperMsgId element to make it disappear
        ToggleClassState(helperMsgId, 'hidden', true);
    }
    else {
        console.log(`Could not find id of help box '${helperMsgId}' so cannot display it`);
    }
}
//#endregion

//#region function HasFocusGroup(id, helperMsgId)
/// Method that allows us to point a radio buttons, and check box groups
/// The only difference between HasFocus() and HasFocusGroup is that we 
/// point only 1/3 of the way across the grouping, instead of at the right side of the id element
function HasFocusGroup(id, group, helperMsgId) {
    var pointAtElement = document.getElementById(id);
    if (pointAtElement) {
        // Get the bounding rectangle where the element is on the web page
        // see https://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element-relative-to-the-browser-window
        var rectangleOfElement = pointAtElement.getBoundingClientRect();
        if (rectangleOfElement && rectangleOfElement.top !== undefined) {
            var msgText = pointAtElement.getAttribute("data-helpMsg");
            // If the element is in error, show the title field too it if exists
            if (pointAtElement && pointAtElement.checkValidity() !== undefined) {
                if (pointAtElement.checkValidity() == false) {
                    var title = pointAtElement.getAttribute("title");
                    if (title && title !== undefined) {
                        msgText += `<br><span class='help-title'>${title}</span>`;
                    }
                }
            }
            // If any of the elements is a required field, indicate so
            var inputElements = document.getElementsByName(group);
            if (inputElements && inputElements > 0) {
                for (let idx=0; idx < inputElements.length; idx++){
                    if (inputElements[idx] && inputElements[idx].getAttribute('required') !== undefined && inputElement.checkValidity() !== undefined) {
                        if (inputElement.checkValidity() == false) {
                            msgText = `<span class='help-RequiredField'>This is a required field</span><br>${msgText}`;
                        }
                    }
                }
            }
            // Toggle the class called "hidden" on the helperMsgId element
            ToggleClassState(helperMsgId, 'hidden', false);
            // Reposition the element on the web page
            rectangleOfElement.width = rectangleOfElement.width / 3;
            CalculateTopPosition(helperMsgId,
                rectangleOfElement,
                msgText);
        }
    }
    else {
        console.log(`Could not find id '${id}' bu we'll attempt to hide the associated floating message box`);
        LostFocusGroup(id,helperMsgId)
    }
}
//#endregion

//#region function LostFocusGroup(id, helperMsgId) 
/// Method that allows us to hide the help message box that is pointing at a radio button or checkbox grouping
function LostFocusGroup(id, helperMsgId) {
    // Update the element to remove the top position
    var msgElement = document.getElementById(helperMsgId);
    if (msgElement) {
        msgElement.style = "";  // Remove the top and left inline style
        if (id) {
            msgElement.innerHTML = "";  // Remove the help text inside the element
        }
        // Toggle the class called "hidden" on the helperMsgId element to make it disappear
        ToggleClassState(helperMsgId, 'hidden', true);
    }
    else {
        console.log(`Could not find id of help box '${helperMsgId}' so cannot hide it`);
    }
}
//#endregion

function HasFocusEdited(id, helperMsgId, msgText) {
    var inputElement = document.getElementById(id);
    if (inputElement) {
        var rectangleOfElement = inputElement.getBoundingClientRect();

        if (rectangleOfElement && rectangleOfElement.top !== undefined) {
                    ToggleClassState(helperMsgId, 'hidden', false);
            }
            // Reposition the element on the web page
            CalculateTopPosition(helperMsgId,
                rectangleOfElement,
                msgText);
    }
    else {
        console.log(`Could not find id '${id}' so cannot focus on it`);
    }
}