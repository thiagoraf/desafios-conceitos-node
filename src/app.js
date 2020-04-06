const express = require("express");
const { uuid, isUuid } = require("uuidv4");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

function validateProjectId(request, response, next)
{
    const {id} = request.params;

    if(!isUuid(id)){
        return response.status(400).json({error: "invalid param!"})
    }

    return next();
}

app.use('/repositories/:id', validateProjectId);
app.use('/repositories/:id/like', validateProjectId);

const repositories = [];

app.get("/repositories", (request, response) => {
   return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(200).json(repository);
});

app.put("/repositories/:id", (request, response) => {
    const { id } = request.params;
    const { title, url, techs } = request.body;

    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    repositories[repositoryIndex] = {
      ...repositories[repositoryIndex],
      title,
      url,
      techs
    };

    return response.status(200).json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (req, res) => {
    const { id } = req.params;

    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    if( repositoryIndex < 0)
    {
        return res.status(400).json({ error : "Repository not found."})
    }

    repositories.splice(repositoryIndex, 1);

    return res.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
    const { id } = request.params;

    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    const likes = repositories[repositoryIndex].likes + 1;

    repositories[repositoryIndex] = {
      ...repositories[repositoryIndex],
      likes
    };

    return response.status(200).json(repositories[repositoryIndex]);
});

module.exports = app;
