const express = require('express');
const slugify = require('slug');

const DB = require('./../db').default;
const verifyToken = require('./../verify-token').default;

const router = express.Router();
const db = new DB();

const filterByMonth = monthDate => {
  if (!monthDate) {
    return '';
  }

  let [year, month] = monthDate.split('-');

  return `
    and month(a.start_time) = ${month} 
    and year(a.start_time) = ${year}
  `;
};

router.get('/:slug', verifyToken, async (req, res) => {
  const slug = req.params.slug;
  const userId = req.userId;
  const month = req.query.month || '';

  const project = await db.queryOne(`
    select id, name, slug
    from projects 
    where slug = '${slug}' and user_id = ${userId}
  `);

  const activities = await db.query(`
    select 
      a.id, 
      a.name, 
      a.start_time as 'startTime', 
      a.end_time as 'endTime',
      a.duration_minutes as 'durationMinutes'
    from activities a
    where a.project_id = ${project.id}
    ${filterByMonth(month)}
    order by a.start_time asc
  `);

  res.json({ success: true, project, activities });
});

router.get('/', verifyToken, async (req, res) => {
  const projects = await db.query(`
    select name, slug
    from projects
    where user_id = ${req.userId}
  `);

  res.json(projects);
});

router.post('/', verifyToken, async (req, res) => {
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