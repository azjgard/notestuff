//
// TODO:
// - Track the mark text in a separate list
// - Add in mark-specific notes
// - Add tags to filter the marks by
// - Search bar to search through the marks

//
// FIXME:
// Fix mouseup event inconsistencies
// NOTE: this will also fix the issue with the sidebar not closing
// properly when all marks are removed.

// FIXME:
// When highlighting text which has multiple instances in the element
// in question, the first instance will always be highlighted,
// even if that is not the instance that the user clicked on.

// FIXME:
// If the highlight starts in one element and ends in another element
// (e.g. it spans across two p tags), crap breaks.
//

// FIXME:
// Prevent highlights from occurring on the notes themselves.

// --------------------------------------
// --------------------------------------
// --------------------------------------
// Global variables
// --------------------------------------
// --------------------------------------
// --------------------------------------

let notes = {};

let singleMark = { 
  "custom-mark-2" : {
    markText : "sfgjdfg",
    noteText : "kdgdfg",
    tags     : ["tag1", "tag2", "tag3"]
  }
}

// --------------------------------------
// --------------------------------------
// --------------------------------------
// Keyboard Event Listeners
// --------------------------------------
// --------------------------------------
// --------------------------------------


let controlPressed = false;
const controlKey   = 17;

$(document).on('keydown', function(e) {
  const keyPressed = e.which;

  if (keyPressed === controlKey) {
    $('mark').addClass('delete-mark');
    controlPressed = true; 
  }
});

$(document).on('keyup', function(e) {
  const keyPressed = e.which;

  if (keyPressed === controlKey) {
    $('mark').removeClass('delete-mark');
    controlPressed = false; 
  }
});

// --------------------------------------
// --------------------------------------
// --------------------------------------
// Keyboard Event Listeners
// --------------------------------------
// --------------------------------------
// --------------------------------------


// --------------------------------------
// --------------------------------------
// --------------------------------------
// Mouse Event Listeners
// --------------------------------------
// --------------------------------------
// --------------------------------------

let markCount      = 0;
let markAddedCount = 0;

$('html').on('mouseup', function(e) {
  // Selection Object
  const selection = window.getSelection();
  const text      = selection.toString();

  if (text) {
    initializeNewMark(selection, text);
  }
});

// --------------------------------------
// --------------------------------------
// --------------------------------------
// Mouse Event Listeners
// --------------------------------------
// --------------------------------------
// --------------------------------------

// --------------------------------------
// --------------------------------------
// --------------------------------------
// Functions
// --------------------------------------
// --------------------------------------
// --------------------------------------

function initializeNewMark(selection, text) {
  const anchor    = selection.anchorNode.parentElement;
  const className = `custom-mark-${markAddedCount}`;


  // FIXME:
  // Fix the ghetto way that marks are being limited to a single instance
  // of the text
  let count = 0;
  function ghettoFilter() {
    count++;
    return count <= 1;
  }

  const options = {
    className,
    separateWordSearch : false,
    filter             : ghettoFilter
  };

  let markElement = null;

  // Setting the marked text
  $(anchor).mark(text, options);

  if (!$('body')[0].className.includes('notes-visible')) {
    $('body').addClass('notes-visible');
  }

  // Finding the element with the marked text inside of it
  markElement = $(anchor).find(`.${className}`);

  addMarkData(className, text);

  // Binding an event to remove the highlight
  $(markElement).on('click', function(e) {
    if (controlPressed) {
      $(this).unmark();

      markCount--;

      delete notes[className];

      if (markCount === 0) {
       $('body').removeClass('notes-visible');
      }
    }
  });

  // Incrementing the mark count to ensure that we have
  // unique classNames for each mark
  markCount++;
  markAddedCount++;
}

function addMarkData(markClassName, text) {
  notes[markClassName] = {
    markText : text,
    noteText : "note text goes here",
    tags     : []
  };

}

// --------------------------------------
// --------------------------------------
// --------------------------------------
// Functions
// --------------------------------------
// --------------------------------------
// --------------------------------------
