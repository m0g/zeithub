import DB from './../../db';

const db = new DB();

export default async (req, res) => {
  let activities;

  try {
    activities = await db.query(`
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
      order by a.start_time asc
    `);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error on select',
      error
    });
  }

  if (activities) {
    return res.json({ success: true, activities });
  }

  return res
    .status(500)
    .json({ success: false, message: 'Activities not found' });
};
