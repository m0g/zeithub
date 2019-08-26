import * as moment from 'moment';
import DB from './../../db';

const db = new DB();

export default async (req, res) => {
  for (const attr of ['name', 'start', 'end', 'projectId']) {
    if (!req.body[attr]) {
      return res
        .status(403)
        .json({ success: false, message: `Missing ${attr}` });
    }
  }

  const { name, start, end, projectId } = req.body;
  const duration = moment.duration(moment(end).diff(moment(start)));

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
      [name, duration.asMinutes(), start, end, projectId, req.userId]
    );
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: 'Error on insert', err });
  }

  res.json({ success: true });
};
