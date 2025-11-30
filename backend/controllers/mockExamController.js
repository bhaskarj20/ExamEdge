
const path = require("path");
const fs = require("fs");


const mockDataPath = path.join(process.cwd(), "mock-data");

exports.listMocks = (req, res) => {
  try {
    let exam = (req.query.exam || "jee").toLowerCase();

    const folder = path.join(mockDataPath, exam);
    console.log("Looking for mocks in:", folder);

    if (!fs.existsSync(folder)) {
      console.log("Folder not found:", folder);
      return res.json({ success: true, mocks: [] });
    }

    const files = fs.readdirSync(folder).filter(f => f.endsWith(".json"));

    const mocks = files.map(file => {
      const id = file.replace(".json", "");
      return {
        id,
        title: id === "mock1" ? "JEE Main Mock Test 1 - Full Syllabus" : 
               id === "mock2" ? "JEE Main Mock Test 2 - Latest Pattern" : 
               id.toUpperCase(),
        exam: "JEE",
        duration: 180,
        totalQuestions: 90,
        difficulty: "Advanced"
      };
    });

    res.json({ success: true, mocks });
  } catch (err) {
    console.error("List mocks error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.loadMock = (req, res) => {
  try {
    const { exam, id } = req.params;
    const filePath = path.join(mockDataPath, exam.toLowerCase(), `${id}.json`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "Mock not found" });
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    res.json({ success: true, mock: data });
  } catch (err) {
    console.error("Load mock error:", err);
    res.status(500).json({ success: false, message: "Failed to load mock" });
  }
};