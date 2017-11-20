//
// TODO:
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

// FIXME:
// Tag data doesn't update correctly all the time as tags are added
// and removed from the view layer

// --------------------------------------
// --------------------------------------
// --------------------------------------
// Global variables
// --------------------------------------
// --------------------------------------
// --------------------------------------

let notes = loadExistingNotes();

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
    $('.tag').addClass('delete-mark');
    controlPressed = true; 
  }
});

$(document).on('keyup', function(e) {
  const keyPressed = e.which;

  if (keyPressed === controlKey) {
    $('mark').removeClass('delete-mark');
    $('.tag').removeClass('delete-mark');
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
  const selection = window.getSelection();
  const text      = selection.toString();

  // Don't allow the user to highlight notes that
  // are in the notes sidebar... no META NOTES
  const hasNotesAsParent = $(selection.anchorNode)
                            .closest('#notes')
                            .length > 0;

  if (text && !hasNotesAsParent) {
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


function loadExistingNotes() {
  // TODO: read from database or read from server 

  return {};
}


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

      $(`#notes .${className}`).remove();

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
    noteText : "",
    tags     : []
  };

  addMarkView(
    markClassName,
    notes[markClassName].markText,
    notes[markClassName].noteText,
    notes[markClassName].tags
  );
}

function addMarkView(markClassName, markText, noteText, tags) {
  $('#notes > div').append(`
      <div class="mark ${markClassName}">
        <div class="tags"></div>
        <span>${markText}</span>
        <textarea>${noteText}</textarea>
        <input type="text" value="${tags}"/>
      </div>`
  );

  $(`.mark.${markClassName} textarea`).on('keyup', function(e) {   
    // updating the data object
    notes[markClassName].noteText = $(this).val();
  });

  $(`.mark.${markClassName} input`).on('keyup', function(e) {   
    if (e.which === 13 && $(this).val()) {
      const text = $(this).val();
      // updating the data object
      notes[markClassName].tags.push(text);
      // clearing the input box
      $(this).val('');

      addTagView(markClassName, text);
    }
  });
}

function addTagView(markClassName, text) {
  $(`.mark.${markClassName} .tags`).append(`<span class="tag">${text}</span>`);

  const tags             = $(`.mark.${markClassName} .tags`).children();
  const numOfTags        = tags.length;
  const latestTagElement = $( $(tags)[tags.length-1] );

  $(latestTagElement).on('click', function(e) {
    if (controlPressed) {
      // update view
      $(this).remove();

      // update data
      notes[markClassName].tags = notes[markClassName].tags.filter(text => {
        return text !== $(this).text();
      });
    }
  });
}


$('#search-notes').on('keyup', function() {
  search($(this).val()); 
});

function search(text) {
  const cleanText = text.trim().toLowerCase();

  let matchingNotes = {};

  $('#notes > div').html('');

  for (const key in notes) {
    const note              = notes[key];
    const combinedTagString = note.tags.join(' ');

    if (
      (
        combinedTagString.toLowerCase().includes(text) ||
        note.markText.toLowerCase().includes(text) ||
        note.noteText.toLowerCase().includes(text)
      ) || (!text)
    ) {
      matchingNotes[key] = notes[key];

      addMarkView(
        key,
        note.markText,
        note.noteText,
        note.tags
      );
    }
  }
}




// --------------------------------------
// --------------------------------------
// --------------------------------------
// Functions
// --------------------------------------
// --------------------------------------
// --------------------------------------


// --------------------------------------
// --------------------------------------
// --------------------------------------
// Debugging Crap
// --------------------------------------
// --------------------------------------
// --------------------------------------

$('#show-notes').on('click', function() {
  console.log(notes);
})

// --------------------------------------
// --------------------------------------
// --------------------------------------
// Debugging Crap
// --------------------------------------
// --------------------------------------
// --------------------------------------
