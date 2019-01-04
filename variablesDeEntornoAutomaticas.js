//lees de la respuesta del login
let resp = pm.response.json();

if(resp.ok){
    let token = resp.token;
    //actualizas el token
    pm.environment.set("token",token);
    
}else{
    console.log("No se actualizo el token");
}
console.log(pm.response.json());


//pm.environment.set("token2", "lo que sea");