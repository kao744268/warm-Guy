// ==========================
// 溫暖酒場備料系統 V2.0
// app.js
// ==========================



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




// 預設首頁

showPage("drink");





// ==========================
// 建立品項畫面
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
-
</button>


<div class="qty-number"

id="qty-${name}">
${data.qty}
</div>


<button class="qty-btn"

onclick="changeQty('${name}',1)">
+
</button>


</div>




<div class="action-box">


${

actionList.map(action=>{


return `

<button

class="action-btn"

id="${name}-${action}"

onclick="toggleAction('${name}','${action}')"

>

${action}

</button>

`

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


let html="";


foodData.forEach(item=>{


html += createItem(item);


});



document.getElementById(
"foodList"
).innerHTML=html;


}





// ==========================
// 數量控制
// ==========================


function changeQty(name,num){


prepareData[name].qty += num;



if(
prepareData[name].qty < 0
){

prepareData[name].qty=0;

}



document.getElementById(
"qty-"+name
).innerHTML =
prepareData[name].qty;


}





// ==========================
// 處理方式選擇
// ==========================


function toggleAction(name,action){


let list =
prepareData[name].actions;



let index =
list.indexOf(action);



let btn =
document.getElementById(
name+"-"+action
);



if(index>-1){


list.splice(index,1);


btn.classList.remove(
"active"
);


}

else{


list.push(action);


btn.classList.add(
"active"
);


}


}







// ==========================
// 醬料
// ==========================



let sauceState={};





function renderSauce(){


let html="";



sauceData.forEach((sauce,index)=>{


html += `


<div class="sauce-card">


<h3>


<input

type="checkbox"

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
).innerHTML=html;


}







function toggleSauce(index,box){


let area =
document.getElementById(
"sauce-"+index
);



let sauce =
sauceData[index];



if(box.checked){



sauceState[sauce.name]={

qty:0,

materials:{}

};




let html=`


<p>
⚠️ 製作 ${sauce.name}
</p>


`;



sauce.materials.forEach(item=>{


html += `


<div class="item">


<div class="item-name">

${item}

</div>


<div class="qty-box">


<button class="qty-btn"

onclick="changeSauceMaterial('${sauce.name}','${item}',-1)">
-
</button>


<div class="qty-number"

id="sauce-${sauce.name}-${item}">
0
</div>



<button class="qty-btn"

onclick="changeSauceMaterial('${sauce.name}','${item}',1)">
+
</button>


</div>


</div>


`;



});



area.innerHTML=html;



}

else{


delete sauceState[sauce.name];


area.innerHTML="";


}


}





function changeSauceMaterial(
sauce,
material,
num
){


if(
!sauceState[sauce].materials[material]
){

sauceState[sauce]
.materials[material]=0;

}



sauceState[sauce]
.materials[material]+=num;



if(
sauceState[sauce]
.materials[material]<0
){

sauceState[sauce]
.materials[material]=0;

}



document.getElementById(

"sauce-"+sauce+"-"+material

).innerHTML =

sauceState[sauce]
.materials[material];


}






// ==========================
// LINE產生
// ==========================



function createLINE(){


let text="";


text +=
"【溫暖酒場備料】\n\n";



text +=
"📅 "+
new Date()
.toLocaleDateString("zh-TW")
+
"\n\n";




// 酒水

let drinkText="";


drinkData.forEach(item=>{


let d =
prepareData[item];


if(d.qty>0){


drinkText +=

item+
" × "+
d.qty+
"\n";


d.actions.forEach(a=>{

drinkText +=
"　→ "+
a+
"\n";

});


}


});



if(drinkText){


text+="🍺 酒水\n\n";

text+=drinkText+"\n";


}






// 食材


let foodText="";


foodData.forEach(item=>{


let d =
prepareData[item];


if(d.qty>0){


foodText +=

item+
" × "+
d.qty+
"\n";


d.actions.forEach(a=>{

foodText +=
"　→ "+
a+
"\n";

});


}


});



if(foodText){


text+="🥩 食材\n\n";

text+=foodText+"\n";


}






// 醬料


let sauceText="";



Object.keys(sauceState)
.forEach(sauce=>{


sauceText +=

"【"+sauce+"】\n";



let materials =
sauceState[sauce].materials;



Object.keys(materials)
.forEach(item=>{


if(materials[item]>0){


sauceText +=

item+
" × "+
materials[item]
+
"\n";


}


});



sauceText+="\n";


});




if(sauceText){


text+="🥫 製作醬料\n\n";

text+=sauceText;


}




document.getElementById(
"lineText"
).value=text;


}







// ==========================
// 複製LINE
// ==========================



function copyLINE(){


let box =
document.getElementById(
"lineText"
);


box.select();


document.execCommand(
"copy"
);



alert(
"已複製備料通知"
);


}





// ==========================
// 啟動
// ==========================


renderDrink();

renderFood();

renderSauce();