// ===================================
// 溫暖酒場｜智慧備料系統 V2.2
// app.js
// ===================================


// 清除舊版本資料格式
localStorage.removeItem("saucePrep_v1");



let prepData = JSON.parse(
    localStorage.getItem("prepData_v2")
) || {};



let saucePrep = JSON.parse(
    localStorage.getItem("saucePrep_v2")
) || {};





function saveData(){

    localStorage.setItem(
        "prepData_v2",
        JSON.stringify(prepData)
    );


    localStorage.setItem(
        "saucePrep_v2",
        JSON.stringify(saucePrep)
    );

}







// ======================
// 初始化一般品項
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
x=>initItem(x,drinkActions)
);


foodData.forEach(
x=>initItem(x,foodActions)
);


stuffData.forEach(
x=>initItem(x,stuffActions)
);







// ======================
// 頁面切換
// ======================


function showPage(id){


document
.querySelectorAll("section")
.forEach(
s=>s.classList.remove("active")
);



let page=document.getElementById(id);


if(page){

page.classList.add("active");

}


}







// ======================
// 一般品項顯示
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
item.availableActions.map(action=>`

<button

class="${item.actions.includes(action) ? "active":""}"

onclick="toggleAction('${name}','${action}')"

>

${action}

</button>

`).join("")
}


</div>


</div>


`;



});



document.getElementById(id).innerHTML=html;


}







// ======================
// 數量控制
// ======================


function changeQty(name,num){


prepData[name].qty += num;


if(prepData[name].qty < 0){

prepData[name].qty = 0;

}


saveData();

refresh();


}







// ======================
// 操作按鈕
// ======================


function toggleAction(name,action){


let list =
prepData[name].actions;



if(list.includes(action)){


prepData[name].actions =
list.filter(
x=>x!==action
);


}else{


list.push(action);


}



saveData();

refresh();


}// ======================
// 醬料系統 V2.2
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







function renderSauce(){


let html="";



sauceData.forEach((s,index)=>{


let sauce=saucePrep[s.name];



html += `


<div class="card">


<h3>


<label>


<input

type="checkbox"

${sauce.enabled ? "checked":""}

onchange="toggleSauce('${s.name}')"

>


${s.name}


</label>


</h3>




<div>


${

sauce.enabled ?

renderSauceMaterial(s)

:

""

}


</div>



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


let qty =
data.materials[m].qty;



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

${qty}

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


let data=saucePrep[s.name];



if(!data.enabled){

return;

}



sauceText +=

`☑ ${s.name}\n\n`;


});


// ======================
// 複製 LINE
// ======================


function copyLINE(){


navigator.clipboard.writeText(

document.getElementById("lineText").value

);



alert("已複製備料通知");


}









// ======================
// 一鍵歸零
// ======================


function resetAll(){



if(
!confirm(
"確定清除今日全部備料？"
)

){

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






let box =
document.getElementById("lineText");



if(box){

box.value="";

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
