// ==========================
// 溫暖備料系統 V1
// app.js
// ==========================



// ==========================
// 顯示頁面
// ==========================


function showPage(page){


document
.querySelectorAll(".page")
.forEach(item=>{


item.classList.remove("show");


});



document
.getElementById(page)
.classList.add("show");


}






// ==========================
// 建立品項卡
// ==========================


function createItem(name){



let data =
prepareData[name];



return `


<div class="item">


<div class="item-name">

${name}

</div>



<div class="qty-box">


<button class="qty-btn"

onclick="changeQty('${name}',-1)">

－

</button>



<div class="qty-number"

id="qty-${name}">

${data.qty}

</div>



<button class="qty-btn"

onclick="changeQty('${name}',1)">

＋

</button>



</div>





<div class="action-box">


${

data.availableActions.map(action=>`


<button

class="action-btn"

id="${name}-${action}"

onclick="toggleAction('${name}','${action}')"

>

${action}

</button>


`).join("")

}


</div>



</div>


`;

}





// ==========================
// 顯示分類
// ==========================


function renderList(list,target){



let html="";



list.forEach(item=>{


html += createItem(item);


});



document.getElementById(target)
.innerHTML=html;


}





// ==========================
// 數量調整
// ==========================


function changeQty(name,num){



prepareData[name].qty += num;



if(
prepareData[name].qty < 0
){

prepareData[name].qty=0;

}



document
.getElementById(
"qty-"+name
)
.innerHTML =
prepareData[name].qty;


}







// ==========================
// 選擇處理方式
// ==========================


function toggleAction(name,action){



let list =
prepareData[name].actions;



let index =
list.indexOf(action);



let button =
document.getElementById(
name+"-"+action
);



if(index>-1){


list.splice(index,1);


button.classList.remove(
"active"
);


}

else{


list.push(action);


button.classList.add(
"active"
);


}


}







// ==========================
// 醬料
// ==========================


// ==========================
// 醬料系統 V1.2
// ==========================


const sauceState = {};





function renderSauce(){


let html="";



sauceData.forEach((sauce,index)=>{


html += `


<div class="item">


<div class="item-name">

☑ ${sauce.name}

</div>



<button

class="action-btn"

onclick="toggleSauce(${index})"

>

選擇製作

</button>



<div id="sauce-${index}"></div>



</div>


`;


});



document
.getElementById("sauceList")
.innerHTML=html;


}






function toggleSauce(index){


let sauce =
sauceData[index];



if(
sauceState[sauce.name]
){


delete sauceState[sauce.name];


document
.getElementById(
"sauce-"+index
)
.innerHTML="";


}

else{


sauceState[sauce.name]={};



showSauceMaterial(index);


}


}







function showSauceMaterial(index){


let sauce =
sauceData[index];



let html="";



sauce.materials.forEach(item=>{


if(
!sauceState[sauce.name][item]
){

sauceState[sauce.name][item]=0;

}



html += `


<div class="qty-box">


<div style="flex:1">

${item}

</div>



<button class="qty-btn"

onclick="changeSauceQty('${sauce.name}','${item}',-1)"

>

－

</button>



<div class="qty-number"

id="sauce-${sauce.name}-${item}"

>

${sauceState[sauce.name][item]}

</div>



<button class="qty-btn"

onclick="changeSauceQty('${sauce.name}','${item}',1)"

>

＋

</button>


</div>


`;



});



document
.getElementById(
"sauce-"+index
)
.innerHTML=html;


}







function changeSauceQty(
sauce,
item,
num
){



sauceState[sauce][item]+=num;



if(
sauceState[sauce][item]<0
){

sauceState[sauce][item]=0;

}



document
.getElementById(
"sauce-"+sauce+"-"+item
)
.innerHTML =
sauceState[sauce][item];


}
