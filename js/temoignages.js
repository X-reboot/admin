

const server = 'http://localhost:3002/tem';

let ajax = {
    
    
    GET:function(url,id){
        return new Promise((res,rej)=>{
            let xhr = new XMLHttpRequest();

            xhr.onloadend = function(){
                res(JSON.parse(this.response));
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

const work = ()=>{
    ajax.GET(server,null).then(res=>{
        let l = `<h2> Temoignages reçus </h2>`;
        l += `<div id="jumbotron">
        <p><strong>${res[0].Tem}</strong></p>
        <br>
        <p> Nombre de like : ${res[0].NbreLike} </p>
        <p> Nombre de dislike : ${res[0].NbreDisLike} </p>
        <br>
        <button id="voir" type="button" class=${res[0]._id} data-toggle="modal" data-target="#modelId"> Voir les commentaires </button>
        <button id="delete" class=${res[0]._id + 'a'}> Supprimer </button>

    </div>
    <ul>
`
        for(let i = 1;i<res.length;i++) {
            l +=`<li>
            <p><strong>${res[i].Tem}</strong></p>
            <br>
            <p> Nombre de like : ${res[i].NbreLike} </p>
            <p> Nombre de dislike : ${res[i].NbreDisLike} </p>
            <br>
            <button id="voir" type="button" class=${res[i]._id} data-toggle="modal" data-target="#modelId"> Voir les commentaires </button>
            <button id="delete" class=${res[i]._id + 'a'}> Supprimer </button>
    </li>
        `
        }
        document.getElementById('right').innerHTML = l+` <div class="modal fade" id="modelId" tabindex="-1" role="dialog" aria-labelledby="modelTitleId" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Commentaires receuillis</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                </div>
                <div class="modal-body"></div><div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
</ul>
`;
    
        for(let i = 0;i<res.length;i++){
            document.getElementsByClassName(res[i]._id)[0].addEventListener('click',()=>{
                clearInterval(timer);
                let l = ``;
                res[i].Com.forEach(element => {
                    l += `<p id="jumbotron">
                                ${element}
                         </p>
                        `
                });
                document.getElementsByClassName('modal-body')[0].innerHTML = l;
            }); 
            timer;

            document.getElementsByClassName(res[i]._id + 'a')[0].addEventListener('click',()=>{
                if(confirm('Etes vous sur de vouloir supprimer ce temoignages?')){
                    ajax.DELETE(server,res[i]._id)
                    alert('Temoignages Supprime avec success');
                }
            });
        }
    })}


const timer = setInterval(work, 10000);

document.querySelector('form').addEventListener('submit',(ev)=>{
    ev.preventDefault();
    ajax.POST(server,{Tem:ev.target[0].value});
    alert('Temoignages Ajouter avec succes');
    ev.target[0].value = ''
})