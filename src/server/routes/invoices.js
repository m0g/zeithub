const express = require('express');
const moment = require('moment');

const DB = require('./../db');
const verifyToken = require('./../verify-token');

const router = express.Router();
const db = new DB();

router.get('/:number', verifyToken, async (req, res) => {
  await db.init();

  const number = req.params.number;
  const userId = req.userId;

  const invoice = await db.queryOne(`
    select id, number, name, date, due_date as 'dueDate'
    from invoices
    where number = ${number} and user_id = ${userId}
  `);

  const activities = await db.query(`
    select
      a.id, 
      a.name, 
      a.start_time as 'startTime', 
      a.end_time as 'endTime',
      a.duration_minutes as 'durationMinutes',
      p.name as 'projectName',
      p.slug as 'projectSlug'
    from activities a
    join projects p on a.project_id = p.id
    where a.user_id = ${req.userId}
    and a.invoice_id = ${invoice.id}
    order by a.start_time asc
  `);

  res.json({ success: true, invoice, activities });
});

router.get('/', verifyToken, async (req, res) => {
  await db.init();

  const userId = req.userId;

  const invoices = await db.query(`
    select number, name, date
    from invoices
    where user_id = ${userId}
    order by date desc
  `);

  res.json({ success: true, invoices });
});

router.post('/', verifyToken, async (req, res) => {
  await db.init();

  if (!req.body.name) {
    return res.status(403).json({ success: false, message: 'Missing name' });
  }

  if (!req.body.hourlyRate) {
    return res.status(403).json({ success: false, message: 'Missing hourly rate' });
  }

  if (!req.body.month) {
    return res.status(403).json({ success: false, message: 'Missing month' });
  }

  if (!req.body.projectSlug) {
    return res.status(403).json({ success: false, message: 'Missing project' });
  }

  const userId = req.userId;
  const { hourlyRate, projectSlug } = req.body;
  
  const [ year, month ] = req.body.month.split('-');

  const project = await db.queryOne(`
    select id
    from projects
    where user_id = ${userId} and slug = '${projectSlug}'
  `);

  if (!project) {
    return res.status(500).json({ success: false, message: 'Project does not exists' });
  }

  const dueDate = moment().add(1, 'month').format('YYYY-MM-DD');
  let number = 1;

  const lastInvoice = await db.queryOne(`
    select number
    from invoices
    where user_id = ${userId}
    order by id desc
    limit 1
  `);

  if (lastInvoice && lastInvoice.number) {
    number = parseInt(lastInvoice.number) + 1;
  }

  const invoiceId = await db.execute(`
    insert into invoices (user_id, date, due_date, name, number, project_id)
    values (${userId}, curdate(), '${dueDate}', 'test', ${number}, ${project.id})
  `);

  const activityInvoices = await db.execute(`
    update activities
    set invoice_id = ${invoiceId}
    where month(start_time) = ${month}
    and year(start_time) = ${year}
    and project_id = ${project.id}
    and user_id = ${userId}
  `);

  res.json({ success: true, invoiceId, activityInvoices });
});

module.exports = router;
 