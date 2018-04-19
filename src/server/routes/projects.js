const express = require('express');
const slugify = require('slug');

const DB = require('./../db');
const verifyToken = require('./../verify-token');

const router = express.Router();
const db = new DB();

router.get('/', verifyToken, async (req, res, next) => {
  await db.init();

  console.log('username', req.username, req.userId);
  const projects = await db.query('select id, name from projects');
  console.log('projects', projects);

  res.json(projects);
});

router.post('/', verifyToken, async (req, res, next) => {
  await db.init();

  if (!req.body.name) {
    return res.status(403).json({ success: false, message: 'Missing name' });
  }

  const name = req.body.name;
  const slug = slugify(req.body.name);

  const project = await db.queryOne(`
    select id 
    from projects 
    where id = ${req.userId} and slug = '${slug}'
  `)

  if (project) {
    return res.status(500).json({ 
      success: false, 
      message: 'Project already exists' 
    });
  }

  const id = await db.execute(`
    insert into projects (name, slug) values ('${name}', '${slug}') 
  `);

  if (!id) {
    return res.status(500).json({ success: false, message: 'Cannot insert' });
  }

  const newProject = await db.queryOne(`
    select id, name, slug from projects where id = ${id}
  `)

  if (!newProject) {
    return res.status(500).json({ success: false, message: 'Error' });
  }

  res.json({ success: true, project: newProject });
});

module.exports = router;

