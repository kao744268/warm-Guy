// ===================================
// 溫暖酒場｜智慧備料系統 V2.1
// app.js
// ===================================


let prepData = JSON.parse(
    localStorage.getItem("prepData")
) || {};


let saucePrep = JSON.parse(
    localStorage.getItem("saucePrep")
) || {};





function saveData(){

    localStorage.setItem(
        "prepData",
        JSON.stringify(prepData)
    );


    localStorage.setItem(
        "saucePrep",
        JSON.stringify(saucePrep)
    );

}







// ======================
// 初始化
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
// 分頁
// ======================


function showPage(id){


document
.querySelectorAll("section")
.forEach(
x=>x.classList.remove("active")
);



document
.getElementById(id)
.classList.add("active");


}







// ======================
// 一般品項
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

class="${item.actions.includes(a) ? 'active':''}"

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



document
.getElementById(id)
.innerHTML=html;


}







function changeQty(name,num){


prepData[name].qty += num;


if(prepData[name].qty<0){

prepData[name].qty=0;

}



saveData();


refresh();


}







function toggleAction(name,action){


let list =
prepData[name].actions;



if(
list.includes(action)
){


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
// 醬料系統 V2.1
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


if(
!saucePrep[s.name].materials[m]
){


saucePrep[s.name].materials[m]={

checked:false,

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





<div id="sauce-box-${index}">


${

data.enabled ?

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



let data =
saucePrep[sauce.name];



let html="";



html += `

<p>

材料：

</p>

`;




sauce.materials.forEach(m=>{


let item=data.materials[m];



html += `


<div class="row">


<label style="flex:1">



<div class="row">


<span style="flex:1">

${m}

</span>



<button onclick="changeSauceQty('${sauce.name}','${m}',-1)">
－
</button>



<span>

${item.qty}

</span>



<button onclick="changeSauceQty('${sauce.name}','${m}',1)">
＋
</button>



</div>


${m}


</label>



<button

onclick="changeSauceQty('${sauce.name}','${m}',-1)"

>

－

</button>



<span>

${item.qty}

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










}







function changeSauceQty(sauce,item,num){


let target =
saucePrep[sauce].materials[item];



target.qty += num;



if(target.qty<0){

target.qty=0;

}



saveData();



renderSauce();


}









// ======================
// LINE輸出
// ======================


function createLINE(){



let text =

"【🍶 溫暖酒場 今日備料】\n\n";






function addCategory(title,list){



let result="";



list.forEach(name=>{


let item=prepData[name];



if(item.qty>0){


result +=

`□ ${name} × ${item.qty}\n`;



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







let sauceText="";



sauceData.forEach(s=>{


let data=saucePrep[s.name];



if(!data.enabled)return;



let materialText="";



Object.keys(data.materials)
.forEach(m=>{


let item=data.materials[m];



if(
item.qty>0
)


materialText +=

`□ ${m} × ${item.qty}\n`;


}



});



if(materialText){


sauceText +=

`☑ ${s.name}\n\n`+

materialText+

"\n";


}


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








function copyLINE(){


navigator.clipboard.writeText(

document.getElementById("lineText").value

);


alert("已複製");


}








// ======================
// 更新
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


function resetAll(){


let confirmReset =
confirm(
"確定要清除今日全部備料嗎？"
);



if(!confirmReset){

return;

}



// 清除一般品項

Object.keys(prepData)
.forEach(name=>{


prepData[name]={

qty:0,

actions:[],

availableActions:
prepData[name].availableActions

};


});




// 清除醬料

Object.keys(saucePrep)
.forEach(name=>{


saucePrep[name].enabled=false;


Object.keys(
saucePrep[name].materials
)
.forEach(m=>{


saucePrep[name]
.materials[m]={

checked:false,

qty:0

};


});


});




// 清除LINE

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
try{

refresh();

showPage("drink");

}catch(e){

console.log(e);

}

refresh();


showPage("drink");
