# Supermarket-DSSD | 2018

## Grupo 1:
- Liptak Franco Emanuel
- Onofri Camila
- Raimondi Sebastián

## Requisitos para poder usar las APIs
1. Instalar **Node.js**, ver [aqui](https://nodejs.org/es/download/package-manager/).
2. Necesitamos la herramnienta **npm** que viene junto con Node.js. Para ver si estan ambos instalados correctamente, correr en una terminal `node -v` y `npm -v`, respectivamente.
3. Instalar **PostgreSQL**, ver [aqui](https://www.postgresql.org/download/).

## Como usar las APIs:

- Una vez descargados los archivos correspondientes a las mismas ...
    - Considerar se debe agregar un archivo .env en cada una de las carpetas de las APIs que setee la info de la db que usa cada API, ya que usamos [Dotenv](https://www.npmjs.com/package/dotenv) para ocultar los datos importantes de acceso a cada db. Debe tener el siguiente formato, considrando debe completarse con cada valor inmediatamente después del signo igual:
    ```
    DB_HOST=
    DB_NAME=
    DB_PORT=
    DB_USER=
    DB_PASS=
    ```


- Ahora, parados en las carpetas que refieren a cada una, correr ... 
    - ` psql -f "archivo sql"` para inicializar la db que usa la API
    - ` npm install` para instalar las dependencias que necesita la API para funcionar correctamente.
    - ` npm start` para levantar un servidor web en el puerto 3000 y poder acceder a los endpoints.



## Fundamentación de tecnologías elegidas

Elgimos trabajar con Node.js (específiccamente usando el framework Express.js), ejecutando así Javascript del lado del servidor. Lo que nos motivó a realizar ésta elección es la creciente popularidad de Node.js, considerando el buen rendiemiento, velocidad de desarrollo y la posibilidad que brinda de construir aplicaiones potentes, escalables y flexibles, sumado a la enorme comunidad que posee. Por otra parte, pensando en las bases de datos que soporta Heroku, decidimos usar PostgreSQL.

## Endpoints

### :rocket: stockAPI

**GET /api/products**
Lista todos los productos, cada uno con sus atributos. Se pueden pasar parametros json por la url para obtener la funcionalidad de ordenamiento, filtrado y paginación. Estos son:

- parámetro _sort_, que en su interior posee los distintos criterios por los cuales se va a querer ordenar. Cada criterio tiene _field_(indica que campo se va a usar para ordenar) y _mode_(si se ordenará de forma ascendente o descedente).
- parámetro _filter_, que en su interior posee todos los criterios de filtro. Cada criterio debe indicar _field_(campo a analizar) _operator_(operador a usar) y _value_(valor que se busca).
- parámetro _pagination_, que en su interior indica _limit_(límite) y puede indicar o no _offset_(a partir de cual producto se empiezan a devolver productos).

Algunos ejemplos:

```
 GET /api/products?sort={%22first%22:{%22field%22:%22name%22,%22mode%22:%22DESC%22}}&filter={%22first%22:{%22field%22:%22saleprice%22,%22operator%22:%22=%22,%22value%22:15}}

 --> Devuelve todos los productos cutyo precio de venta es igual a $15, ordenados por nombre de manera ascendente.
```

```
GET /api/products?pagination={%22offset%22:3,%22limit%22:3}

--> Devuelve 3 productos considerando se saltean los 3 primeros
```

**GET /api/products/:id**
Devuelve el producto que se le indica por el parámetro numérico _id_

**GET /api/products/:id/marginInfo**
Devuelve el margen del producto que se le indica por el parámetro numérico _id_, junto con un booleano que indica si éste supera al 10% del precio de venta.


**GET /api/products/:id/isElectroValue**
Devuelve un booleano que indica si el producto que se le indica por el parámetro numérico _id_ pertenece a la categoría de electrónicos o no.





### :rocket: staffAPI


**GET /api/employees**
Lista todos los empleados, cada uno con sus atributos, menos su contraseña. Se pueden pasar parametros json por la url para obtener la funcionalidad de ordenamiento, filtrado y paginación. Estos son:

- parámetro _sort_, arreglo que contiene los distintos criterios por los cuales se va a querer ordenar. Cada criterio tiene _field_(indica que campo se va a usar para ordenar) y _value_ (si se ordenará de forma ascendente o descedente).
- parámetro _filter_, arreglo que contiene todos los criterios de filtro. Cada criterio debe indicar _field_(campo a analizar) y _value_(valor que se busca).
- parámetro _pagination_, que en su interior indica _limit_(límite) y _offset_(a partir de cual producto se empiezan a devolver productos).

Algunos ejemplos:

```
 GET /api/employees?sort=[{"field":"id","value":"DESC"}]&filter=[{"field":"employeetype","value":1}]

 --> Devuelve todos los empleados cuyo tipo de empleado sea 1, ordenados por id de forma descendiente.
```

```
GET /api/employees?pagination={"offset":3,"limit":3}

--> Devuelve 3 productos considerando se saltean los 3 primeros
```

**GET /api/employees/:id**
Devuelve el producto que se le indica por el parámetro numérico _id_

**GET /api/isEmployee/:email**
Devuelve si el email ingresado por parametro email pertenece a algun empleado registrado.

**GET /api/priceFor/:email/:productID**
Devuelve el precio de venta del producto ingresado, para el email ingresado. Si el email ingresado pertenece a un empleado, el precio devuelto sera el costo del producto. Caso contrario devolvera el precio normal.
