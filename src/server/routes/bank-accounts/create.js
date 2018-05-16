import DB from './../../db';

const db = new DB();

const create = async (req, res) => {
  await db.init();

  const userId = req.userId;

  res.json({ success: true, userId });
};

export default create;