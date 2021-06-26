
const server = 'http://localhost:3002/eea';

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
        let l = ``,same = true;
        let j = JSON.parse(res);
        for(let i=0;i<j.length;i++){
            if(r.length !== j.length || r[i]._id !== j[i]._id){same = false; break}
        }
        if(!same){
        r = j;   
        r.forEach((el) => {
            l +=`
            
                    <li>
                        <p>Titre: ${el.title} </p>
                        <p>Orateur: ${el.author} </p>
                        <button id="voir" class=${el._id}> Lire </button>
                        <button id="delete" class=${el._id+1}> Supprimer </button>
                    </li>
                        
            
                `
        });
        l = `<ul>${l}</ul>` 
        document.getElementById('other').innerHTML = l;
        r.map((el,i,tab)=>{
            document.getElementsByClassName(`${el._id+1}`)[0].addEventListener('click',()=>{
                document.getElementById('jumbotron').innerHTML = `
                <p>Titre: ${el.title} </p>
                <p>Orateur: ${el.author} </p>
                <audio src=${el.audio} controls></audio>
                                                              `;
                if(confirm('Voulez vous vraiment supprimer cet audio')){
                    ajax.DELETE(server,el._id);
                    let a = (i == tab.length -1? i - 1 : i+1);
                    console.log(tab[a]);
                    document.getElementById('jumbotron').innerHTML =
                        `<p> ${tab[a].title} </p>
                        <audio src=${tab[a].audio} controls></audio>`;
                    alert('Audio supprimer');
                };

            })
        })

        r.map((el)=>{
            document.getElementsByClassName(el._id)[0].addEventListener('click',()=>{
                document.getElementById('jumbotron').innerHTML =
                 `<p>Titre: ${el.title} </p>
                 <p>Orateur: ${el.author} </p>
                   <audio src=${el.audio} controls></audio>
                 `;
                
            })
        })
        
    }})
}

document.onloadstart = work;
document.onloadstart();


let j = document.querySelector('form');
j.addEventListener('submit',async(ev)=>{
    ev.preventDefault()
    const dat = new FormData();
    let b;
    dat.append('avatr',ev.target[2].files[0])
    b = await ajax.post(dat,'http://localhost:3002/uplad');
    console.log(b)
   
    const audio = {
        author:ev.target[0].value,
        title:ev.target[1].value,
        audio:b
    }

    ajax.POST(server,audio); 
    for(let at in ev.target)ev.target[at].value = ''

})

setInterval(work, 10000);
 