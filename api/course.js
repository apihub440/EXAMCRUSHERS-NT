import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  const id = req.query.id;
  if (!id) return res.status(400).json({ error: "Course ID required" });

  try {
    const filePath = path.join(process.cwd(), "public", "courses.json");
    let data;
    if (fs.existsSync(filePath)) {
      data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    } else {
      data = { data: [] };
    }

    const course = data.data.find(c => c._id === id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    res.status(200).json(course);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
