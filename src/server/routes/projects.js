const express = require('express');
const slugify = require('slug');

const DB = require('./../db');
const verifyToken = require('./../verify-token');

const router = express.Router();
const db = new DB();

router.get('/', verifyToken, async (req, res) => {
  await db.init();

  const projects = await db.query(`
    select id, name 
    from projects
    where user_id = ${req.userId}
  `);

  res.json(projects);
});

router.post('/', verifyToken, async (req, res) => {
  await db.init();

  const userId = req.userId;

  if (!req.body.name) {
    return res.status(403).json({ success: false, message: 'Missing name' });
  }

  const name = req.body.name;
  const slug = slugify(req.body.name).toLowerCase();

  const project = await db.queryOne(`
    select id 
    from projects 
    where user_id = ${userId} and slug = '${slug}'
  `);

  if (project) {
    return res.status(500).json({ 
      success: false, 
      message: 'Project already exists' 
    });
  }

  const id = await db.execute(`
    insert into projects (name, slug, user_id) 
    values ('${name}', '${slug}', ${userId}) 
  `);

  if (!id) {
    return res.status(500).json({ success: false, message: 'Cannot insert' });
  }

  const newProject = await db.queryOne(`
    select id, name, slug from projects where id = ${id}
  `);

  if (!newProject) {
    return res.status(500).json({ success: false, message: 'Error' });
  }

  res.json({ success: true, project: newProject });
});

module.exports = router;