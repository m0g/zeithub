import { DateTime } from 'luxon';
import DB from './../../db';

const db = new DB();
const dateFormat = 'yyyy-MM-dd HH:mm:ss';

export default async (req, res) => {
  for (const attr of ['name', 'start', 'end', 'projectId']) {
    if (!req.body[attr]) {
      return res
        .status(403)
        .json({ success: false, message: `Missing ${attr}` });
    }
  }

  console.log(DateTime.local().offset);
  const { name, start, end, projectId } = req.body;
  const startDate = DateTime.fromISO(start).toUTC();
  const endDate = DateTime.fromISO(end).toUTC();
  const duration = endDate.diff(startDate);

  console.log(startDate.toFormat(dateFormat));
  try {
    await db.execute(
      `
        insert into activities (
          name, 
          description, 
          duration_minutes, 
          start_time, 
          end_time, 
          project_id, 
          user_id
        ) values (?, '', ?, ?, ?, ?, ?)
      `,
      [
        name,
        duration.as('minutes'),
        startDate.toFormat(dateFormat),
        endDate.toFormat(dateFormat),
        projectId,
        req.userId
      ]
    );
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: 'Error on insert', err });
  }

  res.json({ success: true });
};
