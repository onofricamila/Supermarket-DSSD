[Mostrar todos los productos](http://localhost:3000/api/products)

[Ordenar por nombre descendiente](http://localhost:3000/api/products?sort=[{"field":"name","mode":"DESC"}])

[Ordenar por precio de venta descendiente y por nombre ascendente](http://localhost:3000/api/products?sort=[{"field":"saleprice","mode":"DESC"},{"field":"name","mode":"ASC"}])

[Muestra solo los que tiene precio de venta igual a 15](http://localhost:3000/api/products?filter=[{"field":"saleprice","operator":"=","value":15}])

[Muestra los que tienen precio de venta igual a 15, ordenados por nombre descendiente](http://localhost:3000/api/products?sort=[{"field":"name","mode":"DESC"}]&filter=[{"field":"saleprice","operator":"=","value":15}])

[Muestra los que tienen precio de venta igual a 10 y costo < a 50](http://localhost:3000/api/products?filter=[{"field":"saleprice","operator":"=","value":10},{"field":"costprice","operator":"<","value":5}])

[Muestra los primeros 3](http://localhost:3000/api/products?pagination={"limit":3})

[Muestra 3 salteandose los primeros 3](http://localhost:3000/api/products?pagination={"offset":3,"limit":3})

[Muestra los productos con nombre que empieza con o](http://localhost:3000/api/products?filter=[{"field":"name","operator":"LIKE","value":"o%25"}])


--------------------------------------------------------------------------------



[Mostrar todos los empleados](http://localhost:3001/api/employees)

[Ordenar por nombre descendiente](http://localhost:3001/api/employees?sort=[{"field":"firstname","value":"DESC"}])

[Ordenar por tipo de empleado descendiente y por nombre ascendente](http://localhost:3001/api/employees?sort=[{"field":"employeetype","value":"DESC"},{"field":"firstname","value":"DESC"}])

[Muestra solo los que tienen apellido Perez](http://localhost:3001/api/employees?filter=[{"field":"surname","value":"Perez"}])

[Muestra solo los que tienen apellido Perez, ordenados por nombre descendiente](http://localhost:3001/api/employees?filter=[{"field":"surname","value":"Perez"}]&sort=[{"field":"firstname","value":"DESC"}])

[Muestra solo los que tienen apellido Perez](http://localhost:3001/api/employees?filter=[{"field":"surname","value":"Perez"},{"field":"firstname","value":"Juan"}])

[Muestra los primeros 3](http://localhost:3001/api/employees?pagination={"offset":0,"limit":3})

[Muestra 3 salteandose los primeros 3](http://localhost:3001/api/employees?pagination={"offset":2,"limit":3})

Devuelve si el email ingresado pertenece a un empleado

* [Este es empleado](http://localhost:3001/api/isEmployee/pedroperez@gmail.com)

* [Este no es empleado](http://localhost:3001/api/isEmployee/pedroasdasdperez@gmail.com)

Devuelve el precio de un producto, que varia si el email ingresado es de un empleado o no

* [Este es empleado](http://localhost:3001/api/priceFor/pedroperez@gmail.com/2)

* [Este no es empleado](http://localhost:3001/api/priceFor/pedroperezasdasd@gmail.com/2)
