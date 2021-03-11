function CalculateTopPosition(helperMsgId, rectangle, message) {
    var msgElement = document.getElementById(helperMsgId);
    if (msgElement && msgElement.innerHTML !== undefined && msgElement.style !== undefined) {
        msgElement.innerHTML = message;
        // We might need to make some adjustments for the height of this element if it wraps
        var rectangleOfMsgElement = msgElement.getBoundingClientRect();

        // Not sure the math is right, but it appears 3.5 times the input field height works well
        var topOffset = rectangle.top - (rectangle.height + rectangleOfMsgElement.height);
        // Add an inline style of the top to the helperMsgId to position it absolutely 
        // on the screen. 
        msgElement.style.top = topOffset + "px";

        // Not sure we have the math right, but -32 seems to work well
        var leftOffset = rectangle.left + rectangle.width - 32;
        // Add an inline style of the left to the helperMsgId to position it absolutely 
        // on the screen. 
        msgElement.style.left = leftOffset + "px";
    }

}

function HasFocus(id, helperMsgId) {
    var inputElement = document.getElementById(id);
    // if (inputElement && inputElement.value !== undefined) {
    if (inputElement) {
        // Get the bounding rectangle where the element is on the web page
        // see https://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element-relative-to-the-browser-window
        var rectangleOfElement = inputElement.getBoundingClientRect();

        if (rectangleOfElement && rectangleOfElement.top !== undefined) {
            var msgText = inputElement.getAttribute("data-helpMsg");
            // Toggle the class called "hidden" on the helperMsgId element
            ToggleClassState(helperMsgId, 'hidden', false);
            // Reposition the element on the web page
            CalculateTopPosition(helperMsgId, 
                                rectangleOfElement,
                                 msgText);
        }
    }
}

function LostFocus(id, helperMsgId) {
    // Update the element to remove the top position
    var msgElement = document.getElementById(helperMsgId);
    if (msgElement) {
        msgElement.style = "";  // Remove the top style
        // Toggle the class called "hidden" on the helperMsgId element
        ToggleClassState(helperMsgId, 'hidden', true);
    }
}


function HasFocusGroup(id, helperMsgId) {
    var inputElement = document.getElementById(id);
    // if (inputElement && inputElement.value !== undefined) {
    if (inputElement) {
        // Get the bounding rectangle where the element is on the web page
        // see https://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element-relative-to-the-browser-window
        var rectangleOfElement = inputElement.getBoundingClientRect();

        if (rectangleOfElement && rectangleOfElement.top !== undefined) {
            var msgText = inputElement.getAttribute("data-helpMsg");
            // Toggle the class called "hidden" on the helperMsgId element
            ToggleClassState(helperMsgId, 'hidden', false);
            // Reposition the element on the web page
            rectangleOfElement.width = rectangleOfElement.width / 3;
            CalculateTopPosition(helperMsgId, 
                                rectangleOfElement,
                                 msgText);
        }
    }
}

function LostFocusGroup(id, helperMsgId, offset) {
    // Update the element to remove the top position
    var msgElement = document.getElementById(helperMsgId);
    if (msgElement) {
        msgElement.style = "";  // Remove the top style
        // Toggle the class called "hidden" on the helperMsgId element
        ToggleClassState(helperMsgId, 'hidden', true);
    }
}