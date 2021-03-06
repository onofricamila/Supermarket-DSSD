# Supermarket-DSSD | Stock API

## Notes:

- So as to create the API, we folloed this [tutorial](https://mherman.org/blog/designing-a-restful-api-with-node-and-postgres/)


## Tips:
- [Creating user, database and adding access on PostgreSQL](https://medium.com/coding-blocks/creating-user-database-and-adding-access-on-postgresql-8bfcd2f4a91e)
    - Consider it can be necessary to grant privileges on [tables](https://stackoverflow.com/questions/15520361/permission-denied-for-relation) and [sequences](https://stackoverflow.com/questions/9325017/error-permission-denied-for-sequence-cities-id-seq-using-postgres) once conncected to a db.
    - [See how to create a role if it doesnt exists](https://stackoverflow.com/questions/8092086/create-postgresql-role-user-if-it-doesnt-exist)
- [PostgresSQL foreign key sintax](https://stackoverflow.com/questions/28558920/postgresql-foreign-key-syntax)
- Run psql from command line to enter PostgresSQL prompt
- If this is the first time you use psql, you might get `psql: FATAL:  database "<user>" does not exist`. From the terminal, just run the command on your command prompt window (not inside psql): `createdb <user>`, and then try to run postgres again.
- Once in psql prompt ...
    - Run \c <DBNAME> to use a certain database
    - Write the queries separated by ';'
    - press Crt + Z to exit the prompt
    
