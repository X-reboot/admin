
const server = 'http://localhost:3002/lv';

let ajax = {
    
    
    GET:function(url,id){
        return (async(res,rej)=>{
            let xhr = new XMLHttpRequest();

            xhr.onloadend = function(){
                res(this.response);
            }
        
            let URL = [];
            for(let at in url)URL.push(url[at]);
            (URL[URL.length-1] === '/' ?'': URL.push('/'));
            let Url = URL.join('');
            if(id){
                Url+=`:id=${id}`
                xhr.open(`GET`,Url);
            }
            else xhr.open('GET',Url);
        
        xhr.send();
        
        })
        
    },
    POST:(url,data)=>{
        let xhr = new XMLHttpRequest();
        xhr.onloadend = function(){
        console.log(this.response);
    }

        let t = null;
        for(let at in data){
            if(t == null) t = `?${at}=${data[at]}`;
            else t +=`&${at}=${data[at]}`;
        }
            let URL = [];
            for(let at in url)URL.push(url[at]);
            (URL[URL.length-1] === '/'?URL.pop():'');
            let Url = URL.join('');
            console.log(Url+t)
            xhr.open('POST',Url+t);
            xhr.setRequestHeader('Content-Type','application/json');   
            xhr.send();
        

            
    },post : (data,url)=>{
        return new Promise((res,rej)=>{
            let x = new XMLHttpRequest();
            x.onloadend = function(){
                res(this.response)
            }
    
            x.open('POST',url);
            //x.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
            x.send(data);
        })
    },
    PUT:(url,id,data,res)=>{
        if(data){
            if(id){
                let xhr = new XMLHttpRequest();
                xhr.onloadend = function(){
                    console.log(this.response);
                    res = this.response;
                }
    
                    let URL = [];
                    for(let at in url)URL.push(url[at]);
                    (URL[URL.length-1] === '/' ? '':URL.push('/'));
                    let Url = URL.join('')+`:id=${id}`;
                    let t = null;
                    for(let at in data){
                        if(t == null) t = `?${at}=${data[at]}`;
                        else t +=`&${at}=${data[at]}`;
                    }

                    Url += t;
                    xhr.open(`PUT`,Url);
                    xhr.send();
                
                
            }
            else alert('Need Element For request PUT');
        }
        
        else alert('Need Element For request PUT');

    },
    DELETE:(url,id)=>{
        if(id){
            let xhr = new XMLHttpRequest();
            xhr.onloadend = function(){
                console.log(this);
            }

            let URL = [];
            for(let at in url)URL.push(url[at]);
            (URL[URL.length-1] === '/' ? '':URL.push('/'));
            let Url = URL.join('')+`:id=${id}`;
            console.log('url='+ Url)
            xhr.open(`DELETE`,Url);
            xhr.send();
        
        
        }
        else alert('Need Element For request DELETE');
    }   
}
let r = [];

let p = ajax.GET(server,null);

function work(){
    p(res=>{
        let l = ``;
        r = JSON.parse(res);
        r.forEach((el) => {
            l +=`
                <ul>
                    <li>
                        <p> ${el.title} </p>
                        <button id="voir" class=${el._id}> Voir </button>
                        <button id="delete" class=${el.__id}> Supprimer </button>
                    </li>
                        
                </ul>
                `
        });
        document.getElementById('right').innerHTML = l;
        r.map((el,i,tab)=>{
            document.getElementsByClassName(el.__id)[0].addEventListener('click',()=>{
                document.getElementById('img').innerHTML = `
                    <p> Nom du livre : ${el.title}</p>
                    <p> Montant : ${el.montant}</p>
                    <p> Citation : ${el.citation.info}</p>
                    <p> Auteur : ${el.Author.name}}</p>
                    <p> Couverture </p>
                    <img src=${el.img} alt="">
                                                              `;
                if(confirm('Voulez vous vraiment supprimer ce livre??')){
                    ajax.DELETE(server,el.__id);
                    let a = (i == tab.length -1? i - 1 : i+1);
                    console.log(tab[a]);
                    document.getElementById('img').innerHTML =
                        `<p> Nom du livre : ${tab[a].title}</p>
                        <p> Montant : ${tab[a].montant}</p>
                        <p> Citation : ${tab[a].citation.info}</p>
                        <p> Auteur : ${tab[a].Author.name}}</p>
                        <p> Couverture </p>
                        <img src=${tab[a].img} alt="">
                        `;
                    alert('Livre Supprimer');
                };

            })
        })

        r.map((el)=>{
            document.getElementsByClassName(el._id)[0].addEventListener('click',()=>{
                document.getElementById('img').innerHTML =
                 `<p> Nom du livre : ${el.title}</p>
                 <p> Montant : ${el.montant}</p>
                 <p> Citation : ${el.citation.info}</p>
                 <p> Auteur : ${el.Author.name}</p>
                 <p> Couverture </p>
                 <img src=${el.img} alt="">
                 `;
                
            })
        })
        
    })
}

document.onloadstart = work;
document.onloadstart();


let j = document.querySelector('form');
j.addEventListener('submit',async(ev)=>{
    ev.preventDefault()
    const data = dat = new FormData();
    let r,b;
    data.append('avatr',ev.target[5].files[0]);
    dat.append('avatr',ev.target[7].files[0])
    
    r = await ajax.post(data,'http://localhost:3002/uplad');
    b = await ajax.post(dat,'http://localhost:3002/uplad');
   
    const livre = {
        Author:ev.target[6].value,
        montant:ev.target[1].value,
        img:data,
        title:ev.target[0].value,
        about:ev.target[3].value,
        citation:ev.target[2].value,
        ref:ev.target[4].value,
        pic:dat
    }

    ajax.POST(server,livre); 
    for(let at in ev.target)ev.target[at].value = ''

})

setInterval(work, 10000);
