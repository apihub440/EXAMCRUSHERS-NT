import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  const parentApi = "https://nt-proxy-new.vercel.app/api/batches";

  try {
    const response = await fetch(parentApi);
    if (!response.ok) throw new Error("Failed to fetch parent API");

    const data = await response.json();

    const modifiedData = data.data.map(batch => ({
      _id: batch._id,
      title: batch.title.trim(),
      image: batch.image,
      liveTitle: batch.liveTitle || "",
      liveLink: batch.liveLink || "",
      courseUrl: `https://nt-examcrushers-api.vercel.app/api/course?id=${batch._id}`
    }));

    const result = {
      status: 200,
      message: "NT ExamCrushers Batch List Loaded Successfully!",
      data: modifiedData,
      meta: {
        dataFrom: "NT ExamCrushers API",
        timestamp: new Date().toISOString()
      },
      success: true
    };

    // Save courses.json in public folder
    const filePath = path.join(process.cwd(), "public", "courses.json");
    fs.writeFileSync(filePath, JSON.stringify(result, null, 2));

    res.status(200).json(result);

  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Failed to fetch batches.",
      error: err.message,
      success: false
    });
  }
}
