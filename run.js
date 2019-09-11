
console.log("Trello card actions extension running ")
function sleep(milliseconds) {
  var start = new Date().getTime()
  for (var i = 0 ; i < 1e7 ; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break
    }
  }
}
function triggerDragAndDrop(selectorDrag, selectorDrop) {

  // function for triggering mouse events
  var fireMouseEvent = function (type, elem, centerX, centerY) {
    var evt = document.createEvent('MouseEvents')
    evt.initMouseEvent(type, true, true, window, 1, 1, 1, centerX, centerY, false, false, false, false, 0, elem)
    elem.dispatchEvent(evt)
  }

  // fetch target elements
  var elemDrag = selectorDrag
  var elemDrop = selectorDrop
  if (!elemDrag || !elemDrop) return false

  // calculate positions
  var pos = elemDrag.getBoundingClientRect()
  var center1X = Math.floor((pos.left + pos.right) / 2)
  var center1Y = Math.floor((pos.top + pos.bottom) / 2)
  pos = elemDrop.getBoundingClientRect()
  var center2X = Math.floor((pos.left + pos.right) / 2)
  var center2Y = pos.top + 10

  // mouse over dragged element and mousedown
  fireMouseEvent('mousemove', elemDrag, center1X, center1Y)
  fireMouseEvent('mouseenter', elemDrag, center1X, center1Y)
  fireMouseEvent('mouseover', elemDrag, center1X, center1Y)
  fireMouseEvent('mousedown', elemDrag, center1X, center1Y)

  // start dragging process over to drop target
  fireMouseEvent('dragstart', elemDrag, center1X, center1Y)
  fireMouseEvent('drag', elemDrag, center1X, center1Y)
  fireMouseEvent('mousemove', elemDrag, center1X, center1Y)
  fireMouseEvent('drag', elemDrag, center2X, center2Y)
  fireMouseEvent('mousemove', elemDrop, center2X, center2Y)

  // trigger dragging process on top of drop target
  fireMouseEvent('mouseenter', elemDrop, center2X, center2Y)
  fireMouseEvent('dragenter', elemDrop, center2X, center2Y)
  fireMouseEvent('mouseover', elemDrop, center2X, center2Y)
  fireMouseEvent('dragover', elemDrop, center2X, center2Y)

  // release dragged element on top of drop target
  fireMouseEvent('drop', elemDrop, center2X, center2Y)
  fireMouseEvent('dragend', elemDrag, center2X, center2Y)
  fireMouseEvent('mouseup', elemDrag, center2X, center2Y)

  return true
}




function addButton(context)  {
    var done = document.createElement("button")
    done.onclick =  function() {
        triggerDragAndDrop(context,document.querySelectorAll(".list-wrapper")[1])
    }
    done.style.backgroundColor = "#4DA503"
    // done.style.backgroundColor = "red"
    done.style.height = "15px"
    done.style.zIndex = "99999"
    done.style.marginLeft = "10px"
    done.style.borderRadius = "50%"
    done.classList.add("card_action")


    var trash = document.createElement("button")
    trash.onclick =  function() {
        triggerDragAndDrop(context,document.querySelectorAll(".list-wrapper")[6])
    }
    trash.style.backgroundColor = "orange"
    trash.style.height = "15px"
    trash.style.width = "5px"
    trash.style.zIndex = "99999"
    trash.style.borderRadius = "50%"
    trash.classList.add("card_action")

    context.querySelector(".list-card-title").appendChild(done)
    context.querySelector(".list-card-title").appendChild(trash)

    return context
}

function applyListenerToCard(card) {
    card.addEventListener("mouseover", function (x) {
        if (card.querySelector(".card_action")) {
            return
        }
        cleanupButtons()
        addButton(card)
    })
}

function cleanupButtons() {
    document.querySelectorAll(".card_action").forEach(el => el.parentNode.removeChild(el))
}

function domListToList(x) {
    return Array.prototype.slice.call(x)
}

function getBoard() {
    return document.getElementById('board')
}
function applyListenerToAllCards() {
    domListToList(getBoard().querySelectorAll(".list-card")).map(applyListenerToCard);
}



window.onload = function() {
    applyListenerToAllCards()
    // Select the node that will be observed for mutations
    const targetNode = getBoard();

    // Options for the observer (which mutations to observe)
    const config = { attributes: false, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
        // for(let mutation of mutationsList) {
        //     if (mutation.type === 'childList') {
        //         console.log('A child node has been added or removed.');
        //     }
        //     else if (mutation.type === 'attributes') {
        //         console.log('The ' + mutation.attributeName + ' attribute was modified.');
        //     }
        // }
        sleep(3)
        applyListenerToAllCards()
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
}
