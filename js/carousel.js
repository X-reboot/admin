const server = 'http://localhost:3002/fc';

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
        let l = '';
        r = JSON.parse(res);
        r.forEach((el,i) => {
            l +=`
                <li>
                    <p> ${i+1} </p>
                    <button id="voir" class=${el._id}> Voir </button>
                    <button id="delete" class=${el.__id}> Supprimer </button>
                </li>
                `
        });
        document.getElementById('p').innerHTML = l;
        r.map((el,i,tab)=>{
            document.getElementsByClassName(el.__id)[0].addEventListener('click',(ev)=>{
                document.getElementById('img').innerHTML = `<img src=${el.img} alt="" id='r'>`;
                if(confirm('Voulez vous vraiment supprimer cette image??')){
                    ajax.DELETE(server,el.__id);
                    let a = (i == tab.length -1? i - 1 : i+1);
                    console.log(tab[a]);
                    document.getElementById('img').innerHTML = `<img src=${tab[a].img} alt="" id='r'>`;
                    alert('Image Supprimer');
                };

            })
        })

        r.map((el,i)=>{
            document.getElementsByClassName(el._id)[0].addEventListener('click',(ev)=>{
                document.getElementById('img').innerHTML = `<img src=${el.img} alt="" id='r'>`;
                
            })
        })
        
    })
}

document.onloadstart = work;
document.onloadstart();

document.querySelector('form').addEventListener('submit',async(ev)=>{
    ev.preventDefault();
    const data = new FormData();
    let r;
    data.append('avatr',ev.target[0].files[0])
    r = await ajax.post(data,'http://localhost:3002/uplad');
    console.log(r);
    const event = {
            img:JSON.parse(r)
        }

    ajax.POST(server,event)
    for(let at in ev.target)ev.target[at].value = ''

})


setInterval(work, 10000);
