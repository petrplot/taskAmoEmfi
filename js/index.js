

const body = document.querySelector('body')
const table = document.querySelector('table')
const URL = 'https://plotpet2015.amocrm.ru'
const TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijk1YjEwMzYyNjg3MGRlYzEyZGY3YjIzMmIwMTIyNmMwM2I0MTVhNDdlMzdmYzQ3NDE3MjY0NjY4ZmM1OWRhMzY2NDQ4NTU3ZjVjY2Y3YjE3In0.eyJhdWQiOiI5NTZhYWYxYi1kYzY3LTRiNmEtYjc0ZC1mMDg4MDM4M2M3ZjMiLCJqdGkiOiI5NWIxMDM2MjY4NzBkZWMxMmRmN2IyMzJiMDEyMjZjMDNiNDE1YTQ3ZTM3ZmM0NzQxNzI2NDY2OGZjNTlkYTM2NjQ0ODU1N2Y1Y2NmN2IxNyIsImlhdCI6MTcyNzg1NzM2NywibmJmIjoxNzI3ODU3MzY3LCJleHAiOjE3Mjg1MTg0MDAsInN1YiI6IjExNTc4MzE4IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxOTc3MDQ2LCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiZjBhZDc3MjctNDNlZC00NzhhLTg1MmMtMzcyNTA1NWI4ZjI4IiwiYXBpX2RvbWFpbiI6ImFwaS1iLmFtb2NybS5ydSJ9.EgEYPfX_eqiTkoSowXH-3M8el_P4IKdC_7MaPwih9Dvcqczsp0zR8U1rekJxQpLEgmKhfYW4KYuMK6HqNP7UUhj7a_XUfaFwaeAcGR25qjqdbKt3x9MLf_vc28IQihGk7cRARWabAp6CWwUC0OYct6JO2mkK_v5Q2o28sfGOxAcTpRrefPa5UAh1PbXdft_AvCGNfljb5QEYvHGV749Y-RyqF1qcYr_cubShr6F0dX_ou9Jb-ghGhSjluOLgL8v-duBBGkQsHBNLcLtz3_sMxFZKnIHgQVjo2IHl62bYkF1lcjCxKB5F0jg_XyoZGYu1KS_1xnc7Dz7Ht_e-zSXx-g'

renderListDeals(TOKEN, URL)

async function getDeals (token, url, page, limit) {
    try {
        const response = await fetch(`${url}/api/v4/leads?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
        });

        const data = await response.json()

        return data
  
    } catch (error) {
      console.log(error);
    }
}

function renderListDeals(token, url) {

    const listOfDeals = []
    
    const intervalId = setInterval(() => {

        let page = 1 
        let limit = 3

        const data = getDeals(token, url, page, limit)

        listOfDeals.push(...data._embedded.leads)

        page++

        if(!data._links.next){

            clearInterval(intervalId) 
            addEventForPopup(token, url)
        }
    }, 1000);
    
    addArrayDealsInHtml(listOfDeals, htmlElement)

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

                renderPopup(event.target.parentNode, token, url)

                setTimeout(() => {

                    popupOpen(popup) 
                    event.target.parentNode.classList.remove('loading')

                }, 500);
                
            })
        }
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

            return data

        }

    } catch (e) {
      console.log(e);
    }
}

function renderPopup(parent, token, url) {

    const popupContent = document.querySelector('.wrapper-content')
    const closeButton = document.querySelectorAll('.close-popup')

    const data = getDealById(parent, token, url)
    insertDealsDataIntoPopup(data, popupContent)

    closeButton.addEventListener('click',(event)=>{
        event.preventDefault()

        popupClose(closeButton.closest('.modal'))

    })
   

    document.addEventListener('keydown', button => closePopupToEsc(button))
}

function closePopupToEsc(btn) {

    if(btn.key === 'Escape'){

        const popupActive = document.querySelector('.modal.open')
        popupClose(popupActive)

    }
}

function insertDealsDataIntoPopup(deal, popup){

    const popupContent = document.createElement('div')

    popupContent.innerHTML = `
        <h2>${deal.name}</h2>
        <p>id сделки: ${deal.id}</p>
        <p>дата сделки: ${getDateFromTimestamp(deal.created_at)} </p>
        <div class="task ${getStatusColorTask(deal.closest_task_at)}">статус задачи:</div>        
    ` 
    popupContent.classList.add('content')

    popup.insertAdjacentElement('beforeend', popupContent);

}

function getStatusColorTask(timestamp) {
   
        const statusColor ={
            expired: 'red',
            current: 'green',
            upcoming: 'yellow'
        }

        if(timestamp){

            const today = new Date()
            today.setHours(0, 0, 0, 0)
            today.getTime() 

            const dateTask = new Date(timestamp * 1000)
            dateTask.setHours(0,0,0,0)
            dateTask.getTime()
        
            if(today === dateTask){
                return statusColor.current
            }
        
            if(today < dateTask){
                return statusColor.upcoming
            }
        }
        
    return statusColor.expired
        
}

function getDateFromTimestamp(timestamp) {

    const date = new Date(timestamp*1000)

    return date.toLocaleDateString()
}

