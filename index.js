const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const app = express();

app.use(express.json());

const jsonPath = path.resolve('./file/todo.json');

app.get('/tasks', async(req, res) =>{
  const jsonFile = await fs.readFile(jsonPath, 'utf-8');
  res.send(jsonFile);
});

app.post('/tasks', async(req, res) =>{
  const jsonPost = req.body;
  const arrayToodos = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
  const lastId = arrayToodos[arrayToodos.length - 1].id + 1;
  arrayToodos.push({id: lastId, ...jsonPost})
  await fs.writeFile(jsonPath, JSON.stringify(arrayToodos));
  res.end();
})

app.put('/tasks', async(req, res)=>{
//   const{status, id}=req.body;
//   const jsonPut = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
//   const putId = jsonPut.findIndex((toodos) => toodos.id === id);
//   if(putId >= 0) {
//     jsonPut[putId].status = status
//   }
//   await fs.writeFile(jsonPath, JSON.stringify(jsonPut));
//   res.send('se modifico con exito');
const task = req.body;
  const taskArray = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
  const taskEdited = taskArray.map((e) => {
    if (e.id === task.id) {
      e = task
    }
    return e
  })
  await fs.writeFile(jsonPath, JSON.stringify(taskEdited));
  res.send('se logro modificar con exito');
 });

app.delete('/tasks', async(req, res) => {
  const deleteJson = JSON.parse (await fs.readFile(jsonPath, 'utf-8'))
  const {id} = req.body;
  const deleteId = deleteJson.findIndex((toodos) => toodos.id === id);
  if (deleteId >= 0) {
    deleteJson.splice(deleteId, 1);
  }
  await fs.writeFile(jsonPath, JSON.stringify(deleteJson));
  res.send('se elimino con exito')
})

const PORT = 8000;
app.listen(PORT, () => { console.log(`servidor esta conectado en pueto ${PORT}`)});