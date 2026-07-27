// ==========================
// 溫暖酒場備料系統 V2.1
// app.js
// ==========================


// ==========================
// 載入保存資料
// ==========================

const saveKey = "warmPrepData";

const saveSauceKey = "warmPrepSauce";



function loadData(){


let old =
localStorage.getItem(saveKey);



if(old){


let data =
JSON.parse(old);


Object.keys(data).forEach(item=>{


if(prepareData[item]){


prepareData[item]=data[item];


}


});


}



let sauceOld =
localStorage.getItem(saveSauceKey);



if(sauceOld){

sauceState =
JSON.parse(sauceOld);

}


}





// ==========================
// 儲存資料
// ==========================


function saveData(){


localStorage.setItem(

saveKey,

JSON.stringify(prepareData)

);



localStorage.setItem(

saveSauceKey,

JSON.stringify(sauceState)

);


}





// ==========================
// 分頁切換
// ==========================


function showPage(page){


let pages =
document.querySelectorAll(".page");



pages.forEach(item=>{


item.classList.remove("show");


});



document.getElementById(page)
.classList.add("show");


}





// ==========================
// 建立品項
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

actionList.map(action=>{


return `


<button

class="action-btn ${data.actions.includes(action)?'active':''}"

onclick="toggleAction('${name}','${action}')"

>

${action}

</button>


`;


}).join("")


}



</div>


</div>


`;

}






// ==========================
// 顯示酒水
// ==========================


function renderDrink(){


let html="";



drinkData.forEach(item=>{


html += createItem(item);


});



document.getElementById(

"drinkList"

).innerHTML=html;


}




// ==========================
// 顯示食材
// ==========================


function renderFood(){
// ==========================
// 顯示雜物
// ==========================


function renderStuff(){


let html="";


stuffData.forEach(item=>{


html += createItem(item);


});


document.getElementById(

"stuffList"

).innerHTML = html;


}

let html="";



foodData.forEach(item=>{


html += createItem(item);


});



document.getElementById(

"foodList"

).innerHTML=html;


}// ==========================
// 數量控制
// ==========================


function changeQty(name,num){


prepareData[name].qty += num;



if(prepareData[name].qty < 0){

prepareData[name].qty = 0;

}



let target = document.getElementById(
"qty-"+name
);



if(target){

target.innerHTML =
prepareData[name].qty;

}



saveData();


}






// ==========================
// 處理方式選擇
// ==========================


function toggleAction(name,action){


let list =
prepareData[name].actions;



let index =
list.indexOf(action);



if(index > -1){


list.splice(index,1);


}

else{


list.push(action);


}



saveData();



renderDrink();

renderFood();


}






// ==========================
// 醬料系統
// ==========================



let sauceState = {};





function renderSauce(){


let html="";



sauceData.forEach((sauce,index)=>{


html += `


<div class="sauce-card">


<h3>

<input

type="checkbox"

${sauceState[sauce.name] ? "checked":""}

onclick="toggleSauce(${index},this)"

>


${sauce.name}

</h3>



<div id="sauce-${index}"></div>


</div>


`;


});



document.getElementById(

"sauceList"

).innerHTML = html;



// 重新載入已選醬料

sauceData.forEach((sauce,index)=>{


if(sauceState[sauce.name]){


showSauceMaterial(index);


}


});


}







function toggleSauce(index,box){


let sauce =
sauceData[index];



if(box.checked){


if(!sauceState[sauce.name]){


sauceState[sauce.name]={

materials:{}

};


}


showSauceMaterial(index);


}

else{


delete sauceState[sauce.name];


document.getElementById(

"sauce-"+index

).innerHTML="";


}



saveData();


}






function showSauceMaterial(index){


let sauce =
sauceData[index];



let area =
document.getElementById(

"sauce-"+index

);



let html = "";



sauce.materials.forEach(item=>{


let qty =

sauceState[sauce.name]
.materials[item] || 0;



html += `


<div class="item">


<div class="item-name">

${item}

</div>


<div class="qty-box">


<button class="qty-btn"

onclick="changeSauceMaterial('${sauce.name}','${item}',-1)"

>

－

</button>


<div class="qty-number"

id="sauce-${sauce.name}-${item}"

>

${qty}

</div>


<button class="qty-btn"

onclick="changeSauceMaterial('${sauce.name}','${item}',1)"

>

＋

</button>


</div>


</div>


`;


});


area.innerHTML = html;


}







function changeSauceMaterial(
sauce,
material,
num
){



if(
!sauceState[sauce].materials[material]
){

sauceState[sauce].materials[material]=0;

}



sauceState[sauce].materials[material]+=num;



if(
sauceState[sauce].materials[material]<0
){

sauceState[sauce].materials[material]=0;

}



document.getElementById(

"sauce-"+sauce+"-"+material

).innerHTML =

sauceState[sauce]
.materials[material];



saveData();


}// ==========================
// LINE 文字產生
// ==========================


function createLINE(){


let text = "";



text += "【🍶 溫暖酒場備料】\n\n";

text += 
"📅 " +
new Date().toLocaleDateString("zh-TW")
+
"\n\n";




// ==========================
// 酒水
// ==========================


let drinkText="";


drinkData.forEach(item=>{


let data =
prepareData[item];



if(
data.qty > 0 ||
data.actions.length > 0
){


drinkText +=

"□ " +
item;



if(data.qty>0){

drinkText +=
" × " +
data.qty;

}


drinkText += "\n";



data.actions.forEach(action=>{


drinkText +=

"　→ " +
action +
"\n";


});



drinkText+="\n";


}


});



if(drinkText){


text +=

"🍺 酒水\n\n";


text += drinkText;


}







// ==========================
// 食材
// ==========================


let foodText="";


foodData.forEach(item=>{


let data =
prepareData[item];



if(
data.qty > 0 ||
data.actions.length > 0
){


foodText +=

"□ " +
item;



if(data.qty>0){

foodText +=
" × " +
data.qty;

}


foodText += "\n";



data.actions.forEach(action=>{


foodText +=

"　→ " +
action +
"\n";


});


foodText+="\n";


}


});



if(foodText){


text +=

"🥩 食材\n\n";


text += foodText;


}






// ==========================
// 醬料
// ==========================


let sauceText="";



Object.keys(sauceState)
.forEach(sauce=>{


sauceText +=

"【製作 " +
sauce +
"】\n";



let materials =
sauceState[sauce].materials;



Object.keys(materials)
.forEach(item=>{


if(materials[item]>0){


sauceText +=

"□ " +
item +
" × " +
materials[item]
+
"\n";


}


});



sauceText+="\n";


});



if(sauceText){


text +=

"🥫 醬料製作\n\n";


text += sauceText;


}





document.getElementById(

"lineText"

).value=text;


}


let text =
document.getElementById(
"lineText"
);



text.select();


document.execCommand(
"copy"
);



alert(
"已複製備料通知"
);


}







// ==========================
// 清除今日資料
// ==========================


function clearToday(){



if(
confirm(
"確定清除今天所有備料資料？"
)

){



Object.keys(prepareData)
.forEach(item=>{


prepareData[item]={


qty:0,

actions:[]


};


});



sauceState={};



saveData();



renderDrink();

renderFood();

renderSauce();



document.getElementById(
"lineText"
).value="";


}


}






// ==========================
// 啟動系統
// ==========================


loadData();



renderDrink();

renderFood();

renderStuff();

renderSauce();



showPage("drink");
