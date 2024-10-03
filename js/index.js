
const listOfDeals = []
const body = document.querySelector('body')
const popapCloseButton = document.querySelectorAll('.close-popap')
const table = document.querySelector('table')
const url = 'https://plotpet2015.amocrm.ru'
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijk1YjEwMzYyNjg3MGRlYzEyZGY3YjIzMmIwMTIyNmMwM2I0MTVhNDdlMzdmYzQ3NDE3MjY0NjY4ZmM1OWRhMzY2NDQ4NTU3ZjVjY2Y3YjE3In0.eyJhdWQiOiI5NTZhYWYxYi1kYzY3LTRiNmEtYjc0ZC1mMDg4MDM4M2M3ZjMiLCJqdGkiOiI5NWIxMDM2MjY4NzBkZWMxMmRmN2IyMzJiMDEyMjZjMDNiNDE1YTQ3ZTM3ZmM0NzQxNzI2NDY2OGZjNTlkYTM2NjQ0ODU1N2Y1Y2NmN2IxNyIsImlhdCI6MTcyNzg1NzM2NywibmJmIjoxNzI3ODU3MzY3LCJleHAiOjE3Mjg1MTg0MDAsInN1YiI6IjExNTc4MzE4IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxOTc3MDQ2LCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiZjBhZDc3MjctNDNlZC00NzhhLTg1MmMtMzcyNTA1NWI4ZjI4IiwiYXBpX2RvbWFpbiI6ImFwaS1iLmFtb2NybS5ydSJ9.EgEYPfX_eqiTkoSowXH-3M8el_P4IKdC_7MaPwih9Dvcqczsp0zR8U1rekJxQpLEgmKhfYW4KYuMK6HqNP7UUhj7a_XUfaFwaeAcGR25qjqdbKt3x9MLf_vc28IQihGk7cRARWabAp6CWwUC0OYct6JO2mkK_v5Q2o28sfGOxAcTpRrefPa5UAh1PbXdft_AvCGNfljb5QEYvHGV749Y-RyqF1qcYr_cubShr6F0dX_ou9Jb-ghGhSjluOLgL8v-duBBGkQsHBNLcLtz3_sMxFZKnIHgQVjo2IHl62bYkF1lcjCxKB5F0jg_XyoZGYu1KS_1xnc7Dz7Ht_e-zSXx-g'

getDeals(token, url)

async function getDeals (token, url) {
    try {
        let pageNumber = 1

        const intId = setInterval(async()=>{
            const res = await fetch(`${url}/api/v4/leads?page=${pageNumber++}&limit=3`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
            });

            const data = await res.json()

            const listOfDeals = []
            listOfDeals.push(...data._embedded.leads)

            addArrayInHtml(listOfDeals, table)

            if(!data._links.next){
               clearInterval(intId) 
               addEventForPopap(token, url)
            }

        },1000)
        
    } catch (e) {
      console.log(e);
      
    }
}

function addArrayInHtml(arr, el){
   innerObj = arr.map((item)=>{
        return(`<tr id="${item.id}"  class="link-popap">
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.price}</td>
        </tr>`)
    })
    
   return el.insertAdjacentHTML('beforeend', innerObj.join(''));
    
}

function addEventForPopap(token, url){

    const links = document.querySelectorAll('.link-popap')
        
    if (links.length > 0) {

        for (let i = 0; i < links.length; i++) {

            const popapLink = links[i];

            popapLink.addEventListener('click',(e)=>{

                const popap = document.getElementById('deal')
                e.target.parentNode.classList.add('loading')

                getDealById(e.target.parentNode,token, url)

                setTimeout(() => {

                    popapOpen(popap) 
                    e.target.parentNode.classList.remove('loading')

                }, 500);
                
                e.preventDefault()
            })
        }
    }
}

if(popapCloseButton.length > 0){
    for (let i = 0; i < popapCloseButton.length; i++) {
        const el = popapCloseButton[i];
        el.addEventListener('click',(e)=>{
            popapClose(el.closest('.modal'))
            e.preventDefault()
        })
    }
}

function popapOpen(popap) {
    if(popap){
        popap.classList.add('open')
        popap.addEventListener('click',(e)=>{
            if(!e.target.closest('.modal__content')){
                popapClose(popap)
            }
        })
    }
}

function popapClose(popap) {  
    if (popap) {
        popap.classList.remove('open') 
        const modalContent = document.querySelector('.wrapper-content')
        modalContent.innerHTML = null
    }
        
}

document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape'){
        const popapActive = document.querySelector('.modal.open')
        popapClose(popapActive)
    }
})

async function getDealById (parent, token, url) {
    try {
        const {id} = parent 

        if(id){

            const res = await fetch(`${url}/api/v4/leads/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
            });
            
            const data = await res.json()
            const modalWindow = document.querySelector('.wrapper-content')
            insertDataIntoModalWindow(data, modalWindow)

        }

    } catch (e) {
      console.log(e);
    }
}

function insertDataIntoModalWindow(data, el){

    const blockContent = document.createElement('div')
    blockContent.innerHTML = `
        <h2>${data.name}</h2>
        <p>id сделки: ${data.id}</p>
        <p>дата сделки: ${dateConversion(data.created_at)} </p>
        <div class="task ${dateComparison(data.closest_task_at)}">статус задачи:</div>        
    ` 
    blockContent.classList.add('content')
    el.insertAdjacentElement('beforeend', blockContent);

}

function dateComparison(timestamp) {
    
    let status = 'red'

    if (timestamp) {
        const todey = new Date()
        todey.setHours(0, 0, 0, 0) 
        const dateTask = new Date(timestamp * 1000)
        dateTask.setHours(0,0,0,0)
        
        if(todey.getTime() === dateTask.getTime()){
            return status = 'green'
        }
        if (todey.getTime() > dateTask.getTime()) {
            return status = 'red'
        }
        if(todey.getTime() < dateTask.getTime()){
            return 'yellow'
        }
    }
    
    return status
        
}

function dateConversion(timestamp) {
    const date = new Date(timestamp*1000)
    date.setHours(0,0,0,0)
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const number = date.getDate();
    return number+' '+month+' '+year
}

