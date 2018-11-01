import DB from "./../../db";

const db = new DB();

export default async (req, res) => {
  const userId = req.userId;
  const id = req.params.id;

  try {
    await db.execute(
      `
        delete from clients
        where id = ? and user_id = ?
      `,
      [id, userId]
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error on delete",
      error
    });
  }

  // Remove stray addresses
  try {
    await db.execute(
      `
      delete addresses 
      FROM addresses
      left outer join clients c on c.id = addresses.client_id 
      where addresses.user_id is null
      and c.id is null 
    `,
      []
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error on delete",
      error
    });
  }
  return res.json({ success: true });
};
