const express = require("express");
const slugify = require("slug");

const DB = require("./../db").default;
const verifyToken = require("./../verify-token").default;

const router = express.Router();
const db = new DB();

const filterByMonth = monthDate => {
  if (!monthDate) {
    return "";
  }

  let [year, month] = monthDate.split("-");

  return `
    and month(a.start_time) = ${month} 
    and year(a.start_time) = ${year}
  `;
};

router.get("/:slug", verifyToken, async (req, res) => {
  const slug = req.params.slug;
  const userId = req.userId;
  const month = req.query.month || "";

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

router.get("/", verifyToken, async (req, res) => {
  const projects = await db.query(`
    select name, slug
    from projects
    where user_id = ${req.userId}
  `);

  res.json(projects);
});

router.put("/:slug", verifyToken, async (req, res) => {
  const userId = req.userId;
  const slug = req.params.slug;

  if (!req.body.clientId) {
    return res
      .status(403)
      .json({ success: false, message: "Missing client id" });
  }

  const clientId = req.body.clientId;

  try {
    await db.execute(
      "update projects set client_id = ? where slug = ? and user_id = ?",
      [clientId, slug, userId]
    );
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }

  return res.json({ success: true });
});

router.post("/", verifyToken, async (req, res) => {
  const userId = req.userId;

  if (!req.body.name) {
    return res.status(403).json({ success: false, message: "Missing name" });
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
      message: "Project already exists"
    });
  }

  const id = await db.execute(`
    insert into projects (name, slug, user_id) 
    values ('${name}', '${slug}', ${userId}) 
  `);

  if (!id) {
    return res.status(500).json({ success: false, message: "Cannot insert" });
  }

  const newProject = await db.queryOne(`
    select id, name, slug from projects where id = ${id}
  `);

  if (!newProject) {
    return res.status(500).json({ success: false, message: "Error" });
  }

  res.json({ success: true, project: newProject });
});

router.get("/:slug/clients", verifyToken, async (req, res) => {
  const slug = req.params.slug;
  const userId = req.userId;

  const clients = await db.query(`
    select c.id, c.name
    from clients c
    join projects p on c.id = p.client_id
    where c.user_id = ${userId}
    and p.slug = '${slug}'
  `);

  res.json({ success: true, clients });
});

router.post("/:slug/clients", verifyToken, async (req, res) => {
  const slug = req.params.slug;
  const userId = req.userId;
  let clientId;

  if (!req.body.name) {
    return res.status(403).json({ success: false, message: "Missing name" });
  }

  const name = req.body.name;

  try {
    clientId = await db.execute(`
      insert into clients (name, user_id)
      values ('${name}', ${userId})
    `);
  } catch (error) {
    return res.json({ success: false, error });
  }

  try {
    await db.execute(`
      update projects
      set client_id = ${clientId}
      where slug = '${slug}'
    `);
  } catch (error) {
    return res.json({ success: false, error });
  }

  const client = await db.queryOne(`
    select id, name
    from clients
    where id = ${clientId}
  `);

  if (client) {
    return res.json({ success: true, client });
  }

  return res.json({ success: false, message: "Client not found" });
});

module.exports = router;
