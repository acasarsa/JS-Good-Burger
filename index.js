const burgerURL = 'http://localhost:3000/burgers' // used in fetch calls - 2
const burgerMenu = document.getElementById('burger-menu') // used in addCard & to add a listener to it
const orderList = document.getElementById('order-list') // used to add to order list via 2 dif ways. could not abstract 
// because text came from event.target and from user input

document.addEventListener("DOMContentLoaded", () => { 
  //Implement Your Code Here
  getBurgers() // fetch call and renders via addCard for each json element
  addListenerToAddOrderBtn() // adds a listener to card button
  submitNewBurger() // runs several helper functions to add burger to db, display on dom
  // and then also adds newBurger to orderList

})

// fetch & render burgers
function getBurgers () { 
  fetch(burgerURL) // make fetch req to baseURL
  .then(resp => resp.json()) // gets promise resolves and returns promise value of an array or other obj
  .then(burgers => {  // burgers is a variable for the promise value obj it takes a callback fn as arg 
    burgers.forEach(burger => {  // callback applies forEach that also takes a callback 
      addCard(burger) // this interpolates each burger into html that is added to the dom via append
    });
    
  })
  
}
//

function addCard (burger) {
  
  const div = document.createElement('div') // creates the div element you plan to add. 
  // generally must create something that you can then set innerHTML of and then append. 
  div.className = "burger"  // gives class
  div.dataset.id = burger.id // gives id in dataset.id very useful! 

  div.innerHTML = ` 
    <h3 class="burger_title">${burger.name}</h3>
    <img src="${burger.image}">
    <p class="burger_description">
    ${burger.description}
    </p>
    <button class="button" style="cursor:pointer">Add to Order</button>
  ` // created a bunch of html to go inside the div card. made dynamic with interpolation 

  burgerMenu.append(div)  // adds created div to an existing container on the DOM. 
}

//
//

function addListenerToAddOrderBtn () { // make the button click do a thing

  burgerMenu.addEventListener('click', (e) => { // find the element that holds all the buttons! and add to that. 
    // do not add to each one unless that makes sense 
  
    const parentDiv = e.target.parentNode // grab the node that the target is child of 
    const burgerName = parentDiv.querySelector('.burger_title') // so that you can find something from the target.parentNode innerHTML 
    
    clickAddOrder(burgerName) // takes an argument then does html stuff to it. 
    
    // const orderList = document.getElementById('order-list')
    // const li = document.createElement('li')
    // li.textContent = burgerName.textContent
    // orderList.append(li)

  })
}

//

function clickAddOrder (selectedBurger) { // abstraction of the html for the event click
    const li = document.createElement('li') // create the list item
    li.textContent = selectedBurger.textContent // set the text of it

    orderList.append(li) // add to dom
}

// add eventListener to .button on "submit"
//

////////////////////////
// new burger creation
///////////////////////

function submitNewBurger () {  
  const customBurgerForm = document.querySelector('#custom-burger') // find the form container

  customBurgerForm.addEventListener('submit', (e) => {  // add listener to submit form target submit
    e.preventDefault()
    // console.log(e.target)
    
    // post to menu container
    createBurgerFromForm(customBurgerForm) // since this returns newBurger it becomes available for postBurger
    // set inputs to a variable object 
    // then pass that to the post fetch fn | which will make post request 
    // will stringify(newBurger) so db can read it
    // and pass the single json item into addCard to put html on dom 
    postBurger(newBurger) // call fetch POST request to persist to db

    // add to order list
    const li = document.createElement('li') 
    li.textContent = newBurger.name
    orderList.append(li)

  })
}


//
//

function createBurgerFromForm (input) { // abstraction to create newBurger object and reset form after MUST return newBurger
  const newBurger = {
    name: input.name.value,
    description: input.description.value,
    image: input.url.value
  }
  input.reset()
  return newBurger // MUST return newBurger so that eventListener can use it when this is called
  // the return is how the object is pressed into existence otherwise cannot exist outside of it. 
  // also really not that important to abstract here... tbh 
}

//
//

function postBurger (newBurger) { // this is a helper function newBurger gets defined inside the eventListener
  // addCard(newBurger) if optimistic
  fetch(burgerURL, { // this makes post request to the db to persist newBurger
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json' 
    },
      body: JSON.stringify(newBurger)
  })
  .then(resp => resp.json())
  .then(burger => addCard(burger)) // adds newBurger to the DOM
}
