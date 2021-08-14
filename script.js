  let body = document.querySelector("body");
  body.spellcheck = false;

  let menuBarPtags = document.querySelectorAll(".menu-bar p");
  let columnTags = document.querySelector(".column-tags");
  let rownumbers = document.querySelector(".row-numbers");

  let grid = document.querySelector(".grid");

  let mycells = document.querySelector(".mycells");

  let formulaSelectCell = document.querySelector("#select-cell");
  let forumlaInput = document.querySelector("#complete-formula");

  let oldCell;
  let dataObj = {};


  // --------------------------------------------------
  // selected cells checking down ;-)
  // --------------------------------------------------
  let blankcornver = document.querySelector
  for (let i = 0; i < menuBarPtags.length; i++) {
    menuBarPtags[i].addEventListener("click", function (e) {
      if (e.currentTarget.classList.contains("menu-bar-option-selected")) {
        e.currentTarget.classList.remove("menu-bar-option-selected");
      } else {
          for(let j = 0;j<menuBarPtags.length;j++){
              if(menuBarPtags[j].classList.contains("menu-bar-option-selected"))
              menuBarPtags[j].classList.remove("menu-bar-option-selected")
          }
        e.currentTarget.classList.add("menu-bar-option-selected");
      }
    });
  }


  // creating so all cells 
  // -----------------------------------------------------------
  for (let i = 0; i < 26; i++) {
    let div = document.createElement("div");
    div.classList.add("column-tag-cell");
    div.innerText = String.fromCharCode(65 + i);
    columnTags.append(div);
  }


  for (let i = 1; i <= 100; i++) {
    let div = document.createElement("div");
    div.classList.add("row-tag-cell");
    div.innerText = i;
    rownumbers.append(div);
  }


  for (let j = 1; j <= 100; j++) {
    let row = document.createElement("div");
    row.classList.add("row");


    for (let i = 0; i < 26; i++) {
      let cell = document.createElement("div");
      cell.classList.add("cell");
      let address = String.fromCharCode(i + 65) + j;  
      cell.setAttribute("data-address", address);  //setting a value with index means it defining every cell seprately
  // -----------------------------------------------------------

  // this is all for giving input from grid from 67 line to 194
  // ---------------------------------------------------------------------
      dataObj[address] = {
        value: "",
        formula: "",
        upstream: [],
        downstream: [],
      }; 

      cell.addEventListener("input",function(e){
        // console.log(e.currentTarget.innerText);
        let celladdress = e.currentTarget.getAttribute("data-address")
        dataObj[celladdress].value  = Number(e.currentTarget.innerText);
        // console.log(dataObj[celladdress]);
        dataObj[celladdress].formula = "";

  // ---------------------------------------------------------------------
  //for upstream downsteam clear krni hai unki jisme hum ate hai
        let currcellupstream = dataObj[celladdress].upstream;
        for(let i = 0 ; i < currcellupstream.length ;i++){
          removefromupstream(celladdress,currcellupstream[i]);
        }
        dataObj[celladdress].upstream = []

  // ---------------------------------------------------------------------
  //downstream ke cells ko update krna hai c = a + b  suppose this is for a
        let currcelldownstream = dataObj[celladdress].downstream;
        for(let i = 0 ; i < currcelldownstream.length ;i++){
          updateDownstreamElements(currcelldownstream[i]);
        }
      })
  // ---------------------------------------------------------------------
      cell.addEventListener("click", function (e) {
        //check kro koi old cell hai kya pehli se selected
        if (oldCell) {
          // agr han to use deselect kro class remove krke
          oldCell.classList.remove("grid-selected-cell");
        }
        //jis cell pr click kra use select kro class add krke
        e.currentTarget.classList.add("grid-selected-cell");

        let cellAddress = e.currentTarget.getAttribute("data-address");

        formulaSelectCell.value = cellAddress;

        //and ab jo naya cell select hogya use save krdo old cell wali variable taki next time agr click ho kisi nye cell pr to ise deselect kr pai
        oldCell = e.currentTarget;

      });

      cell.contentEditable = true;
      row.append(cell);

    }
    mycells.append(row);
  }


  //FORMULA TESTING IN DIFFENT COLUMS  //CLEAR THIS IN lATER
    // // ----------------------------------
    // dataObj["A1"].value = 20;
    // dataObj["A1"].downstream = ["B1"];

    // dataObj["B1"].value = 40;            

    // dataObj["B1"].formula = "2 * A1";
    // dataObj["B1"].upstream = ["A1"];
    
    // let a1 = grid.querySelector("[data-address='A1']")
    // let b1 = grid.querySelector("[data-address='B1']")
    // a1.innerText = 20;
    // b1.innerText = 40;
    // // ----------------------------------

    // formula bar working implementing dowm here
// ---------------------------------------------------------------------

    forumlaInput.addEventListener("change", function (e) {
      let formula = e.currentTarget.value; //"2 * A1"
    
      let selectedCellAddress = oldCell.getAttribute("data-address");
    
      dataObj[selectedCellAddress].formula = formula;
    
      let formulaArr = formula.split(" "); //["2","*","A1"]
    
      let elementsArray = [];
    
      for (let i = 0; i < formulaArr.length; i++) {
        if (
          formulaArr[i] != "+" &&
          formulaArr[i] != "-" &&
          formulaArr[i] != "*" &&
          formulaArr[i] != "/" &&
          isNaN(Number(formulaArr[i]))
        ) {
          elementsArray.push(formulaArr[i]);
        }
      }
    
      let oldUpstream = dataObj[selectedCellAddress].upstream;
    
      for (let k = 0; k < oldUpstream.length; k++) {
        removeFromUpstream(selectedCellAddress, oldUpstream[k]);
      }
    
      dataObj[selectedCellAddress].upstream = elementsArray;
    
      for (let j = 0; j < elementsArray.length; j++) {
        addToDownstream(selectedCellAddress, elementsArray[j]);
      }
    
      let valObj = {};
    
      for (let i = 0; i < elementsArray.length; i++) {
        let formulaDependency = elementsArray[i];
    
        valObj[formulaDependency] = dataObj[formulaDependency].value;
      }
    
      for (let j = 0; j < formulaArr.length; j++) {
        if (valObj[formulaArr[j]] != undefined) {
          formulaArr[j] = valObj[formulaArr[j]];
        }
      }
    
      formula = formulaArr.join(" ");
      let newValue = eval(formula);
    
      dataObj[selectedCellAddress].value = newValue;
    
      let selectedCellDownstream = dataObj[selectedCellAddress].downstream;
    
      for (let i = 0; i < selectedCellDownstream.length; i++) {
        updateDownstreamElements(selectedCellDownstream[i]);
      }
    
      oldCell.innerText = newValue;
      forumlaInput.value = "";
    });

    
// this addToDownstream is implemented on just formula bar
// ---------------------------------------------------------------------
  function addToDownstream(tobeAdded, inWhichWeAreAdding) {
    //get downstream of the cell in which we have to add
    let reqDownstream = dataObj[inWhichWeAreAdding].downstream;
  
    reqDownstream.push(tobeAdded);
  }

// ---------------------------------------------------------------------
// c1 = a + b ---> a and b k downsteam m jao or remove krdo apne c1 ko
// upstream clear krne ka functions
function removefromupstream(meracell,jiskecellseremovehonahai){
  let newdownstream = [];
  let olddownstream = dataObj[jiskecellseremovehonahai].downstream;
  for(let i = 0 ; i < olddownstream.length;i++){
    if(olddownstream[i] != meracell){
      newdownstream.push(olddownstream[i]);
    }
  }
  dataObj[jiskecellseremovehonahai].downstream = newdownstream;
}
// ---------------------------------------------------------------------
//jiske pass bhi upsteam m hum ate hai unki value change krwani hai kyu ki humne apni value bhi chnge krli hai to jo hume jante hai unki value bhi chnge krni jaruri hai
function updateDownstreamElements(elementAddress) {

  //1- jis element ko update kr rhe hai unki upstream elements ki current value leao
  //unki upstream ke elements ka address use krke dataObj se unki value lao
  //unhe as key value pair store krdo valObj naam ke obj me
  let valObj = {};

  let currCellUpstream = dataObj[elementAddress].upstream;

  for (let i = 0; i < currCellUpstream.length; i++) {
    let upstreamCellAddress = currCellUpstream[i];
    let upstreaCellValue = dataObj[upstreamCellAddress].value;

    valObj[upstreamCellAddress] = upstreaCellValue;
  }

  //2- jis element ko update kr rhe hai uska formula leao
  let currFormula = dataObj[elementAddress].formula;
  //formula ko space ke basis pr split maro
  let formulaArr = currFormula.split(" ");
  //split marne ke baad jo array mili uspr loop ara and formula me jo variable h(cells) unko unki value se replace krdo using valObj
  for (let j = 0; j < formulaArr.length; j++) {
    if (valObj[formulaArr[j]]) {
      formulaArr[j] = valObj[formulaArr[j]];
    }
  }

  //3- Create krlo wapis formula from the array by joining it
  currFormula = formulaArr.join(" ");

  //4- evaluate the new value using eval function
  let newValue = eval(currFormula);

  //update the cell(jispr function call hua) in dataObj
  dataObj[elementAddress].value = newValue;

  //5- Ui pr update krdo new value
  let cellOnUI = document.querySelector(`[data-address=${elementAddress}]`);
  cellOnUI.innerText = newValue;

  //6- Downstream leke ao jis element ko update kra just abhi kuki uspr bhi kuch element depend kr sakte hai
  //unko bhi update krna padega
  let currCellDownstream = dataObj[elementAddress].downstream;

  //check kro ki downstream me elements hai kya agr han to un sab pr yehi function call krdo jise wo bhi update hojai with new value
  if (currCellDownstream.length > 0) {
    for (let k = 0; k < currCellDownstream.length; k++) {
      updateDownstreamElements(currCellDownstream[k]);
    }
  }
}
// ---------------------------------------------------------------------
// dryrun on this formula C = A + B THIS FORMULA PART


/* ----------modal-for-file------------ */
let file = document.querySelector(".menu-bar p:nth-child(1)");

file.addEventListener("click", function (e) {
  if (e.currentTarget.classList.length == 0) {
    e.currentTarget.innerHTML = `File
    <span>
     <span>Clear</span>
     <span>Open</span>
     <span>Save</span>
    </span>`;
  } else {
    e.currentTarget.innerHTML = `File`;
  }
});


