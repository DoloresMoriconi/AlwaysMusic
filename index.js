const { Pool } = require('pg')

const config = {
   database: process.env.DATABASE,
   host: process.env.HOST,
   user: process.env.USERDB,
   password: process.env.PASSWORD,
   port: process.env.PORT
} //variables de entorno definidas en la línea de comandos

const pool = new Pool(config)

//consulta de conexion con la base de datos
const selectEstudiante = async() => {
   const sql = 'SELECT * FROM estudiantes'

   const result = await pool.query(sql)
   console.log(`Registro actual ${JSON.stringify(result.rows, null, 2)}`)

}

//insertar estudiante: nuevo 'Brian May' '12.345.678-9' guitarra 7
const insertEstudiante  = async () => {
   const sql = 'INSERT INTO estudiantes (nombre, rut, curso, nivel) VALUES ($1, $2, $3, $4) RETURNING *';
   const values = [process.argv[3], process.argv[4], process.argv[5], Number(process.argv[6])];

   const result = await pool.query(sql, values)
   console.log(`Estudiante ${result.rows[0].nombre} agregado con éxito`)
}

//editar estudiante: editar 'Brian May' '12.345.678-9' guitarra 10
const updateEstudiante = async () => {
   const sql = 'UPDATE estudiantes SET nombre = $2, curso = $3 , nivel = $4 WHERE rut = $1'
   const values = [process.argv[3], process.argv[4], process.argv[5], Number(process.argv[6])]
   console.log('Executing query:', sql, 'with values:', values); // Verifica los valores antes de la consulta
   const result = await pool.query(sql, values)
   console.log(`Estudiante ${values[1]} editado con éxito`)
}

//consultar estudiante por rut: rut - '12.345.678-9'
const selectEstudiantes = async () => {
   const sql = 'SELECT * FROM estudiantes WHERE rut = $1'
   const values = [process.argv[4]]
   
   const result = await pool.query(sql, values)
   console.log(result.rows)
}

 //eliminar el registro del estudiante: eliminar - '12.345.678-9'
const deleteEstudiante = async () => {
   const sql = 'DELETE FROM estudiantes WHERE rut = $1'
   const values = [ process.argv[4] ]

   const result = await pool.query(sql, values)
   console.log(`Registro de estudiante con rut ${values} eliminado`)
}

// dos opciones de función para invocar tareas
// OPCION 1:
// const inpt = process.argv[2];

// switch (inpt) {
//    case 'nuevo':
//       insertEstudiante() 
//       break;
//    case 'rut':
//       selectEstudiante() 
//       break;
//    case 'consulta':
//       selectEstudiantes() 
//       break;
//    case 'editar':
//       updateEstudiante();
//       break;
//    case 'eliminar':
//       deleteEstudiante(); // 
//       break;

//    default:
//       break;
// }

//OPCION 2:
const inpt = process.argv[2];
const funciones = {
   consulta: selectEstudiante,
   nuevo: insertEstudiante,
   editar: updateEstudiante,
   rut: selectEstudiantes,
   eliminar: deleteEstudiante
}

const ejecutar = async () => {
   funciones[inpt] ()
}

ejecutar()