# delilahResto
Proyecto Acamica Delilah Resto.

# Instrucciones 

1) Instalar dependencias
```
npm install
```

2) Crear variables de entrono en un archivo llamado variables.env con el siguiente contenido:
```
BD_NOMBRE=acamica
BD_USER=root
BD_PASS=
BD_HOST=localhost
BD_PORT=3306
SECRETKEY=LLAVESECRETA
```
Los valores de las variables pueden ser las que necesites segun tu configuración.

3) Crear una base de datos MySQL o mariaDB en tu servidor local con el nombre que especificaste en la variable de entrono BD_NOMBRE.

4) Iniciar el servidor 
```
npm start
```

# Especificacion de la API

Antes de usar cualquier endpoint de la API hay que crear un usuario y logearse , una vez logeado el servidor envia un token el cual se debe enviar en los headers de cada Request de la siuiente manera:

```
"Authorization": "Bearer TU_TOKEN"
```

Registar usuario:
```
/api/v1/register
```
Se deben enviar en formato JSON o en formulario URL encoded los siguientes datos POST:
```
{
    user,
    nombre,
    telefono,
    direccion,
    password,
    email,
}
```

Loguear usuario POST:
```
/api/v1/login
```
Se deben enviar en formato JSON o en formulario URL encoded los siguientes datos:
```
{
    user,    
    password
}
```

Otorgar privilegios de admin PUT:
```
/api/v1/admin/:user
```
donde user es el nombre de usuario

Endpoints:

Productos

1) Lista de productos GET:
```
/api/v1/productos
```

2) Obtener un producto GET:
```
/api/v1/productos/:id
```
donde id es el primary key del usuario.

3) Agregar producto al modelo de productos POST:
```
/api/v1/productos
```
Enviar un formdata() con los siguientes valores: nombre,precio,imagen(archivo).


4) editar producto PUT:
```
/api/v1/productos/:id
```
Igual que el caso del post , enviar un formdata() con las propiedades.

5) eliminar producto DELETE:
```
/api/v1/productos/:id
```
Igual que el caso del post , enviar un formdata() con las propiedades.

Pedidos:

1) Crear un nuevo pedido, POST:
```
/api/v1/pedidos
```
Se envia un JSON con un array con la cantidad de productos que tendra el pedido.
por ejemplo:
```
[
  {
    "id": "0NO8DNVWuL",
    "nombre": "polser hotdog",
    "precio": 400,
    "imagen": "8Pyske8uV.png"
  },
  {
    "id": "WGzqA7smsR",
    "nombre": "Hamburguesa",
    "precio": 350,
    "imagen": "rLGNsLYlb.jpeg"
  },
  {
    "id": "yGu9LKh1RJ",
    "nombre": "hamburguesa completa",
    "precio": 350,
    "imagen": "zOnaqHEh5.jpeg"
  }
]
```
este json se puede obtener del crud de productos

2) Obtener pedidos GET:
Si el usuario es admin obtiene un listado de todos los pedidos de todos los usuarios, si es un usuario comun solamente los pedidos de ese usuario.
```
/api/v1/pedidos
```


3) Obtener un solo pedido , GET:
```
/api/v1/pedidos:id
```
Obtiene un pedido por el primary key , solo un usuario admin puede usar este endpoint


4) editar pedido PUT:
```
/api/v1/pedidos/:id
```
Modifica el estado del pedido donde id es el primary key del pedido, el modelo de estados de los pedidos es de la siguiente forma:

Entonces los estados son del 1 al 5 , 1 para nuevo , 2 para confirmado, 3 para preparando , 4 para enviando y 5 para entregado , se debe enviar un cuerpo con el id del estado de la sigueinte forma.
```
{
    "estado": 2
}
```

5) eliminar pedido DELETE:
```
/api/v1/pedidos/:id
```
Elimina un pedido donde id es el primary key del pedido.

