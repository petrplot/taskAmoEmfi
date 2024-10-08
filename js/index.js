

const body = document.querySelector('body')
const popupCloseButton = document.querySelectorAll('.close-popap')
const table = document.querySelector('table')
const url = 'https://plotpet2015.amocrm.ru'
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijk1YjEwMzYyNjg3MGRlYzEyZGY3YjIzMmIwMTIyNmMwM2I0MTVhNDdlMzdmYzQ3NDE3MjY0NjY4ZmM1OWRhMzY2NDQ4NTU3ZjVjY2Y3YjE3In0.eyJhdWQiOiI5NTZhYWYxYi1kYzY3LTRiNmEtYjc0ZC1mMDg4MDM4M2M3ZjMiLCJqdGkiOiI5NWIxMDM2MjY4NzBkZWMxMmRmN2IyMzJiMDEyMjZjMDNiNDE1YTQ3ZTM3ZmM0NzQxNzI2NDY2OGZjNTlkYTM2NjQ0ODU1N2Y1Y2NmN2IxNyIsImlhdCI6MTcyNzg1NzM2NywibmJmIjoxNzI3ODU3MzY3LCJleHAiOjE3Mjg1MTg0MDAsInN1YiI6IjExNTc4MzE4IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxOTc3MDQ2LCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiZjBhZDc3MjctNDNlZC00NzhhLTg1MmMtMzcyNTA1NWI4ZjI4IiwiYXBpX2RvbWFpbiI6ImFwaS1iLmFtb2NybS5ydSJ9.EgEYPfX_eqiTkoSowXH-3M8el_P4IKdC_7MaPwih9Dvcqczsp0zR8U1rekJxQpLEgmKhfYW4KYuMK6HqNP7UUhj7a_XUfaFwaeAcGR25qjqdbKt3x9MLf_vc28IQihGk7cRARWabAp6CWwUC0OYct6JO2mkK_v5Q2o28sfGOxAcTpRrefPa5UAh1PbXdft_AvCGNfljb5QEYvHGV749Y-RyqF1qcYr_cubShr6F0dX_ou9Jb-ghGhSjluOLgL8v-duBBGkQsHBNLcLtz3_sMxFZKnIHgQVjo2IHl62bYkF1lcjCxKB5F0jg_XyoZGYu1KS_1xnc7Dz7Ht_e-zSXx-g'

getDeals(token, url, table)

async function getDeals (token, url, htmlElement) {
    try {
        let pageNumber = 1

        const intervalId = setInterval(async()=>{

            const response = await fetch(`${url}/api/v4/leads?page=${pageNumber++}&limit=3`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
            });

            const data = await response.json()

            const listOfDeals = []
            listOfDeals.push(...data._embedded.leads)

            addArrayDealsInHtml(listOfDeals, htmlElement)

            if(!data._links.next){
               clearInterval(intervalId) 
               addEventForPopup(token, url)
            }

        },1000)
        
    } catch (error) {
      console.log(error);
    }
}

function addArrayDealsInHtml(arrayDeals, htmlElement){
   innerObject = arrayDeals.map((deal)=>{
        return(`<tr id="${deal.id}"  class="link-popup">
            <td>${deal.id}</td>
            <td>${deal.name}</td>
            <td>${deal.price}</td>
        </tr>`)
    })
    
   return htmlElement.insertAdjacentHTML('beforeend', innerObject.join(''));
    
}

function addEventForPopup(token, url){

    const links = document.querySelectorAll('.link-popup')
        
    if (links.length > 0) {

        for (let i = 0; i < links.length; i++) {

            const popupLink = links[i];

            popupLink.addEventListener('click',(event)=>{
                event.preventDefault()

                const popup = document.getElementById('deal')
                event.target.parentNode.classList.add('loading')

                getDealById(event.target.parentNode, token, url)

                setTimeout(() => {

                    popupOpen(popup) 
                    event.target.parentNode.classList.remove('loading')

                }, 500);
                
            })
        }
    }
}

if(popupCloseButton.length > 0){

    for (let i = 0; i < popupCloseButton.length; i++) {

        const closeButton = popupCloseButton[i];

        closeButton.addEventListener('click',(event)=>{
            event.preventDefault()

            popupClose(closeButton.closest('.modal'))

        })
    }
}

function popupOpen(popup) {

    if(popup){

        popup.classList.add('open')

        popup.addEventListener('click',(event)=>{

            if(!event.target.closest('.modal__content')){

                popupClose(popup)

            }
        })
    }
}

function popupClose(popup) { 

    if (popup) {

        popup.classList.remove('open') 

        const popupContent = document.querySelector('.wrapper-content')
        popupContent.innerHTML = null

    }
        
}

document.addEventListener('keydown', (event) => {

    if(event.key === 'Escape'){

        const popupActive = document.querySelector('.modal.open')
        popupClose(popupActive)

    }
})

async function getDealById (parent, token, url) {
    try {

        const {id} = parent 

        if(id){

            const response = await fetch(`${url}/api/v4/leads/${id}`, {

                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
            });
            
            const data = await response.json()

            const popupContent = document.querySelector('.wrapper-content')
            insertDealsDataIntoPopup(data, popupContent)

        }

    } catch (e) {
      console.log(e);
    }
}

function insertDealsDataIntoPopup(deal, popup){

    const popupContent = document.createElement('div')

    popupContent.innerHTML = `
        <h2>${deal.name}</h2>
        <p>id сделки: ${deal.id}</p>
        <p>дата сделки: ${dateConversion(deal.created_at)} </p>
        <div class="task ${dateComparison(deal.closest_task_at)}">статус задачи:</div>        
    ` 
    popupContent.classList.add('content')

    popup.insertAdjacentElement('beforeend', popupContent);

}

function dateComparison(timestamp) {
    
    if (timestamp) {

        const todey = new Date()
        todey.setHours(0, 0, 0, 0) 

        const dateTask = new Date(timestamp * 1000)
        dateTask.setHours(0,0,0,0)
        
        if(todey.getTime() === dateTask.getTime()){
            return 'green'
        }
        if (todey.getTime() > dateTask.getTime()) {
            return 'red'
        }
        if(todey.getTime() < dateTask.getTime()){
            return 'yellow'
        }
    }
    
    return 'red'
        
}

function dateConversion(timestamp) {

    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    const date = new Date(timestamp*1000)
    date.setHours(0,0,0,0)

    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const number = date.getDate();

    return number+' '+month+' '+year
}

