// ===================================
// 溫暖酒場｜智慧備料系統 V2.3
// app.js
// ===================================


let prepData = {};
let saucePrep = {};



// ======================
// 載入資料
// ======================


function loadData(){


try{


prepData =
JSON.parse(
localStorage.getItem("warmPrepData")
) || {};



saucePrep =
JSON.parse(
localStorage.getItem("warmSauceData")
) || {};



}catch(e){


prepData={};

saucePrep={};


}


}






function saveData(){


localStorage.setItem(

"warmPrepData",

JSON.stringify(prepData)

);



localStorage.setItem(

"warmSauceData",

JSON.stringify(saucePrep)

);


}






loadData();







// ======================
// 初始化品項
// ======================


function initItem(name,actions){


if(!prepData[name]){


prepData[name]={

qty:0,

actions:[],

availableActions:actions

};


}


}





drinkData.forEach(
item=>initItem(item,drinkActions)
);



foodData.forEach(
item=>initItem(item,foodActions)
);



stuffData.forEach(
item=>initItem(item,stuffActions)
);







// ======================
// 分頁
// ======================


function showPage(id){


document
.querySelectorAll("section")
.forEach(
x=>x.classList.remove("active")
);



let page=document.getElementById(id);



if(page){

page.classList.add("active");

}


}






// ======================
// 品項顯示
// ======================


function renderItems(list,id){


let html="";



list.forEach(name=>{


let item=prepData[name];



html += `

<div class="card">


<h3>${name}</h3>



<div class="row">


<button onclick="changeQty('${name}',-1)">
－
</button>



<span>
${item.qty}
</span>



<button onclick="changeQty('${name}',1)">
＋
</button>


</div>



<div>

${

item.availableActions.map(a=>`

<button

class="${item.actions.includes(a)?'active':''}"

onclick="toggleAction('${name}','${a}')"

>

${a}

</button>

`).join("")

}

</div>


</div>

`;



});



document.getElementById(id).innerHTML=html;


}// ======================
// 品項操作
// ======================



function changeQty(name,num){


prepData[name].qty += num;



if(prepData[name].qty < 0){

prepData[name].qty=0;

}



saveData();


refresh();


}






function toggleAction(name,action){


let actions =
prepData[name].actions;



if(actions.includes(action)){


prepData[name].actions =
actions.filter(
x=>x!==action
);



}else{


actions.push(action);


}



saveData();


refresh();


}







// ======================
// 醬料初始化
// ======================



function initSauce(){



sauceData.forEach(s=>{


if(!saucePrep[s.name]){


saucePrep[s.name]={

enabled:false,

materials:{}

};


}



s.materials.forEach(m=>{


if(!saucePrep[s.name].materials[m]){


saucePrep[s.name]
.materials[m]={

qty:0

};


}



});



});



saveData();


}




initSauce();







// ======================
// 醬料顯示
// ======================



function renderSauce(){


let html="";



sauceData.forEach(s=>{


let data=saucePrep[s.name];



html += `


<div class="card">


<h3>


<label>


<input

type="checkbox"

${data.enabled?"checked":""}

onchange="toggleSauce('${s.name}')"

>


${s.name}


</label>


</h3>



${

data.enabled ?

renderSauceMaterial(s)

:

""

}



</div>


`;



});



document
.getElementById("sauce")
.innerHTML=html;


}








function toggleSauce(name){


saucePrep[name].enabled =

!saucePrep[name].enabled;



saveData();



renderSauce();


}







function renderSauceMaterial(sauce){


let html="";



let data=saucePrep[sauce.name];



sauce.materials.forEach(m=>{


html += `


<div class="row">


<span style="flex:1">

${m}

</span>



<button

onclick="changeSauceQty('${sauce.name}','${m}',-1)"

>

－

</button>



<span>

${data.materials[m].qty}

</span>



<button

onclick="changeSauceQty('${sauce.name}','${m}',1)"

>

＋

</button>



</div>


`;



});



return html;


}







function changeSauceQty(sauce,item,num){


saucePrep[sauce]
.materials[item]
.qty += num;



if(
saucePrep[sauce]
.materials[item]
.qty < 0
){


saucePrep[sauce]
.materials[item]
.qty=0;


}



saveData();



renderSauce();


}// ======================
// LINE 備料通知
// ======================


function createLINE(){


let text =
"【🍶 溫暖酒場 今日備料】\n\n";





function addCategory(title,list){


let result="";



list.forEach(name=>{


let item=prepData[name];



if(
item.qty>0 ||
item.actions.length>0
){



result +=

`□ ${name}`;



if(item.qty>0){

result +=

` × ${item.qty}`;

}



result+="\n";




item.actions.forEach(a=>{


result +=

`　→ ${a}\n`;



});



result+="\n";


}



});





if(result){


text +=

title+

"\n\n"+

result+

"────────\n\n";


}



}







addCategory(
"🍺 酒水",
drinkData
);



addCategory(
"🥩 食材",
foodData
);



addCategory(
"🧹 雜物",
stuffData
);









// 醬料

let sauceText="";



sauceData.forEach(s=>{


let sauce=saucePrep[s.name];



if(!sauce.enabled){

return;

}




sauceText +=

`☑ ${s.name}\n`;




Object.keys(
sauce.materials
)
.forEach(m=>{


let qty =
sauce.materials[m].qty;



if(qty>0){


sauceText +=

`　□ ${m} × ${qty}\n`;


}



});



sauceText+="\n";



});






if(sauceText){


text +=

"🥫 醬料製作\n\n"+

sauceText;


}







document
.getElementById("lineText")
.value=text;



}







// ======================
// 複製 LINE
// ======================



function copyLINE(){



navigator.clipboard.writeText(

document.getElementById("lineText").value

);



alert(
"已複製備料通知"
);



}// ======================
// 一鍵歸零
// ======================


function resetAll(){


let check =
confirm(
"確定清除今日全部備料？"
);



if(!check){

return;

}







Object.keys(prepData)
.forEach(name=>{


prepData[name].qty=0;


prepData[name].actions=[];


});







Object.keys(saucePrep)
.forEach(name=>{


saucePrep[name].enabled=false;



Object.keys(
saucePrep[name].materials
)
.forEach(m=>{


saucePrep[name]
.materials[m]
.qty=0;


});


});







let line =
document.getElementById("lineText");



if(line){

line.value="";

}



saveData();


refresh();



alert(
"今日備料已歸零"
);



}









// ======================
// 更新畫面
// ======================



function refresh(){


renderItems(
drinkData,
"drink"
);



renderItems(
foodData,
"food"
);



renderItems(
stuffData,
"stuff"
);



renderSauce();


}








// ======================
// 啟動
// ======================



refresh();


showPage("drink");
